import React, { useState, useMemo, useRef } from 'react';
import { 
  Target, 
  HelpCircle, 
  Binary, 
  Activity, 
  Percent,
  Sparkles
} from 'lucide-react';
import type { 
  ThemeMode, 
  Language, 
  LogisticState, 
  LogisticPoint 
} from '../types';

interface LogisticStageProps {
  theme: ThemeMode;
  language: Language;
  logisticState: LogisticState;
  onChangeInput?: (newInput: string) => void;
  isExpanded?: boolean;
}

export const LogisticStage: React.FC<LogisticStageProps> = ({
  theme,
  language,
  logisticState,
  onChangeInput,
  isExpanded = false,
}) => {
  const isDark = theme === 'studio';
  const isVi = language === 'vi';
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const {
    points,
    weight: w,
    bias: b,
    loss,
    accuracy,
    decisionBoundary,
    confusionMatrix,
    epoch,
  } = logisticState;

  // Coordinate limits: X ranges from 0 to max(10, max(X)+1)
  const { minX, maxX } = useMemo(() => {
    if (!points || points.length === 0) return { minX: 0, maxX: 10 };
    const allX = points.map((p) => p.x);
    const maxVal = Math.max(10, Math.ceil(Math.max(...allX) + 1));
    const minVal = Math.min(0, Math.floor(Math.min(...allX) - 1));
    return { minX: minVal, maxX: maxVal };
  }, [points]);

  const SVG_W = 760;
  const SVG_H = isExpanded ? 460 : 340;
  const PADDING = { top: 35, right: 35, bottom: 45, left: 55 };
  const plotW = SVG_W - PADDING.left - PADDING.right;
  const plotH = SVG_H - PADDING.top - PADDING.bottom;

  const toSvgX = (xVal: number) => {
    const norm = (xVal - minX) / (maxX - minX);
    return PADDING.left + Math.max(0, Math.min(1, norm)) * plotW;
  };

  const toSvgY = (probVal: number) => {
    // Probability ranges from 0 to 1
    const clamped = Math.max(0, Math.min(1, probVal));
    return PADDING.top + (1 - clamped) * plotH;
  };


  // Generate continuous Sigmoid curve points
  const sigmoidCurvePath = useMemo(() => {
    const numPoints = 120;
    const pathParts: string[] = [];
    for (let i = 0; i <= numPoints; i++) {
      const curX = minX + (i / numPoints) * (maxX - minX);
      const z = w * curX + b;
      const prob = 1 / (1 + Math.exp(-Math.max(-25, Math.min(25, z))));
      const sx = toSvgX(curX);
      const sy = toSvgY(prob);
      pathParts.push(`${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    }
    return pathParts.join(' ');
  }, [w, b, minX, maxX, plotW, plotH]);

  // Click on canvas to add or remove points
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onChangeInput || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const clickY = ((e.clientY - rect.top) / rect.height) * SVG_H;

    // Check if clicked inside plot area
    if (
      clickX < PADDING.left - 10 ||
      clickX > SVG_W - PADDING.right + 10 ||
      clickY < PADDING.top - 10 ||
      clickY > SVG_H - PADDING.bottom + 10
    ) {
      return;
    }

    const clickedDataX = Number((minX + ((clickX - PADDING.left) / plotW) * (maxX - minX)).toFixed(1));
    const clickedProb = 1 - (clickY - PADDING.top) / plotH;

    // Check if clicked near an existing point (to delete it)
    const existingIndex = points.findIndex((p) => {
      const px = toSvgX(p.x);
      const py = toSvgY(p.y);
      const dist = Math.hypot(clickX - px, clickY - py);
      return dist < 16;
    });

    let newPoints: LogisticPoint[] = [];
    if (existingIndex >= 0) {
      // Remove point
      newPoints = points.filter((_, idx) => idx !== existingIndex);
    } else {
      // Add point: click in upper half is Class 1 (y=1), lower half is Class 0 (y=0)
      const newLabel: 0 | 1 = clickedProb >= 0.5 ? 1 : 0;
      newPoints = [...points, { x: clickedDataX, y: newLabel }].sort((a, b) => a.x - b.x);
    }

    if (newPoints.length >= 2) {
      const newStr = newPoints.map((p) => `(${p.x}, ${p.y})`).join(', ');
      onChangeInput(newStr);
    }
  };

  const boundarySvgX = toSvgX(decisionBoundary);
  const thresholdSvgY = toSvgY(0.5);

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="w-full h-full flex flex-col relative select-none">
      {/* ========================================================= */}
      {/* 1. TOP METRICS & CONFUSION MATRIX HUD                    */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-2 pb-1 border-b border-inherit">
        {/* Left: Model Metrics */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {/* Epoch badge */}
          <span
            className={`px-2.5 py-1 rounded-xl font-bold transition-all shadow-xs flex items-center gap-1.5 ${
              isDark
                ? 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            <span>Epoch: {epoch}</span>
          </span>

          {/* BCE Loss */}
          <span
            className={`px-2.5 py-1 rounded-xl font-bold transition-all shadow-xs flex items-center gap-1.5 ${
              isDark
                ? 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
            title="Binary Cross-Entropy Log Loss"
          >
            <span className="opacity-70">BCE Loss:</span>
            <span className="font-mono">{loss.toFixed(4)}</span>
          </span>

          {/* Accuracy */}
          <span
            className={`px-2.5 py-1 rounded-xl font-bold transition-all shadow-xs flex items-center gap-1.5 ${
              accuracy >= 80
                ? isDark
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : isDark
                ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-emerald-500" />
            <span className="opacity-70">{isVi ? 'Độ chính xác:' : 'Accuracy:'}</span>
            <span>{accuracy.toFixed(1)}%</span>
          </span>

          {/* Equation & Boundary */}
          <span
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-mono text-[11px] font-bold ${
              isDark
                ? 'bg-cyan-950/30 text-cyan-300 border border-cyan-800/40'
                : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
            }`}
            title="Decision Boundary x* = -b/w"
          >
            <Target className="w-3.5 h-3.5 text-cyan-500" />
            <span>x* = {isFinite(decisionBoundary) ? decisionBoundary.toFixed(2) : 'N/A'}</span>
          </span>
        </div>

        {/* Right: Confusion Matrix Mini Widget */}
        <div
          className={`flex items-center gap-2 px-2.5 py-1 rounded-xl border text-[11px] font-mono shadow-xs ${
            isDark
              ? 'bg-[#0d131f] border-slate-800 text-slate-300'
              : 'bg-white border-slate-200 text-slate-700'
          }`}
          title="Confusion Matrix [TP, FP; FN, TN]"
        >
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold opacity-60">
            <Binary className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Matrix:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              TP: {confusionMatrix.tp}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
              FP: {confusionMatrix.fp}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
              FN: {confusionMatrix.fn}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
              TN: {confusionMatrix.tn}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN SVG CANVAS                                       */}
      {/* ========================================================= */}
      <div className="flex-1 w-full relative flex items-center justify-center p-1 overflow-hidden">
        {/* Interactive Click Hint */}
        <div className="absolute top-2 left-4 z-10 flex items-center gap-1.5 text-[11px] opacity-70 font-sans pointer-events-none">
          <HelpCircle className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
          <span>
            {isVi
              ? 'Nhấp nửa trên đồ thị để thêm điểm Lớp 1, nửa dưới để thêm điểm Lớp 0 (Nhấp vào điểm để xóa)'
              : 'Click upper half to add Class 1, lower half for Class 0 (Click existing point to remove)'}
          </span>
        </div>

        {/* Hover Tooltip Card */}
        {hoveredPoint && (
          <div
            className={`absolute top-2 right-4 z-20 px-3 py-2 rounded-xl border text-xs font-mono shadow-xl backdrop-blur-md transition-all ${
              isDark
                ? 'bg-slate-900/90 border-slate-700 text-slate-100'
                : 'bg-white/95 border-slate-200 text-slate-800'
            }`}
          >
            <div className="font-bold flex items-center gap-2 mb-1">
              <span>
                {isVi ? 'Điểm' : 'Sample'} #{hoveredIndex! + 1}: x={hoveredPoint.x}, y={hoveredPoint.y}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  hoveredPoint.predLabel === hoveredPoint.y
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {hoveredPoint.predLabel === hoveredPoint.y
                  ? isVi
                    ? 'Đúng'
                    : 'Correct'
                  : isVi
                  ? 'Sai'
                  : 'Misclassified'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] opacity-80">
              <div>z = w·x + b: <span className="font-bold">{(w * hoveredPoint.x + b).toFixed(2)}</span></div>
              <div>P(y=1): <span className="font-bold font-mono text-cyan-400">{(hoveredPoint.prob ?? 0).toFixed(3)}</span></div>
              <div>{isVi ? 'Dự đoán:' : 'Pred:'} <span className="font-bold">Lớp {hoveredPoint.predLabel ?? 0}</span></div>
              <div>BCE Loss: <span className="font-bold text-rose-400">{(hoveredPoint.loss ?? 0).toFixed(3)}</span></div>
            </div>
          </div>
        )}

        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-full max-h-full cursor-crosshair overflow-visible transition-colors"
          onClick={handleSvgClick}
        >
          <defs>
            {/* Sigmoid Line Gradient */}
            <linearGradient id="sigmoidGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ===================================================== */}
          {/* A. SHADED BACKGROUND DECISION REGIONS                 */}
          {/* ===================================================== */}
          {isFinite(boundarySvgX) && boundarySvgX > PADDING.left && boundarySvgX < SVG_W - PADDING.right && (
            <>
              {/* Region 1: Left of Boundary (Negative / Class 0 if w > 0) */}
              <rect
                x={PADDING.left}
                y={PADDING.top}
                width={Math.max(0, boundarySvgX - PADDING.left)}
                height={plotH}
                fill={w >= 0 ? 'rgba(244, 63, 94, 0.05)' : 'rgba(16, 185, 129, 0.05)'}
                className="transition-all duration-300"
              />
              {/* Region 2: Right of Boundary (Positive / Class 1 if w > 0) */}
              <rect
                x={boundarySvgX}
                y={PADDING.top}
                width={Math.max(0, SVG_W - PADDING.right - boundarySvgX)}
                height={plotH}
                fill={w >= 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)'}
                className="transition-all duration-300"
              />

              {/* Region Labels */}
              <text
                x={PADDING.left + 10}
                y={SVG_H - PADDING.bottom - 10}
                fill={isDark ? '#f43f5e' : '#e11d48'}
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                opacity="0.6"
              >
                {w >= 0 ? (isVi ? '◀ VÙNG DỰ ĐOÁN LỚP 0 (P < 0.5)' : '◀ PREDICTED CLASS 0 (P < 0.5)') : ''}
              </text>
              <text
                x={SVG_W - PADDING.right - 10}
                y={PADDING.top + 18}
                textAnchor="end"
                fill={isDark ? '#34d399' : '#059669'}
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                opacity="0.6"
              >
                {w >= 0 ? (isVi ? 'VÙNG DỰ ĐOÁN LỚP 1 (P ≥ 0.5) ▶' : 'PREDICTED CLASS 1 (P ≥ 0.5) ▶') : ''}
              </text>
            </>
          )}

          {/* ===================================================== */}
          {/* B. GRID LINES & AXIS TICKS                            */}
          {/* ===================================================== */}
          {/* Probability Y-ticks: 0.0, 0.25, 0.50, 0.75, 1.00 */}
          {[0.0, 0.25, 0.5, 0.75, 1.0].map((prob) => {
            const yPos = toSvgY(prob);
            return (
              <g key={prob} className="opacity-40">
                <line
                  x1={PADDING.left}
                  y1={yPos}
                  x2={SVG_W - PADDING.right}
                  y2={yPos}
                  stroke={prob === 0.5 ? '#818cf8' : isDark ? '#334155' : '#cbd5e1'}
                  strokeWidth={prob === 0.5 ? '1.5' : '1'}
                  strokeDasharray={prob === 0.5 ? '4,4' : '2,2'}
                />
                <text
                  x={PADDING.left - 8}
                  y={yPos + 4}
                  textAnchor="end"
                  fill={prob === 0.5 ? '#818cf8' : isDark ? '#94a3b8' : '#64748b'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight={prob === 0.5 ? 'bold' : 'normal'}
                >
                  {prob.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Feature X-ticks */}
          {Array.from({ length: maxX - minX + 1 }).map((_, idx) => {
            const val = minX + idx;
            // Only draw every 1 or 2 steps depending on range
            const stepSkip = maxX - minX > 15 ? 2 : 1;
            if (val % stepSkip !== 0) return null;
            const xPos = toSvgX(val);
            return (
              <g key={val} className="opacity-40">
                <line
                  x1={xPos}
                  y1={PADDING.top}
                  x2={xPos}
                  y2={SVG_H - PADDING.bottom}
                  stroke={isDark ? '#334155' : '#cbd5e1'}
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text
                  x={xPos}
                  y={SVG_H - PADDING.bottom + 16}
                  textAnchor="middle"
                  fill={isDark ? '#94a3b8' : '#64748b'}
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={SVG_W - PADDING.right}
            y={SVG_H - PADDING.bottom + 32}
            textAnchor="end"
            fill={isDark ? '#cbd5e1' : '#475569'}
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {isVi ? 'Đặc trưng x (Feature X) ▶' : 'Feature X ▶'}
          </text>
          <text
            x={PADDING.left - 30}
            y={PADDING.top - 12}
            textAnchor="start"
            fill={isDark ? '#cbd5e1' : '#475569'}
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {isVi ? '▲ Xác suất P(y=1) = σ(wx+b)' : '▲ Probability P(y=1) = σ(wx+b)'}
          </text>

          {/* ===================================================== */}
          {/* C. DECISION BOUNDARY & THRESHOLD LINES                */}
          {/* ===================================================== */}
          {/* Threshold Line at P = 0.5 */}
          <g>
            <line
              x1={PADDING.left}
              y1={thresholdSvgY}
              x2={SVG_W - PADDING.right}
              y2={thresholdSvgY}
              stroke="#818cf8"
              strokeWidth="1.5"
              strokeDasharray="5,4"
              opacity="0.8"
            />
            <rect
              x={SVG_W - PADDING.right - 95}
              y={thresholdSvgY - 10}
              width="90"
              height="18"
              rx="4"
              fill={isDark ? '#1e1b4b' : '#e0e7ff'}
              stroke="#818cf8"
              strokeWidth="1"
              opacity="0.9"
            />
            <text
              x={SVG_W - PADDING.right - 50}
              y={thresholdSvgY + 3}
              textAnchor="middle"
              fill={isDark ? '#c7d2fe' : '#4338ca'}
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {isVi ? 'Ngưỡng P = 0.50' : 'Threshold P=0.5'}
            </text>
          </g>

          {/* Decision Boundary Line (x* = -b/w) */}
          {isFinite(boundarySvgX) && boundarySvgX >= PADDING.left && boundarySvgX <= SVG_W - PADDING.right && (
            <g>
              <line
                x1={boundarySvgX}
                y1={PADDING.top}
                x2={boundarySvgX}
                y2={SVG_H - PADDING.bottom}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="6,4"
                className="transition-all duration-300"
              />
              {/* Boundary Top Badge */}
              <rect
                x={boundarySvgX - 45}
                y={PADDING.top - 20}
                width="90"
                height="18"
                rx="5"
                fill={isDark ? '#0c4a6e' : '#bae6fd'}
                stroke="#38bdf8"
                strokeWidth="1.5"
                className="shadow-md"
              />
              <text
                x={boundarySvgX}
                y={PADDING.top - 8}
                textAnchor="middle"
                fill={isDark ? '#e0f2fe' : '#0369a1'}
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                x* = {decisionBoundary.toFixed(2)}
              </text>
            </g>
          )}

          {/* ===================================================== */}
          {/* D. CONTINUOUS SIGMOID S-CURVE                         */}
          {/* ===================================================== */}
          {/* Glowing Shadow curve */}
          <path
            d={sigmoidCurvePath}
            fill="none"
            stroke={isDark ? '#06b6d4' : '#3b82f6'}
            strokeWidth="6"
            strokeOpacity="0.2"
            strokeLinecap="round"
          />
          {/* Primary S-Curve */}
          <path
            d={sigmoidCurvePath}
            fill="none"
            stroke="url(#sigmoidGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* ===================================================== */}
          {/* E. DATA POINTS & PROJECTION RESIDUAL STEMS            */}
          {/* ===================================================== */}
          {points.map((p, idx) => {
            const px = toSvgX(p.x);
            const actualY = toSvgY(p.y);
            const z = w * p.x + b;
            const predProb = 1 / (1 + Math.exp(-Math.max(-25, Math.min(25, z))));
            const predY = toSvgY(predProb);
            const isCorrect = (predProb >= 0.5 ? 1 : 0) === p.y;
            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={idx}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Vertical Projection Stem connecting Ground Truth to Sigmoid S-curve */}
                <line
                  x1={px}
                  y1={actualY}
                  x2={px}
                  y2={predY}
                  stroke={isCorrect ? '#10b981' : '#f43f5e'}
                  strokeWidth={isHovered ? '2.5' : '1.5'}
                  strokeDasharray={isCorrect ? '3,3' : '2,2'}
                  opacity={isHovered ? 1 : 0.7}
                />

                {/* Point on the Sigmoid Curve (Predicted Probability) */}
                <circle
                  cx={px}
                  cy={predY}
                  r={isHovered ? 5 : 3.5}
                  fill={isDark ? '#0f172a' : '#ffffff'}
                  stroke={isCorrect ? '#10b981' : '#f43f5e'}
                  strokeWidth="2"
                  className="transition-all duration-200"
                />

                {/* Ground Truth Point (Placed at y=0 or y=1) */}
                {/* Outer Glow Halo if hovered or misclassified */}
                {(isHovered || !isCorrect) && (
                  <circle
                    cx={px}
                    cy={actualY}
                    r={isHovered ? 15 : 12}
                    fill={isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.25)'}
                    className={!isCorrect ? 'animate-pulse' : ''}
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={px}
                  cy={actualY}
                  r={isHovered ? 9 : 7.5}
                  fill={
                    p.y === 1
                      ? isDark
                        ? '#064e3b'
                        : '#d1fae5'
                      : isDark
                      ? '#881337'
                      : '#ffe4e6'
                  }
                  stroke={p.y === 1 ? '#10b981' : '#f43f5e'}
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />

                {/* Symbol inside node: + for 1, - for 0 */}
                <text
                  x={px}
                  y={actualY + (p.y === 1 ? 3 : 2.5)}
                  textAnchor="middle"
                  fill={p.y === 1 ? '#10b981' : '#f43f5e'}
                  fontSize={isHovered ? '10' : '9'}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {p.y === 1 ? '1' : '0'}
                </text>

                {/* Coordinate label below/above */}
                <text
                  x={px}
                  y={p.y === 1 ? actualY - 11 : actualY + 16}
                  textAnchor="middle"
                  fill={isDark ? '#94a3b8' : '#64748b'}
                  fontSize="8.5"
                  fontFamily="monospace"
                  opacity={isHovered ? 1 : 0.6}
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  ({p.x}, {p.y})
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ========================================================= */}
      {/* 3. BOTTOM SUMMARY & FORMULA INVARIANT STRIP              */}
      {/* ========================================================= */}
      <div
        className={`px-3 py-1.5 border-t flex flex-wrap items-center justify-between text-xs font-mono transition-colors ${
          isDark ? 'border-slate-800 bg-[#0d131f]/90' : 'border-slate-200 bg-slate-50/90'
        }`}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            {isVi ? 'Mô hình Hồi quy:' : 'Regression Model:'}
          </span>
          <span className="font-bold text-blue-600 dark:text-cyan-300">
            z = {w.toFixed(2)}x + ({b.toFixed(2)})
          </span>
          <span className="text-slate-400 dark:text-slate-600">|</span>
          <span className="font-bold text-indigo-500 dark:text-indigo-300">
            P(y=1) = σ(z) = 1 / (1 + e^-(z))
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>{isVi ? 'Lớp 1 (Positive)' : 'Class 1 (y=1)'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>{isVi ? 'Lớp 0 (Negative)' : 'Class 0 (y=0)'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-sky-400 inline-block" />
            <span>{isVi ? 'Ranh giới x*' : 'Boundary x*'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
