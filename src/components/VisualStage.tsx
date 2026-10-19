import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Database,
  RotateCcw,
  MousePointerClick,
  TrendingDown,
  BrainCircuit
} from 'lucide-react';
import type { ThemeMode, TraceStep } from '../types';
import { MathFormula } from './MathFormula';

interface VisualStageProps {
  theme: ThemeMode;
  step: TraceStep;
  category: string;
  onChangeInput?: (newInput: string) => void;
}

// Ultra-smooth 60fps ease-out cubic interpolation hook
function useSmoothValue(target: number, durationMs = 500): number {
  const [val, setVal] = useState(target);
  const currentValRef = useRef(target);
  const startValRef = useRef(target);
  const targetValRef = useRef(target);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startValRef.current = currentValRef.current;
    targetValRef.current = target;
    startTimeRef.current = null;
    let frameId: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(1, elapsed / durationMs);
      const ease = 1 - Math.pow(1 - progress, 3);
      const next = startValRef.current + (targetValRef.current - startValRef.current) * ease;

      currentValRef.current = next;
      setVal(next);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs]);

  return val;
}

const DATA_PRESETS = [
  { label: 'Standard', value: '(1, 2.2), (2, 2.8), (3, 4.5), (4, 4.9), (5, 6.2)' },
  { label: 'Noisy', value: '(1, 1.4), (2, 3.8), (3, 3.1), (4, 5.9), (5, 5.2)' },
  { label: 'Outlier', value: '(1, 2.0), (2, 2.5), (3, 3.0), (4, 3.5), (5, 8.5)' },
  { label: 'Steep', value: '(1, 0.5), (2, 2.4), (3, 4.2), (4, 6.1), (5, 8.0)' },
];

