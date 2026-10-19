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
  BrainCircuit,
  Activity
} from 'lucide-react';
import type { ThemeMode, TraceStep, Language } from '../types';
import { MathFormula } from './MathFormula';
import { getLocalizedText } from '../i18n/translations';
interface VisualStageProps {
  theme: ThemeMode;
  step: TraceStep;
  category: string;
  onChangeInput?: (newInput: string) => void;
  language?: Language;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
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
  language = 'en',
  isMaximized,
  onToggleMaximize,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const isDark = theme === 'studio';
  const t = getLocalizedText(language);
  // Graph sizing, pan & zoom state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [internalExpanded, setInternalExpanded] = useState<boolean>(false);
  const isExpanded = isMaximized ?? internalExpanded;
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((z) => Math.max(0.5, Math.min(2.5, Number((z + delta).toFixed(2)))));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    hasMovedRef.current = false;
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    if (Math.abs(dx - pan.x) > 3 || Math.abs(dy - pan.y) > 3) {
      hasMovedRef.current = true;
    }
    setPan({ x: dx, y: dy });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const arr = step.state.arr;
  const points = step.state.points;
  const layers = step.state.layers;
  const neuronState = step.state.neuronState;
  const modernNeuronState = step.state.modernNeuronState;
  const smoothZ = useSmoothValue(modernNeuronState?.zVal ?? 0, 360);
  const smoothA = useSmoothValue(modernNeuronState?.outputVal ?? 0, 360);
  const tokens = step.state.tokens;
  const probabilities = step.state.probabilities;
  const inputMatrix = step.state.inputMatrix;
  const kernel = step.state.kernel;
  const featureMap = step.state.featureMap;
  const kernelPos = (step.state.kernelPos as { r: number; c: number } | undefined) || { r: 0, c: 0 };

  const smoothKernelR = useSmoothValue(kernelPos.r, 420);
  const smoothKernelC = useSmoothValue(kernelPos.c, 420);
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
  // Interactive Click to Add Point
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onChangeInput || !points || hasMovedRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickSvgX = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const clickSvgY = ((e.clientY - rect.top) / rect.height) * SVG_H;