export const VisualStage: React.FC<VisualStageProps> = ({
  theme,
  step,
  category,
  onChangeInput,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const isDark = theme === 'studio';

  // Graph sizing & zoom state
  const [zoom, setZoom] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const arr = step.state.arr;
  const points = step.state.points;
  const layers = step.state.layers;
  const tokens = step.state.tokens;
  const probabilities = step.state.probabilities;

  // Raw values from trace
  const rawW = step.state.weight !== undefined ? Number(step.state.weight) : 0;
  const rawB = step.state.bias !== undefined ? Number(step.state.bias) : 0;
  const rawLoss = step.state.loss !== undefined ? Number(step.state.loss) : 0;

  // Smooth interpolated values for fluid motion in Clean mode
  const smoothW = useSmoothValue(rawW, 360);
  const smoothB = useSmoothValue(rawB, 360);
  const smoothLoss = useSmoothValue(rawLoss, 360);

  // Dynamic scale limits based on data points to ensure NO point is EVER clipped
  const coordLimits = useMemo(() => {
    if (!points || points.length === 0) return { maxX: 6, maxY: 10, yStep: 2 };
    const allX = points.map((p) => p.x);
    const allY = points.map((p) => p.y);
    const maxDataX = Math.max(...allX, 5);
    const maxDataY = Math.max(...allY, 7);

    const maxX = Math.max(6, Math.ceil(maxDataX + 0.8));
    const maxY = Math.max(10, Math.ceil(Math.max(maxDataY, rawW * maxX + rawB) + 1.8));
    const yStep = maxY > 14 ? 4 : 2;
    return { maxX, maxY, yStep };
  }, [points, rawW, rawB]);

  // Coordinate projection mapping
  const SVG_W = 740;
  const SVG_H = 370;
  const PAD = { left: 65, right: 45, top: 40, bottom: 50 };
  const plotW = SVG_W - PAD.left - PAD.right;
  const plotH = SVG_H - PAD.top - PAD.bottom;

  const toSvgX = (x: number) => PAD.left + (x / coordLimits.maxX) * plotW;
  const toSvgY = (y: number) => PAD.top + plotH - (y / coordLimits.maxY) * plotH;
  const toMathX = (svgX: number) => Number((Math.max(0, ((svgX - PAD.left) / plotW) * coordLimits.maxX)).toFixed(1));
  const toMathY = (svgY: number) => Number((Math.max(0, ((PAD.top + plotH - svgY) / plotH) * coordLimits.maxY)).toFixed(1));

  // Interactive Click to Add Point
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onChangeInput || !points) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickSvgX = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const clickSvgY = ((e.clientY - rect.top) / rect.height) * SVG_H;

    if (
      clickSvgX >= PAD.left &&
      clickSvgX <= PAD.left + plotW &&
      clickSvgY >= PAD.top &&
      clickSvgY <= PAD.top + plotH
    ) {
      const newX = Math.max(0.5, Math.min(coordLimits.maxX - 0.5, toMathX(clickSvgX)));
      const newY = Math.max(0.5, Math.min(coordLimits.maxY, toMathY(clickSvgY)));
      const newPoints = [...points, { x: newX, y: newY }].sort((a, b) => a.x - b.x);
      const newStr = newPoints.map((p) => `(${p.x}, ${p.y})`).join(', ');
      onChangeInput(newStr);
    }
  };


  // Generate tick lists
  const xTicks = useMemo(() => {
    const list: number[] = [];
    for (let i = 1; i < coordLimits.maxX; i++) list.push(i);
    return list;
  }, [coordLimits.maxX]);

  const yTicks = useMemo(() => {
    const list: number[] = [];
    for (let i = coordLimits.yStep; i < coordLimits.maxY; i += coordLimits.yStep) list.push(i);
    return list;
  }, [coordLimits.maxY, coordLimits.yStep]);

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between p-4 overflow-hidden select-none transition-all duration-300 ${
        isExpanded ? 'min-h-[540px]' : 'min-h-[380px]'
      } ${
        isDark
          ? 'bg-viz-dots-dark text-white'
          : 'bg-viz-dots text-slate-800'
      }`}
    >
      {/* Stage Header Info & Flexible Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs uppercase font-mono tracking-wider px-2.5 py-1 rounded-xl font-bold shadow-xs ${
              isDark
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {category} Stage
          </span>
          <span className="text-xs opacity-60 font-mono">
            Step {step.step} / {step.totalSteps}
          </span>
        </div>

        {/* Data Controls & Graph Zoom Toolbar */}
        <div className="flex items-center gap-2">
          {/* Data Presets Selector (if Regression) */}
          {points && onChangeInput && (
            <div className="hidden sm:flex items-center gap-1">
              <Database className="w-3.5 h-3.5 opacity-60" />
              <div
                className={`flex items-center p-0.5 rounded-xl border text-[11px] font-semibold ${
                  isDark
                    ? 'bg-[#151c2d] border-[#222f46]'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                {DATA_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => onChangeInput(preset.value)}
                    className={`px-2 py-0.5 rounded-lg transition-colors ${
                      isDark
                        ? 'hover:bg-slate-700 text-slate-300'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Zoom & Size Controls */}
          <div
            className={`flex items-center p-0.5 rounded-xl border text-xs ${
              isDark
                ? 'bg-[#151c2d] border-[#222f46]'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <button
              onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.15).toFixed(2))))}
              title="Zoom Out Graph"
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-mono font-bold opacity-75">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.4, Number((z + 0.15).toFixed(2))))}
              title="Zoom In Graph"
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              title="Reset Zoom"
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsExpanded((e) => !e)}
              title={isExpanded ? 'Collapse Height' : 'Expand Height'}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ml-0.5"
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Dynamic Metric Badges */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {step.state.loss !== undefined && (
              <span
                className={`px-2.5 py-1 rounded-xl font-bold transition-all shadow-xs ${
                  isDark
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                Loss: {smoothLoss.toFixed(3)}
              </span>
            )}
            {step.state.weight !== undefined && (
              <span
                className={`px-2.5 py-1 rounded-xl font-bold transition-all shadow-xs ${
                  isDark
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                w: {smoothW.toFixed(2)} | b: {smoothB.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Stage Visual Content with Dynamic Zoom */}
      <div
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        className="relative flex-1 w-full flex items-center justify-center my-1 overflow-hidden transition-transform duration-200"
      >
        {/* ========================================================= */}
        {/* 1. DYNAMIC REGRESSION PLOT (Auto-scaled, Clickable, Clean) */}
        {/* ========================================================= */}
        {points && points.length > 0 && (
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Top Click-To-Add-Point Hint */}
            <div className="absolute top-1 left-4 z-10 flex items-center gap-1.5 text-[11px] opacity-60 font-sans pointer-events-none">
              <MousePointerClick className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span>Click anywhere on graph to add a point</span>
            </div>

            {/* Hover Tooltip for active data point */}
            {hoveredPoint !== null && points[hoveredPoint] && (
              <div
                className={`absolute top-1 right-4 z-20 px-3 py-1.5 rounded-xl border text-xs font-mono shadow-md transition-all ${
                  isDark
                    ? 'bg-slate-900 border-cyan-500/50 text-cyan-200'
                    : 'bg-white border-blue-200 text-slate-800'
                }`}
              >
                <div className="font-bold flex items-center gap-2">
                  <span>Point ({points[hoveredPoint].x}, {points[hoveredPoint].y})</span>
                  <span>|</span>
                  <span className="text-blue-500 dark:text-cyan-300">
                    ŷ = {(rawW * points[hoveredPoint].x + rawB).toFixed(2)}
                  </span>
                  <span>|</span>
                  <span className="text-rose-500">
                    Residual: {(points[hoveredPoint].y - (rawW * points[hoveredPoint].x + rawB)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Main Interactive SVG Cartesian Chart */}
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              preserveAspectRatio="xMidYMid meet"
              onClick={handleSvgClick}
              className="w-full h-full max-h-[350px] cursor-crosshair select-none"
            >
              <defs>
                <linearGradient id="regGradSmooth" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#0284c7" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Numbered Grid Lines & Ticks */}
              {xTicks.map((xVal) => (
                <g key={`x-grid-${xVal}`}>
                  <line
                    x1={toSvgX(xVal)}
                    y1={PAD.top}
                    x2={toSvgX(xVal)}
                    y2={toSvgY(0)}
                    stroke={isDark ? '#1e293b' : '#f1f5f9'}
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={toSvgX(xVal)}
                    y1={toSvgY(0)}
                    x2={toSvgX(xVal)}
                    y2={toSvgY(0) + 5}
                    stroke={isDark ? '#475569' : '#cbd5e1'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={toSvgX(xVal)}
                    y={toSvgY(0) + 18}
                    fill={isDark ? '#94a3b8' : '#64748b'}
                    textAnchor="middle"
                    className="font-mono text-[11px] font-semibold"
                  >
                    {xVal}
                  </text>
                </g>
              ))}

              {yTicks.map((yVal) => (
                <g key={`y-grid-${yVal}`}>
                  <line
                    x1={toSvgX(0)}
                    y1={toSvgY(yVal)}
                    x2={toSvgX(coordLimits.maxX)}
                    y2={toSvgY(yVal)}
                    stroke={isDark ? '#1e293b' : '#f1f5f9'}
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={toSvgX(0) - 5}
                    y1={toSvgY(yVal)}
                    x2={toSvgX(0)}
                    y2={toSvgY(yVal)}
                    stroke={isDark ? '#475569' : '#cbd5e1'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={toSvgX(0) - 10}
                    y={toSvgY(yVal) + 4}
                    fill={isDark ? '#94a3b8' : '#64748b'}
                    textAnchor="end"
                    className="font-mono text-[11px] font-semibold"
                  >
                    {yVal}
                  </text>
                </g>
              ))}

              {/* Main Axes */}
              <line
                x1={toSvgX(0)}
                y1={toSvgY(0)}
                x2={toSvgX(coordLimits.maxX)}
                y2={toSvgY(0)}
                stroke={isDark ? '#475569' : '#94a3b8'}
                strokeWidth="2"
              />
              <line
                x1={toSvgX(0)}
                y1={toSvgY(0)}
                x2={toSvgX(0)}
                y2={PAD.top - 10}
                stroke={isDark ? '#475569' : '#94a3b8'}
                strokeWidth="2"
              />

              {/* Axis Labels */}
              <text
                x={toSvgX(coordLimits.maxX)}
                y={toSvgY(0) + 32}
                fill={isDark ? '#94a3b8' : '#475569'}
                textAnchor="end"
                className="font-sans text-xs font-bold"
              >
                Feature X →
              </text>
              <text
                x={toSvgX(0)}
                y={PAD.top - 18}
                fill={isDark ? '#94a3b8' : '#475569'}
                textAnchor="start"
                className="font-sans text-xs font-bold"
              >
                ↑ Target y
              </text>

              {/* Dynamic Ultra-Smooth Regression Line across both themes */}
              {(() => {
                const p1X = toSvgX(0.2);
                const p1Y = toSvgY(smoothW * 0.2 + smoothB);
                const p2X = toSvgX(coordLimits.maxX - 0.2);
                const p2Y = toSvgY(smoothW * (coordLimits.maxX - 0.2) + smoothB);

                return (
                  <path
                    d={`M ${p1X} ${p1Y} L ${p2X} ${p2Y}`}
                    stroke={isDark ? 'url(#regGradSmooth)' : '#0284c7'}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter={isDark ? 'url(#neonGlow)' : undefined}
                  />
                );
              })()}

              {/* Data Points, Predicted Points on Line, and Residual Error Stems */}
              {points.map((p, idx) => {
                const px = toSvgX(p.x);
                const py = toSvgY(p.y);
                const currentW = smoothW;
                const currentB = smoothB;
                const pyPred = toSvgY(currentW * p.x + currentB);
                const isHovered = hoveredPoint === idx;

                return (
                  <g
                    key={`point-${idx}-${p.x}-${p.y}`}
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer"
                  >
                    {/* Residual Red dashed error stem */}
                    <line
                      x1={px}
                      y1={py}
                      x2={px}
                      y2={pyPred}
                      stroke="#ef4444"
                      strokeWidth={isHovered ? '2.5' : '1.8'}
                      strokeDasharray="4 3"
                      opacity={isHovered ? 1 : 0.8}
                    />

                    {/* Predicted Point (Hollow dot on line) */}
                    <circle
                      cx={px}
                      cy={pyPred}
                      r="4"
                      fill={isDark ? '#0284c7' : '#ffffff'}
                      stroke="#0284c7"
                      strokeWidth="2"
                    />

                    {/* Actual Data Point (Pastel Amber dot) */}
                    <circle
                      cx={px}
                      cy={py}
                      r={isHovered ? 9 : 7}
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all duration-200 drop-shadow-sm"
                    />

                    {/* Coordinate text badge */}
                    <text
                      x={px}
                      y={py - 12}
                      fill={isDark ? '#f1f5f9' : '#1e293b'}
                      textAnchor="middle"
                      className="font-mono text-[11px] font-bold select-none pointer-events-none"
                    >
                      ({p.x}, {p.y})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. NEURAL NETWORK FORWARD PASS (MLP & Activation Layers)   */}
        {/* ========================================================= */}
        {layers && layers.length > 0 && (
          <div className="w-full h-full relative flex items-center justify-center max-w-3xl max-h-[350px]">
            <svg
              viewBox="0 0 740 360"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full select-none"
            >
              {/* Layer Titles */}
              <text x="140" y="35" textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
                Input Layer
              </text>
              <text x="370" y="35" textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
                Hidden Layer (ReLU)
              </text>
              <text x="600" y="35" textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
                Output Layer (Sigmoid)
              </text>

              {/* Layer 1 to Layer 2 Synaptic Connection Lines (6 lines) */}
              {[130, 230].map((y1, i) =>
                [90, 180, 270].map((y2, j) => {
                  const isLayerActive = step.line >= 4;
                  return (
                    <line
                      key={`syn-1-${i}-${j}`}
                      x1={140}
                      y1={y1}
                      x2={370}
                      y2={y2}
                      stroke={isLayerActive ? (isDark ? '#06b6d4' : '#0284c7') : (isDark ? '#334155' : '#e2e8f0')}
                      strokeWidth={isLayerActive ? 2.2 : 1.2}
                      strokeDasharray={isLayerActive ? '6 4' : undefined}
                      className={isLayerActive ? 'animate-pulse' : undefined}
                      opacity={isLayerActive ? 0.9 : 0.4}
                    />
                  );
                })
              )}

              {/* Layer 2 to Layer 3 Synaptic Connection Lines (3 lines) */}
              {[90, 180, 270].map((y2, j) => {
                const isOutputActive = step.line >= 8;
                return (
                  <line
                    key={`syn-2-${j}`}
                    x1={370}
                    y1={y2}
                    x2={600}
                    y2={180}
                    stroke={isOutputActive ? (isDark ? '#10b981' : '#059669') : (isDark ? '#334155' : '#e2e8f0')}
                    strokeWidth={isOutputActive ? 2.5 : 1.2}
                    strokeDasharray={isOutputActive ? '6 4' : undefined}
                    className={isOutputActive ? 'animate-pulse' : undefined}
                    opacity={isOutputActive ? 0.9 : 0.4}
                  />
                );
              })}

              {/* Input Nodes (2 nodes at X = 140) */}
              {layers[0]?.nodes.map((node, idx) => {
                const ny = idx === 0 ? 130 : 230;
                return (
                  <g key={`in-${node.label}`}>
                    <circle
                      cx={140}
                      cy={ny}
                      r={24}
                      fill={isDark ? '#1e293b' : '#e0f2fe'}
                      stroke={isDark ? '#06b6d4' : '#0284c7'}
                      strokeWidth={2}
                      className="drop-shadow-sm"
                    />
                    <text
                      x={140}
                      y={ny + 5}
                      textAnchor="middle"
                      fill={isDark ? '#e2e8f0' : '#0369a1'}
                      className="font-display font-bold text-base"
                    >
                      {node.label}
                    </text>
                    {/* Value Pill Below */}
                    <rect x={110} y={ny + 32} width={60} height={20} rx={10} fill={isDark ? '#0f172a' : '#ffffff'} stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth={1} />
                    <text x={140} y={ny + 46} textAnchor="middle" fill={isDark ? '#38bdf8' : '#0284c7'} className="font-mono text-xs font-bold">
                      {node.value}
                    </text>
                  </g>
                );
              })}

              {/* Hidden Layer Nodes (3 nodes at X = 370) */}
              {layers[1]?.nodes.map((node, idx) => {
                const ny = idx === 0 ? 90 : idx === 1 ? 180 : 270;
                const isClamped = node.value === 0 && step.line >= 6;
                const isActive = node.value > 0;
                return (
                  <g key={`hid-${node.label}`}>
                    <circle
                      cx={370}
                      cy={ny}
                      r={25}
                      fill={isClamped ? (isDark ? '#271c1c' : '#fee2e2') : isActive ? (isDark ? '#1e293b' : '#e0f2fe') : (isDark ? '#0f172a' : '#f8fafc')}
                      stroke={isClamped ? '#ef4444' : isActive ? (isDark ? '#06b6d4' : '#0284c7') : (isDark ? '#334155' : '#cbd5e1')}
                      strokeWidth={2.2}
                      className="drop-shadow-sm transition-all"
                    />
                    <text
                      x={370}
                      y={ny + 5}
                      textAnchor="middle"
                      fill={isClamped ? '#ef4444' : (isDark ? '#e2e8f0' : '#0369a1')}
                      className="font-display font-bold text-base"
                    >
                      {node.label}
                    </text>
                    {/* Value Pill Below */}
                    <rect x={320} y={ny + 32} width={100} height={20} rx={10} fill={isDark ? '#0f172a' : '#ffffff'} stroke={isClamped ? '#f87171' : (isDark ? '#334155' : '#cbd5e1')} strokeWidth={1} />
                    <text x={370} y={ny + 46} textAnchor="middle" fill={isClamped ? '#ef4444' : (isDark ? '#38bdf8' : '#0284c7')} className="font-mono text-[11px] font-bold">
                      {isClamped ? '0.0 (Clamped)' : `${node.value}`}
                    </text>
                  </g>
                );
              })}

              {/* Output Node (1 node at X = 600) */}
              {layers[2]?.nodes.map((node) => {
                const ny = 180;
                const isComputed = node.value > 0;
                return (
                  <g key={`out-${node.label}`}>
                    <circle
                      cx={600}
                      cy={ny}
                      r={28}
                      fill={isComputed ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#0f172a' : '#f8fafc')}
                      stroke={isComputed ? (isDark ? '#10b981' : '#16a34a') : (isDark ? '#334155' : '#cbd5e1')}
                      strokeWidth={2.5}
                      className="drop-shadow-md transition-all"
                    />
                    <text
                      x={600}
                      y={ny + 6}
                      textAnchor="middle"
                      fill={isComputed ? (isDark ? '#6ee7b7' : '#15803d') : (isDark ? '#94a3b8' : '#64748b')}
                      className="font-display font-bold text-lg"
                    >
                      {node.label}
                    </text>
                    {/* Value Pill Below */}
                    <rect x={545} y={ny + 36} width={110} height={22} rx={11} fill={isDark ? '#0f172a' : '#ffffff'} stroke={isComputed ? '#86efac' : (isDark ? '#334155' : '#cbd5e1')} strokeWidth={1} />
                    <text x={600} y={ny + 51} textAnchor="middle" fill={isComputed ? '#16a34a' : (isDark ? '#94a3b8' : '#64748b')} className="font-mono text-xs font-bold">
                      {isComputed ? `ŷ = ${node.value}` : 'Pending'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. TRANSFORMER SELF-ATTENTION & NEXT-TOKEN LOGITS         */}
        {/* ========================================================= */}
        {tokens && tokens.length > 0 && (
          <div className="w-full max-w-4xl flex flex-col items-center gap-3.5 py-1">
            {/* 1. Curved Attention Arcs & Tokens Stage */}
            <div
              className={`w-full p-4 rounded-2xl border transition-all ${
                isDark ? 'bg-[#111827] border-[#1e293b]' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="text-xs font-mono opacity-70 mb-1 flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
                  <span>Causal Attention Arcs (Scaled Dot-Product)</span>
                </span>
                <span>Active Query: &ldquo;{tokens[tokens.length - 1]}&rdquo;</span>
              </div>

              {/* Curved SVG Attention Arcs */}
              <div className="w-full h-24 relative overflow-hidden">
                <svg viewBox="0 0 680 90" className="w-full h-full">
                  {tokens.map((_, idx) => {
                    if (idx === tokens.length - 1) return null;
                    const total = tokens.length;
                    const stepW = 680 / total;
                    const x1 = stepW * idx + stepW / 2;
                    const x2 = stepW * (total - 1) + stepW / 2;
                    const isAttended = step.targets.includes(idx);
                    const arcH = 35 + idx * 8;

                    return (
                      <g key={`arc-${idx}`}>
                        <path
                          d={`M ${x1} 85 Q ${(x1 + x2) / 2} ${85 - arcH} ${x2} 85`}
                          fill="none"
                          stroke={
                            isAttended
                              ? isDark
                                ? '#38bdf8'
                                : '#0284c7'
                              : isDark
                                ? '#334155'
                                : '#e2e8f0'
                          }
                          strokeWidth={isAttended ? 3 : 1.2}
                          strokeDasharray={isAttended ? '6 4' : undefined}
                          className={isAttended ? 'animate-pulse' : undefined}
                          opacity={isAttended ? 1 : 0.4}
                        />
                        {isAttended && (
                          <rect
                            x={(x1 + x2) / 2 - 16}
                            y={85 - arcH - 10}
                            width="32"
                            height="16"
                            rx="8"
                            fill={isDark ? '#0284c7' : '#0284c7'}
                          />
                        )}
                        {isAttended && (
                          <text
                            x={(x1 + x2) / 2}
                            y={85 - arcH + 2}
                            textAnchor="middle"
                            fill="#ffffff"
                            className="font-mono text-[10px] font-bold"
                          >
                            {idx === 3 ? '0.44' : '0.38'}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Token sequence pills */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full">
                {tokens.map((token, idx) => {
                  const isLast = idx === tokens.length - 1;
                  const isAttended = step.targets.includes(idx);

                  return (
                    <div
                      key={idx}
                      className={`relative flex flex-col items-center py-2.5 px-2 rounded-xl font-mono text-xs transition-all ${
                        isDark
                          ? isLast
                            ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400 font-bold'
                            : isAttended
                              ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/50 shadow-md font-bold'
                              : 'bg-slate-800/60 text-slate-400 border border-slate-700'
                          : isLast
                            ? 'bg-slate-900 text-white shadow-md border border-slate-900 font-bold'
                            : isAttended
                              ? 'bg-blue-50 text-blue-800 border border-blue-400 shadow-xs font-bold'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span className="font-bold text-sm truncate">&ldquo;{token}&rdquo;</span>
                      <span className="text-[10px] opacity-60 mt-0.5">k_{idx}</span>
                      {isLast && (
                        <span className="absolute -top-2.5 right-2 text-[9px] uppercase px-1.5 py-0.2 rounded font-bold bg-cyan-400 text-slate-900">
                          Query
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Softmax Logits + Causal Attention Matrix 2-Col Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              {/* Softmax Distribution */}
              {probabilities && (
                <div
                  className={`p-4 rounded-2xl border transition-colors ${
                    isDark ? 'bg-[#111827] border-[#1e293b]' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono font-bold mb-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-400 animate-pulse" />
                      Softmax Probabilities
                    </span>
                    <span className="text-[10px] opacity-60 uppercase">Vocab LM Head</span>
                  </div>

                  <div className="space-y-2.5">
                    {probabilities.map((item, idx) => {
                      const isTop1 = idx === 0;
                      const pct = Math.round(item.prob * 100);

                      return (
                        <div key={item.token} className="flex items-center gap-2.5 text-xs font-mono">
                          <span
                            className={`w-16 truncate font-medium ${
                              isTop1 ? 'text-blue-600 dark:text-cyan-400 font-bold' : 'opacity-70'
                            }`}
                          >
                            &ldquo;{item.token}&rdquo;
                          </span>
                          <div
                            className={`flex-1 h-3 rounded-full overflow-hidden ${
                              isDark ? 'bg-slate-800' : 'bg-slate-100'
                            }`}
                          >
                            <div
                              style={{ width: `${pct}%` }}
                              className={`h-full rounded-full transition-all duration-500 ease-out ${
                                isTop1
                                  ? 'bg-blue-600 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-indigo-500 shadow-xs'
                                  : 'bg-slate-400 dark:bg-slate-600'
                              }`}
                            />
                          </div>
                          <span
                            className={`w-10 text-right font-bold ${
                              isTop1 ? 'text-blue-600 dark:text-cyan-300' : 'opacity-60'
                            }`}
                          >
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Causal Attention Heatmap Matrix */}
              <div
                className={`p-4 rounded-2xl border transition-colors ${
                  isDark ? 'bg-[#111827] border-[#1e293b]' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-3">
                  <span>Causal Attention Matrix</span>
                  <span className="text-[10px] opacity-60">Triangular Mask</span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-[10px]">
                  {tokens.map((_q, row) =>
                    tokens.map((_k, col) => {
                      const isMasked = col > row;
                      const isHigh = row === 4 && (col === 3 || col === 1);
                      const isMid = row >= col;

                      return (
                        <div
                          key={`mat-${row}-${col}`}
                          className={`p-1.5 rounded-lg font-semibold transition-all ${
                            isMasked
                              ? isDark
                                ? 'bg-slate-900/40 text-slate-700'
                                : 'bg-slate-50 text-slate-300'
                              : isHigh
                                ? isDark
                                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                                  : 'bg-blue-600 text-white font-bold'
                                : isMid
                                  ? isDark
                                    ? 'bg-cyan-950/60 text-cyan-300'
                                    : 'bg-blue-100 text-blue-900'
                                  : 'opacity-40'
                          }`}
                        >
                          {isMasked ? '-∞' : isHigh ? '0.44' : '0.14'}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. CLASSICAL ARRAYS (Pastel Rounded VizLearn Bars)        */}
        {/* ========================================================= */}
        {arr && arr.length > 0 && (
          <div className="w-full h-full relative flex items-end justify-center pb-6">
            <svg
              ref={svgRef}
              viewBox="0 0 700 360"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full max-h-[340px]"
            >
              {arr.map((val, idx) => {
                const maxVal = Math.max(...arr, 1);
                const width = 700;
                const height = 360;
                const barMargin = 12;
                const availableWidth = width - 80;
                const barWidth = Math.min(64, Math.max(28, availableWidth / arr.length - barMargin));
                const startX = (width - (arr.length * (barWidth + barMargin) - barMargin)) / 2;
                const x = startX + idx * (barWidth + barMargin);
                const barHeight = Math.max(30, (val / maxVal) * (height - 130));
                const y = height - 60 - barHeight;

                const isTarget = step.targets.includes(idx);
                const isSwap = step.action === 'swap' && isTarget;
                const isDone = step.action === 'done';

                let fill = '#e0f2fe';
                let stroke = '#0284c7';
                let textColor = '#0369a1';

                if (isDone) {
                  fill = '#dcfce7';
                  stroke = '#16a34a';
                  textColor = '#15803d';
                } else if (isSwap) {
                  fill = '#fee2e2';
                  stroke = '#dc2626';
                  textColor = '#b91c1c';
                } else if (isTarget) {
                  fill = '#fef3c7';
                  stroke = '#d97706';
                  textColor = '#b45309';
                }

                return (
                  <g key={idx}>
                    {/* Rounded Pastel Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="10"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth="1.8"
                      className="transition-all duration-300"
                    />
                    {/* Numerical value on top */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      textAnchor="middle"
                      fill={textColor}
                      className="font-display font-bold text-sm"
                    >
                      {val}
                    </text>
                    {/* Index label below */}
                    <text
                      x={x + barWidth / 2}
                      y={height - 38}
                      textAnchor="middle"
                      fill="#94a3b8"
                      className="font-mono text-xs font-semibold"
                    >
                      [{idx}]
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Stage Footer Status with Live Formula & Insight */}
      <div
        className={`pt-2 border-t text-xs font-mono flex items-center justify-between shrink-0 ${
          isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Invariant Model:</span>
          {points ? (
            <MathFormula
              math={`y = ${smoothW.toFixed(2)}x + ${smoothB.toFixed(2)}`}
              className="ml-1 font-bold text-blue-600 dark:text-cyan-300"
            />
          ) : (
            <span className="font-bold">Execution Trace Synced</span>
          )}
        </span>
        <span className="flex items-center gap-1 font-semibold">
          <TrendingDown className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
          <span>Status: {step.action.toUpperCase()}</span>
        </span>
      </div>
    </div>
  );
};