    if (
      clickSvgX >= PAD.left &&
      clickSvgX <= PAD.left + plotW &&
      clickSvgY >= PAD.top &&
      clickSvgY <= PAD.top + plotH
    ) {
      const rawX = ((clickSvgX - PAD.left) / plotW) * coordLimits.maxX;
      const rawY = ((PAD.top + plotH - clickSvgY) / plotH) * coordLimits.maxY;
      const newX = Math.max(0.5, Math.min(coordLimits.maxX - 0.5, Number(rawX.toFixed(1))));
      const newY = Math.max(0.5, Math.min(coordLimits.maxY, Number(rawY.toFixed(1))));
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
          {isExpanded && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-cyan-400 rounded-full text-[11px] font-semibold animate-pulse">
              <span>✦ {language === 'vi' ? 'Ưu tiên Visualization' : 'Focus Mode'}</span>
              <span className="opacity-60 text-[10px]">({language === 'vi' ? 'Esc để thu nhỏ' : 'Esc to exit'})</span>
            </div>
          )}
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
          {/* Redesigned Floating Modern Zoom & View Controls */}
          <div
            className={`flex items-center gap-0.5 p-1 rounded-2xl border text-xs shadow-sm backdrop-blur-md transition-all ${
              isDark
                ? 'bg-[#151c2d]/90 border-[#222f46] text-slate-200'
                : 'bg-white/95 border-slate-200 text-slate-700'
            }`}
          >
            <button
              onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.15).toFixed(2))))}
              title="Zoom Out (Scroll Down)"
              className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              title="Click to reset zoom to 100%"
              className="px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.15).toFixed(2))))}
              title="Zoom In (Scroll Up)"
              className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              title="Reset View & Pan (Home)"
              className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 opacity-60 hover:opacity-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (onToggleMaximize) {
                  onToggleMaximize();
                } else {
                  setInternalExpanded((e) => !e);
                }
              }}
              title={
                isExpanded
                  ? (language === 'vi' ? 'Thu nhỏ về 3 cột (Esc)' : 'Exit Focus Mode (Esc)')
                  : (language === 'vi' ? 'Phóng to tối đa Visualization (Ưu tiên hình ảnh)' : 'Maximize Visualization (Focus Mode)')
              }
              className={`p-1 rounded-xl transition-all ml-0.5 ${
                isExpanded
                  ? 'bg-blue-500/20 text-blue-600 dark:text-cyan-400 border border-blue-500/40 shadow-xs'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
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
            {modernNeuronState && (
              <span
                className={`px-2.5 py-1 rounded-xl font-bold transition-all shadow-xs ${
                  modernNeuronState.gradientVal === 0
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                da/dz: {modernNeuronState.gradientVal.toFixed(3)} ({modernNeuronState.activationType.toUpperCase()})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Stage Visual Content with Dynamic Mouse Pan & Wheel Zoom */}
      <div
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 w-full flex items-center justify-center my-1 overflow-hidden select-none ${
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Mouse Drag & Scroll Hint */}
        <div className="absolute bottom-2 left-4 z-10 hidden sm:flex items-center gap-1.5 text-[10px] font-mono opacity-40 pointer-events-none">
          <span>🖱️ Drag to pan</span>
          <span>•</span>
          <span>⚲ Scroll wheel to zoom</span>
        </div>

        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
          className="w-full h-full flex items-center justify-center transition-transform duration-75"
        >
        {/* ========================================================= */}
        {/* 1. DYNAMIC REGRESSION PLOT (Auto-scaled, Clickable, Clean) */}
        {/* ========================================================= */}
        {points && points.length > 0 && (
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Top Click-To-Add-Point Hint */}
            <div className="absolute top-1 left-4 z-10 flex items-center gap-1.5 text-[11px] opacity-60 font-sans pointer-events-none">
              <MousePointerClick className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span>{t.clickToAddPoint}</span>
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
                  <span>{t.point} ({points[hoveredPoint].x}, {points[hoveredPoint].y})</span>
                  <span>|</span>
                  <span className="text-blue-500 dark:text-cyan-300">
                    ŷ = {(rawW * points[hoveredPoint].x + rawB).toFixed(2)}
                  </span>
                  <span>|</span>
                  <span className="text-rose-500">
                    {t.residual}: {(points[hoveredPoint].y - (rawW * points[hoveredPoint].x + rawB)).toFixed(2)}
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
              className={`w-full h-full cursor-crosshair select-none transition-all duration-300 ${
                isExpanded ? 'max-h-[580px]' : 'max-h-[350px]'
              }`}
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
                {t.featureX} →
              </text>
              <text
                x={toSvgX(0)}
                y={PAD.top - 18}
                fill={isDark ? '#94a3b8' : '#475569'}
                textAnchor="start"
                className="font-sans text-xs font-bold"
              >
                ↑ {t.targetY}
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
          <div className={`w-full h-full relative flex items-center justify-center transition-all duration-300 ${
            isExpanded ? 'max-w-5xl max-h-[560px]' : 'max-w-3xl max-h-[350px]'
          }`}>
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
        {/* 2.5. SINGLE ARTIFICIAL NEURON (PERCEPTRON) VISUALIZER     */}
        {/* ========================================================= */}
        {neuronState && (
          <div className={`w-full h-full relative flex items-center justify-center transition-all duration-300 ${
            isExpanded ? 'max-w-6xl max-h-[580px]' : 'max-w-4xl max-h-[350px]'
          }`}>
            <svg
              viewBox="0 0 740 360"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full select-none"
            >
              {/* Column Section Titles */}
              <text x="130" y="32" textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
                Inputs (Dendrites)
              </text>
              <text x="370" y="32" textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
                Single Neuron (Soma: ∑ + Activation)
              </text>
              <text x="610" y="32" textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
                Output (Axon Firing)
              </text>

              {/* Synaptic Connection Lines: Inputs to Soma */}
              {neuronState.inputs.map((inp, idx) => {
                const inY = idx === 0 ? 110 : 230;
                const isSynActive = step.line >= 5;
                const wVal = neuronState.weights[idx] ?? 1.5;
                const product = (inp.val * wVal).toFixed(2);

                return (
                  <g key={`syn-${inp.label}`}>
                    <path
                      d={`M 155 ${inY} Q 250 ${inY} 315 170`}
                      fill="none"
                      stroke={isSynActive ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#334155' : '#e2e8f0')}
                      strokeWidth={isSynActive ? 2.8 : 1.5}
                      strokeDasharray={isSynActive ? '6 4' : undefined}
                      className={isSynActive ? 'animate-pulse' : undefined}
                      opacity={isSynActive ? 1 : 0.4}
                    />
                    {/* Synaptic Weight Badge on Wire */}
                    <rect
                      x={195}
                      y={idx === 0 ? 100 : 210}
                      width={75}
                      height={20}
                      rx={10}
                      fill={isDark ? '#0f172a' : '#ffffff'}
                      stroke={isSynActive ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#334155' : '#cbd5e1')}
                      strokeWidth={1}
                    />
                    <text
                      x={232}
                      y={idx === 0 ? 114 : 224}
                      textAnchor="middle"
                      fill={isSynActive ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#94a3b8' : '#64748b')}
                      className="font-mono text-[10px] font-bold"
                    >
                      w_{idx + 1}={wVal} ({product})
                    </text>
                  </g>
                );
              })}

              {/* Axon Output Line from Soma to Output Decision Node */}
              {(() => {
                const isFired = step.line >= 7;
                return (
                  <g>
                    <line
                      x1={425}
                      y1={170}
                      x2={560}
                      y2={170}
                      stroke={isFired ? (isDark ? '#10b981' : '#16a34a') : (isDark ? '#334155' : '#e2e8f0')}
                      strokeWidth={isFired ? 3.5 : 1.5}
                      strokeDasharray={isFired ? '6 4' : undefined}
                      className={isFired ? 'animate-pulse' : undefined}
                      opacity={isFired ? 1 : 0.4}
                    />
                  </g>
                );
              })()}

              {/* 1. Input Dendrite Nodes (x1, x2) */}
              {neuronState.inputs.map((inp, idx) => {
                const inY = idx === 0 ? 110 : 230;
                return (
                  <g key={`node-in-${inp.label}`}>
                    <circle
                      cx={130}
                      cy={inY}
                      r={24}
                      fill={isDark ? '#1e293b' : '#e0f2fe'}
                      stroke={isDark ? '#06b6d4' : '#0284c7'}
                      strokeWidth={2}
                      className="drop-shadow-sm"
                    />
                    <text
                      x={130}
                      y={inY + 5}
                      textAnchor="middle"
                      fill={isDark ? '#e2e8f0' : '#0369a1'}
                      className="font-display font-bold text-base"
                    >
                      {inp.label}
                    </text>
                    <rect x={100} y={inY + 32} width={60} height={20} rx={10} fill={isDark ? '#0f172a' : '#ffffff'} stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth={1} />
                    <text x={130} y={inY + 46} textAnchor="middle" fill={isDark ? '#38bdf8' : '#0284c7'} className="font-mono text-xs font-bold">
                      {inp.val}
                    </text>
                  </g>
                );
              })}

              {/* 2. Center Soma: Large Split Neuron Body */}
              {(() => {
                const isZActive = step.line >= 5;
                const isSigmoidActive = step.line >= 7;
                const zVal = neuronState.weightedSum;
                const isAboveThreshold = zVal >= 0;

                return (
                  <g className="cursor-pointer">
                    {/* Outer Glowing Neuron Cell */}
                    <circle
                      cx={370}
                      cy={170}
                      r={55}
                      fill={isDark ? '#111827' : '#ffffff'}
                      stroke={
                        isSigmoidActive
                          ? isAboveThreshold
                            ? '#10b981'
                            : '#ef4444'
                          : isZActive
                            ? (isDark ? '#38bdf8' : '#0284c7')
                            : (isDark ? '#334155' : '#e2e8f0')
                      }
                      strokeWidth={3}
                      className="drop-shadow-lg transition-all"
                    />

                    {/* Partition Divider Line */}
                    <line
                      x1={370}
                      y1={118}
                      x2={370}
                      y2={222}
                      stroke={isDark ? '#334155' : '#e2e8f0'}
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                    />

                    {/* Left Partition: Linear Weighted Sum & Bias */}
                    <text x={342} y={155} textAnchor="middle" fill={isDark ? '#94a3b8' : '#64748b'} className="font-sans text-[11px] font-bold">
                      ∑ + b
                    </text>
                    <text x={342} y={180} textAnchor="middle" fill={isZActive ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#64748b' : '#94a3b8')} className="font-mono text-xs font-bold">
                      {isZActive ? zVal : 'z'}
                    </text>

                    {/* Right Partition: Activation Function Symbol */}
                    <text x={398} y={155} textAnchor="middle" fill={isDark ? '#94a3b8' : '#64748b'} className="font-sans text-[11px] font-bold">
                      σ(z)
                    </text>
                    <text x={398} y={180} textAnchor="middle" fill={isSigmoidActive ? '#10b981' : (isDark ? '#64748b' : '#94a3b8')} className="font-mono text-xs font-bold">
                      {isSigmoidActive ? neuronState.outputVal : 'a'}
                    </text>

                    {/* Bias Badge Below Soma */}
                    <rect x={320} y={236} width={100} height={22} rx={11} fill={isDark ? '#0f172a' : '#ffffff'} stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth={1} />
                    <text x={370} y={251} textAnchor="middle" fill={isDark ? '#e2e8f0' : '#475569'} className="font-mono text-[11px] font-bold">
                      bias: {neuronState.bias}
                    </text>
                  </g>
                );
              })()}

              {/* 3. Output Decision Node & Firing Gauge */}
              {(() => {
                const isFired = step.line >= 7;
                const prob = neuronState.outputVal;
                const isClass1 = prob >= 0.5;

                return (
                  <g>
                    <circle
                      cx={610}
                      cy={170}
                      r={36}
                      fill={isFired ? (isClass1 ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#3b1d24' : '#fee2e2')) : (isDark ? '#0f172a' : '#f8fafc')}
                      stroke={isFired ? (isClass1 ? '#10b981' : '#ef4444') : (isDark ? '#334155' : '#cbd5e1')}
                      strokeWidth={3}
                      className="drop-shadow-md transition-all"
                    />
                    <text
                      x={610}
                      y={166}
                      textAnchor="middle"
                      fill={isFired ? (isClass1 ? (isDark ? '#6ee7b7' : '#15803d') : '#ef4444') : (isDark ? '#94a3b8' : '#64748b')}
                      className="font-display font-bold text-lg"
                    >
                      {isFired ? prob : 'a'}
                    </text>
                    <text
                      x={610}
                      y={182}
                      textAnchor="middle"
                      fill={isFired ? (isClass1 ? (isDark ? '#a7f3d0' : '#16a34a') : '#f87171') : (isDark ? '#64748b' : '#94a3b8')}
                      className="font-mono text-[10px] font-bold"
                    >
                      {isFired ? `${(prob * 100).toFixed(0)}%` : 'Output'}
                    </text>

                    {/* Decision Badge Below Output */}
                    <rect
                      x={535}
                      y={220}
                      width={150}
                      height={24}
                      rx={12}
                      fill={isFired ? (isClass1 ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#3b1d24' : '#fee2e2')) : (isDark ? '#0f172a' : '#ffffff')}
                      stroke={isFired ? (isClass1 ? '#10b981' : '#ef4444') : (isDark ? '#334155' : '#cbd5e1')}
                      strokeWidth={1.5}
                    />
                    <text
                      x={610}
                      y={236}
                      textAnchor="middle"
                      fill={isFired ? (isClass1 ? (isDark ? '#6ee7b7' : '#15803d') : '#ef4444') : (isDark ? '#94a3b8' : '#64748b')}
                      className="font-sans text-[11px] font-bold"
                    >
                      {isFired ? (isClass1 ? 'FIRE: Class 1 (Active)' : 'REST: Class 0 (Inhibited)') : 'Pending Activation'}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2.6. BIOLOGICAL NEURON & ACTION POTENTIAL OSCILLOSCOPE     */}
        {/* ========================================================= */}
        {modernNeuronState && (
          <div className={`w-full h-full relative flex items-center justify-between p-2 transition-all duration-300 ${
            isExpanded ? 'max-w-6xl max-h-[580px]' : 'max-w-4xl max-h-[350px]'
          }`}>
            {/* Left Column: Neuron Architecture (Width: 360) */}
            <svg
              viewBox="0 0 360 340"
              preserveAspectRatio="xMidYMid meet"
              className="w-1/2 h-full select-none"
            >
              <text x="180" y="25" textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
                Neuron Architecture
              </text>

              {/* Synapses from Inputs to Center Soma */}
              {modernNeuronState.inputs.map((inp, idx) => {
                const inY = idx === 0 ? 100 : 220;
                const isSynActive = step.line >= 4;
                const wVal = modernNeuronState.weights[idx] ?? 1.2;

                return (
                  <g key={`mod-syn-${inp.label}`}>
                    <path
                      d={`M 65 ${inY} Q 120 ${inY} 175 160`}
                      fill="none"
                      stroke={isSynActive ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#334155' : '#cbd5e1')}
                      strokeWidth={2.2}
                      strokeDasharray="5 3"
                    />
                    <rect x={85} y={idx === 0 ? 90 : 205} width={45} height={18} rx={9} fill={isDark ? '#0f172a' : '#ffffff'} stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth={1} />
                    <text x={107} y={idx === 0 ? 103 : 218} textAnchor="middle" fill={isDark ? '#38bdf8' : '#0284c7'} className="font-mono text-[9px] font-bold">
                      w={wVal}
                    </text>
                  </g>
                );
              })}

              {/* Input Nodes x1, x2 */}
              {modernNeuronState.inputs.map((inp, idx) => {
                const inY = idx === 0 ? 100 : 220;
                return (
                  <g key={`mod-in-${inp.label}`}>
                    <circle cx={45} cy={inY} r={20} fill={isDark ? '#1e293b' : '#e0f2fe'} stroke={isDark ? '#06b6d4' : '#0284c7'} strokeWidth={1.8} />
                    <text x={45} y={inY + 4} textAnchor="middle" fill={isDark ? '#e2e8f0' : '#0369a1'} className="font-display font-bold text-xs">{inp.label}</text>
                    <text x={45} y={inY + 32} textAnchor="middle" fill={isDark ? '#94a3b8' : '#64748b'} className="font-mono text-[10px] font-bold">{inp.val}</text>
                  </g>
                );
              })}

              {/* Soma Cell Body (Centered at X=195, Y=160) */}
              <circle
                cx={195}
                cy={160}
                r={44}
                fill={isDark ? '#111827' : '#ffffff'}
                stroke={isDark ? '#06b6d4' : '#0284c7'}
                strokeWidth={2.5}
                className="drop-shadow-md"
              />
              <line x1={195} y1={118} x2={195} y2={202} stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth={1.2} strokeDasharray="3 3" />
              <text x={175} y={150} textAnchor="middle" fill={isDark ? '#94a3b8' : '#64748b'} className="font-sans text-[10px] font-bold">z</text>
              <text x={175} y={172} textAnchor="middle" fill={isDark ? '#38bdf8' : '#0284c7'} className="font-mono text-xs font-bold">{smoothZ.toFixed(2)}</text>
              <text x={215} y={150} textAnchor="middle" fill={isDark ? '#94a3b8' : '#64748b'} className="font-sans text-[10px] font-bold">f(z)</text>
              <text x={215} y={172} textAnchor="middle" fill="#10b981" className="font-mono text-xs font-bold">{smoothA.toFixed(2)}</text>

              {/* Axon to Output Node */}
              <line x1={240} y1={160} x2={305} y2={160} stroke={isDark ? '#10b981' : '#16a34a'} strokeWidth={2.5} strokeDasharray="5 3" />

              {/* Output Activation Node */}
              <circle cx={325} cy={160} r={24} fill={isDark ? '#064e3b' : '#dcfce7'} stroke={isDark ? '#10b981' : '#16a34a'} strokeWidth={2} />
              <text x={325} y={165} textAnchor="middle" fill={isDark ? '#6ee7b7' : '#15803d'} className="font-display font-bold text-xs">{smoothA.toFixed(2)}</text>

              {/* Bottom Gradient Callout */}
              <rect x={110} y={245} width={170} height={26} rx={13} fill={modernNeuronState.gradientVal === 0 ? (isDark ? '#3b1d24' : '#fee2e2') : (isDark ? '#064e3b' : '#dcfce7')} stroke={modernNeuronState.gradientVal === 0 ? '#ef4444' : '#10b981'} strokeWidth={1.5} />
              <text x={195} y={262} textAnchor="middle" fill={modernNeuronState.gradientVal === 0 ? '#ef4444' : '#15803d'} className="font-mono text-[11px] font-bold">
                {modernNeuronState.gradientVal === 0 ? 'da/dz = 0.000 (Dead!)' : `da/dz = ${modernNeuronState.gradientVal.toFixed(3)} (Alive!)`}
              </text>
            </svg>

            {/* Right Column: Live Mathematical Activation Curve & Tangent Gradient (Width: 360) */}
            <div className={`w-1/2 h-full p-3 rounded-2xl border flex flex-col justify-between ${
              isDark ? 'bg-[#0f1523] border-[#1e293b]' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
                  <span>Activation Curve ({modernNeuronState.activationType.toUpperCase()})</span>
                </span>
                <span className={modernNeuronState.gradientVal === 0 ? 'text-rose-500' : 'text-emerald-500'}>
                  ∇ = {modernNeuronState.gradientVal.toFixed(3)}
                </span>
              </div>

              {/* Curve SVG */}
              <div className="w-full h-44 relative my-1">
                <svg viewBox="0 0 340 180" className="w-full h-full select-none">
                  {/* X Axis at Y=140 */}
                  <line x1="25" y1="140" x2="320" y2="140" stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="1.5" />
                  {/* Y Axis at X=170 (z=0) */}
                  <line x1="170" y1="15" x2="170" y2="160" stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="1.5" />

                  <text x="315" y="155" fill={isDark ? '#94a3b8' : '#64748b'} textAnchor="end" className="font-mono text-[9px] font-bold">z →</text>
                  <text x="165" y="22" fill={isDark ? '#94a3b8' : '#64748b'} textAnchor="end" className="font-mono text-[9px] font-bold">a ↑</text>

                  {/* Horizontal Guideline a=1.0 at Y=40 */}
                  <line x1="25" y1="40" x2="320" y2="40" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeDasharray="3 3" />
                  <text x="20" y="43" fill="#94a3b8" textAnchor="end" className="font-mono text-[8px]">1.0</text>

                  {/* Curve Drawing based on active activationType */}
                  {(() => {
                    const toPlotX = (zVal: number) => 170 + zVal * 32;
                    const toPlotY = (aVal: number) => 140 - aVal * 100;

                    let curvePath = '';
                    if (modernNeuronState.activationType === 'step') {
                      curvePath = `M ${toPlotX(-4)} ${toPlotY(0)} L ${toPlotX(0)} ${toPlotY(0)} L ${toPlotX(0)} ${toPlotY(1)} L ${toPlotX(4)} ${toPlotY(1)}`;
                    } else if (modernNeuronState.activationType === 'relu') {
                      curvePath = `M ${toPlotX(-4)} ${toPlotY(0)} L ${toPlotX(0)} ${toPlotY(0)} L ${toPlotX(3)} ${toPlotY(3)}`;
                    } else {
                      const pts: string[] = [];
                      for (let zI = -4; zI <= 4; zI += 0.25) {
                        const aI = 1 / (1 + Math.exp(-zI));
                        pts.push(`${toPlotX(zI)},${toPlotY(aI)}`);
                      }
                      curvePath = `M ${pts.join(' L ')}`;
                    }

                    const orbX = toPlotX(smoothZ);
                    const orbY = toPlotY(smoothA);

                    return (
                      <g>
                        <path
                          d={curvePath}
                          fill="none"
                          stroke={isDark ? '#38bdf8' : '#0284c7'}
                          strokeWidth={2.8}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Tangent slope line representing the gradient da/dz */}
                        <line
                          x1={orbX - 25}
                          y1={orbY + (modernNeuronState.activationType === 'step' ? 0 : 25 * modernNeuronState.gradientVal)}
                          x2={orbX + 25}
                          y2={orbY - (modernNeuronState.activationType === 'step' ? 0 : 25 * modernNeuronState.gradientVal)}
                          stroke={modernNeuronState.gradientVal === 0 ? '#ef4444' : '#10b981'}
                          strokeWidth={2}
                          strokeDasharray={modernNeuronState.gradientVal === 0 ? '3 2' : undefined}
                        />
                        {/* Smooth Sliding Orb at current (z, a) coordinate */}
                        <circle
                          cx={orbX}
                          cy={orbY}
                          r={6.5}
                          fill="#f59e0b"
                          stroke="#ffffff"
                          strokeWidth={2}
                          className="drop-shadow-md animate-pulse"
                        />
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Bottom Insight explanation */}
              <div className={`p-2 rounded-xl text-[10px] font-mono border ${
                modernNeuronState.gradientVal === 0
                  ? (isDark ? 'bg-rose-950/40 border-rose-800/40 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800')
                  : (isDark ? 'bg-cyan-950/40 border-cyan-800/40 text-cyan-300' : 'bg-blue-50 border-blue-200 text-blue-900')
              }`}>
                {modernNeuronState.gradientVal === 0
                  ? '⚠️ Perceptron Step Function: Độ dốc (gradient) = 0. Thuật toán Gradient Descent bị đóng băng.'
                  : '✅ Modern Activation: Độ dốc (gradient) > 0. Cho phép Backpropagation cập nhật trọng số liên tục.'}
              </div>
            </div>
          </div>
        )}
        {/* 3. TRANSFORMER SELF-ATTENTION & NEXT-TOKEN LOGITS         */}
        {/* ========================================================= */}
        {tokens && tokens.length > 0 && (
          <div className={`w-full flex flex-col items-center gap-3.5 py-1 transition-all duration-300 ${
            isExpanded ? 'max-w-6xl' : 'max-w-4xl'
          }`}>
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
        {/* 4. CNN 2D CONVOLUTION & FEATURE MAP VISUALIZER           */}
        {/* ========================================================= */}
        {inputMatrix && kernel && featureMap && (
          <div className={`w-full h-full flex items-center justify-center p-2 transition-all duration-300 ${
            isExpanded ? 'max-w-6xl max-h-[580px]' : 'max-w-4xl max-h-[350px]'
          }`}>
            <svg
              viewBox="0 0 740 360"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full select-none"
            >
              {/* Section Headers */}
              <text x="140" y="32" textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
                Input Image (5x5)
              </text>
              <text x="370" y="32" textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
                Kernel (3x3 Sobel)
              </text>
              <text x="600" y="32" textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
                Feature Map (3x3)
              </text>

              {/* 1. Input Image 5x5 Grid */}
              {inputMatrix.map((row, r) =>
                row.map((val, c) => {
                  const cellX = 40 + c * 40;
                  const cellY = 60 + r * 40;
                  const isHigh = val > 5;
                  return (
                    <g key={`in-cell-${r}-${c}`}>
                      <rect
                        x={cellX}
                        y={cellY}
                        width={38}
                        height={38}
                        rx={8}
                        fill={isHigh ? (isDark ? '#1e293b' : '#f8fafc') : (isDark ? '#0f172a' : '#f1f5f9')}
                        stroke={isDark ? '#334155' : '#e2e8f0'}
                        strokeWidth={1.5}
                      />
                      <text
                        x={cellX + 19}
                        y={cellY + 24}
                        textAnchor="middle"
                        fill={isHigh ? (isDark ? '#f8fafc' : '#0f172a') : (isDark ? '#64748b' : '#94a3b8')}
                        className="font-mono text-xs font-bold"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })
              )}

              {/* Ultra-Smooth Sliding 3x3 Kernel Window on Input Matrix */}
              {(() => {
                const winX = 40 + smoothKernelC * 40 - 2;
                const winY = 60 + smoothKernelR * 40 - 2;
                return (
                  <rect
                    x={winX}
                    y={winY}
                    width={122}
                    height={122}
                    rx={12}
                    fill="rgba(2, 132, 199, 0.12)"
                    stroke={isDark ? '#38bdf8' : '#0284c7'}
                    strokeWidth={2.8}
                    strokeDasharray="6 4"
                    className="drop-shadow-[0_0_12px_rgba(2,132,199,0.5)]"
                  />
                );
              })()}

              {/* Projection Connection Beams connecting Receptive Field to Feature Map Cell */}
              {(() => {
                const patchCenterX = 40 + smoothKernelC * 40 + 60;
                const patchCenterY = 60 + smoothKernelR * 40 + 60;
                const outCellX = 530 + smoothKernelC * 46 + 23;
                const outCellY = 105 + smoothKernelR * 46 + 23;

                return (
                  <g>
                    <path
                      d={`M ${patchCenterX} ${patchCenterY} Q ${(patchCenterX + 370) / 2} ${patchCenterY - 30} 370 180`}
                      fill="none"
                      stroke={isDark ? '#06b6d4' : '#0284c7'}
                      strokeWidth={1.8}
                      strokeDasharray="4 4"
                      opacity={0.6}
                    />
                    <path
                      d={`M 370 180 Q ${(370 + outCellX) / 2} ${outCellY - 30} ${outCellX} ${outCellY}`}
                      fill="none"
                      stroke={isDark ? '#10b981' : '#059669'}
                      strokeWidth={2.2}
                      strokeDasharray="4 4"
                      opacity={0.8}
                      className="animate-pulse"
                    />
                  </g>
                );
              })()}

              {/* 2. Center 3x3 Kernel Matrix */}
              {kernel.map((row, r) =>
                row.map((kVal, c) => {
                  const kX = 315 + c * 36;
                  const kY = 125 + r * 36;
                  const isPos = kVal > 0;
                  const isNeg = kVal < 0;

                  return (
                    <g key={`k-cell-${r}-${c}`}>
                      <rect
                        x={kX}
                        y={kY}
                        width={34}
                        height={34}
                        rx={8}
                        fill={
                          isPos
                            ? isDark
                              ? '#1e3a5f'
                              : '#e0f2fe'
                            : isNeg
                              ? isDark
                                ? '#3b1d24'
                                : '#fee2e2'
                              : isDark
                                ? '#1e293b'
                                : '#f8fafc'
                        }
                        stroke={
                          isPos
                            ? isDark
                              ? '#38bdf8'
                              : '#0284c7'
                            : isNeg
                              ? '#ef4444'
                              : isDark
                                ? '#334155'
                                : '#e2e8f0'
                        }
                        strokeWidth={1.5}
                      />
                      <text
                        x={kX + 17}
                        y={kY + 22}
                        textAnchor="middle"
                        fill={isPos ? '#0284c7' : isNeg ? '#ef4444' : isDark ? '#94a3b8' : '#64748b'}
                        className="font-mono text-xs font-bold"
                      >
                        {kVal > 0 ? `+${kVal}` : kVal}
                      </text>
                    </g>
                  );
                })
              )}

              {/* Center Operator Symbol */}
              <text x="370" y="260" textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-mono text-xs font-bold">
                ∑ (Patch ⊙ Kernel)
              </text>

              {/* 3. Right Output Feature Map 3x3 */}
              {featureMap.map((row, r) =>
                row.map((fVal, c) => {
                  const outX = 530 + c * 46;
                  const outY = 105 + r * 46;
                  const isTarget = kernelPos.r === r && kernelPos.c === c;
                  const isFilled = fVal !== null;
                  const isHighActivation = Number(fVal) >= 30;

                  return (
                    <g key={`out-cell-${r}-${c}`}>
                      <rect
                        x={outX}
                        y={outY}
                        width={42}
                        height={42}
                        rx={10}
                        fill={
                          isHighActivation
                            ? '#0284c7'
                            : isFilled
                              ? isDark
                                ? '#1e293b'
                                : '#e0f2fe'
                              : isDark
                                ? '#0b0f19'
                                : '#f8fafc'
                        }
                        stroke={
                          isTarget
                            ? isDark
                              ? '#38bdf8'
                              : '#0284c7'
                            : isFilled
                              ? isDark
                                ? '#0284c7'
                                : '#bae6fd'
                              : isDark
                                ? '#1e293b'
                                : '#e2e8f0'
                        }
                        strokeWidth={isTarget ? 2.5 : 1.5}
                        strokeDasharray={isFilled ? undefined : '4 4'}
                        className="transition-all duration-300"
                      />
                      <text
                        x={outX + 21}
                        y={outY + 26}
                        textAnchor="middle"
                        fill={
                          isHighActivation
                            ? '#ffffff'
                            : isFilled
                              ? isDark
                                ? '#38bdf8'
                                : '#0369a1'
                              : isDark
                                ? '#475569'
                                : '#cbd5e1'
                        }
                        className="font-mono text-xs font-bold"
                      >
                        {isFilled ? fVal : '·'}
                      </text>
                    </g>
                  );
                })
              )}
            </svg>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. CLASSICAL ARRAYS                                      */}
        {/* ========================================================= */}
        {/* ========================================================= */}
        {/* 4. CLASSICAL ARRAYS (Pastel Rounded VizLearn Bars)        */}
        {/* ========================================================= */}
        {arr && arr.length > 0 && (
          <div className={`w-full h-full relative flex items-end justify-center pb-6 transition-all duration-300 ${
            isExpanded ? 'max-h-[560px]' : 'max-h-[340px]'
          }`}>
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
        </div>

      {/* Stage Footer Status with Live Formula & Insight */}
      <div
        className={`pt-2 border-t text-xs font-mono flex items-center justify-between shrink-0 ${
          isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t.activeInvariantModel}:</span>
          {points ? (
            <MathFormula
              math={`y = ${smoothW.toFixed(2)}x + ${smoothB.toFixed(2)}`}
              className="ml-1 font-bold text-blue-600 dark:text-cyan-300"
            />
          ) : neuronState ? (
            <MathFormula
              math={`z = \\mathbf{w}^T\\mathbf{x} + b = ${neuronState.weightedSum} \\implies a = ${neuronState.outputVal}`}
              className="ml-1 font-bold text-blue-600 dark:text-cyan-300"
            />
          ) : modernNeuronState ? (
            <MathFormula
              math={`z = ${smoothZ.toFixed(2)} \\implies a = ${smoothA.toFixed(3)} \\quad (\\nabla = ${modernNeuronState.gradientVal.toFixed(3)})`}
              className="ml-1 font-bold text-blue-600 dark:text-cyan-300"
            />
          ) : (
            <span className="font-bold">{t.traceActive}</span>
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
