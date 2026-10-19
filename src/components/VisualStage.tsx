import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';
import type { ThemeMode, TraceStep } from '../types';

interface VisualStageProps {
  theme: ThemeMode;
  step: TraceStep;
  category: string;
}

export const VisualStage: React.FC<VisualStageProps> = ({
  theme,
  step,
  category,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const isSketch = theme === 'sketch';

  const arr = step.state.arr;
  const points = step.state.points;
  const layers = step.state.layers;
  const tokens = step.state.tokens;
  const probabilities = step.state.probabilities;

  // Rough.js dynamic sketching for Sketch Mode
  useEffect(() => {
    if (!isSketch || !svgRef.current) return;

    const svg = svgRef.current;
    const oldRough = svg.querySelectorAll('.rough-element');
    oldRough.forEach((el) => el.remove());

    const rc = rough.svg(svg);

    // 1. Regression Plot in Sketch Mode
    if (points && points.length > 0) {
      const originX = 70;
      const originY = 300;
      const scaleX = 110;
      const scaleY = 38;

      // Draw Axes
      const xAxis = rc.line(originX, originY, originX + 580, originY, {
        stroke: '#3c3836',
        strokeWidth: 2,
        roughness: 1.5,
      });
      xAxis.classList.add('rough-element');
      svg.appendChild(xAxis);

      const yAxis = rc.line(originX, originY, originX, originY - 240, {
        stroke: '#3c3836',
        strokeWidth: 2,
        roughness: 1.5,
      });
      yAxis.classList.add('rough-element');
      svg.appendChild(yAxis);

      // Regression Line y = w*x + b
      const w = step.state.weight !== undefined ? Number(step.state.weight) : 0;
      const b = step.state.bias !== undefined ? Number(step.state.bias) : 0;

      const xStart = 0.5;
      const xEnd = 5.5;
      const yStartVal = w * xStart + b;
      const yEndVal = w * xEnd + b;

      const p1X = originX + xStart * scaleX;
      const p1Y = originY - yStartVal * scaleY;
      const p2X = originX + xEnd * scaleX;
      const p2Y = originY - yEndVal * scaleY;

      const regLine = rc.line(p1X, p1Y, p2X, p2Y, {
        stroke: '#d65d0e',
        strokeWidth: 3,
        roughness: 1.2,
      });
      regLine.classList.add('rough-element');
      svg.appendChild(regLine);

      // Data points and residuals
      points.forEach((p) => {
        const px = originX + p.x * scaleX;
        const py = originY - p.y * scaleY;
        const pyPred = originY - (p.yPred ?? (w * p.x + b)) * scaleY;

        // Residual error stem
        const stem = rc.line(px, py, px, pyPred, {
          stroke: '#cc241d',
          strokeWidth: 1.5,
          roughness: 1.4,
          strokeLineDash: [4, 4],
        });
        stem.classList.add('rough-element');
        svg.appendChild(stem);

        // Point circle
        const circle = rc.circle(px, py, 18, {
          fill: '#fabd2f',
          fillStyle: 'solid',
          stroke: '#3c3836',
          strokeWidth: 1.8,
          roughness: 1.2,
        });
        circle.classList.add('rough-element');
        svg.appendChild(circle);
      });
    }

    // 2. Classical Array in Sketch Mode
    if (arr && arr.length > 0) {
      const maxVal = Math.max(...arr, 1);
      const width = 700;
      const height = 360;
      const barMargin = 12;
      const availableWidth = width - 80;
      const barWidth = Math.min(64, Math.max(28, availableWidth / arr.length - barMargin));
      const startX = (width - (arr.length * (barWidth + barMargin) - barMargin)) / 2;

      arr.forEach((val, idx) => {
        const barHeight = Math.max(30, (val / maxVal) * (height - 130));
        const x = startX + idx * (barWidth + barMargin);
        const y = height - 60 - barHeight;

        const isTarget = step.targets.includes(idx);
        const isSwap = step.action === 'swap' && isTarget;

        let fillColor = '#fbf7ee';
        let strokeColor = '#3c3836';
        if (isSwap) {
          fillColor = '#cc241d';
          strokeColor = '#9d0006';
        } else if (isTarget) {
          fillColor = '#fabd2f';
          strokeColor = '#b57614';
        } else if (step.action === 'done') {
          fillColor = '#98971a';
          strokeColor = '#79740e';
        }

        const rect = rc.rectangle(x, y, barWidth, barHeight, {
          fill: fillColor,
          fillStyle: 'hachure',
          stroke: strokeColor,
          strokeWidth: isTarget ? 2.5 : 1.8,
          fillWeight: 1.2,
          roughness: 1.6,
        });
        rect.classList.add('rough-element');
        svg.appendChild(rect);
      });
    }
  }, [isSketch, points, arr, step]);

  return (
    <div
      className={`relative w-full h-full min-h-[380px] flex flex-col justify-between p-4 overflow-hidden select-none transition-colors ${
        isSketch
          ? 'bg-sketch-dots text-[#282828]'
          : 'bg-studio-dots text-white'
      }`}
    >
      {/* Stage Header Info */}
      <div className="flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs uppercase font-mono tracking-wider px-2 py-0.5 rounded font-semibold ${
              isSketch
                ? 'bg-[#ebdbb2] text-[#3c3836] border border-[#3c3836]/30'
                : 'bg-slate-800/90 text-cyan-400 border border-slate-700/80'
            }`}
          >
            {category} Stage
          </span>
          <span className="text-xs opacity-60 font-mono">
            Step {step.step} / {step.totalSteps}
          </span>
        </div>

        {/* Dynamic Metric Badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {step.state.loss !== undefined && (
            <span
              className={`px-2 py-0.5 rounded font-bold ${
                isSketch
                  ? 'bg-[#cc241d]/20 text-[#cc241d] border border-[#cc241d]/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
              }`}
            >
              Loss (MSE): {step.state.loss}
            </span>
          )}
          {step.state.weight !== undefined && (
            <span
              className={`px-2 py-0.5 rounded font-bold ${
                isSketch
                  ? 'bg-[#ebdbb2] text-[#3c3836]'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}
            >
              w: {step.state.weight} | b: {step.state.bias}
            </span>
          )}
        </div>
      </div>

      {/* Main Stage Visual Content */}
      <div className="relative flex-1 w-full flex items-center justify-center my-2 overflow-hidden">
        {/* ========================================================= */}
        {/* 1. REGRESSION PLOT VISUALIZER (Linear & Logistic Regression) */}
        {/* ========================================================= */}
        {points && points.length > 0 && (
          <div className="w-full h-full relative flex items-center justify-center">
            {isSketch ? (
              // Sketch Mode 2D Plot
              <svg
                ref={svgRef}
                viewBox="0 0 700 360"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full max-h-[340px]"
              >
                {/* Labels and values rendered via SVG text */}
                {points.map((p, idx) => {
                  const originX = 70;
                  const originY = 300;
                  const scaleX = 110;
                  const scaleY = 38;
                  const px = originX + p.x * scaleX;
                  const py = originY - p.y * scaleY;
                  return (
                    <text
                      key={idx}
                      x={px}
                      y={py - 14}
                      textAnchor="middle"
                      className="font-sketch font-bold text-sm fill-[#282828]"
                    >
                      ({p.x}, {p.y})
                    </text>
                  );
                })}
                {/* Axis Labels */}
                <text x="640" y="320" className="font-sketch font-bold text-base fill-[#3c3836]">
                  Feature X
                </text>
                <text x="40" y="60" className="font-sketch font-bold text-base fill-[#3c3836]">
                  Target y
                </text>
              </svg>
            ) : (
              // Clean Pro Studio Mode: Neon Glowing Scatter & Dynamic Fit Line
              <div className="w-full h-full relative max-w-2xl max-h-[320px]">
                <svg
                  viewBox="0 0 700 360"
                  preserveAspectRatio="xMidYMid meet"
                  className="w-full h-full"
                >
                  <defs>
                    <linearGradient id="regGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>

                  {/* Subtle Grid Lines */}
                  {[1, 2, 3, 4, 5, 6].map((gridX) => (
                    <line
                      key={`gx-${gridX}`}
                      x1={70 + gridX * 90}
                      y1="40"
                      x2={70 + gridX * 90}
                      y2="300"
                      stroke="#1e293b"
                      strokeDasharray="4 4"
                    />
                  ))}
                  {[1, 2, 3, 4, 5, 6, 7].map((gridY) => (
                    <line
                      key={`gy-${gridY}`}
                      x1="70"
                      y1={300 - gridY * 36}
                      x2="650"
                      y2={300 - gridY * 36}
                      stroke="#1e293b"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Axes */}
                  <line x1="70" y1="300" x2="650" y2="300" stroke="#475569" strokeWidth="2" />
                  <line x1="70" y1="300" x2="70" y2="40" stroke="#475569" strokeWidth="2" />

                  {/* Axis Text */}
                  <text x="630" y="325" fill="#94a3b8" className="font-mono text-xs font-bold">
                    Feature X
                  </text>
                  <text x="35" y="45" fill="#94a3b8" className="font-mono text-xs font-bold">
                    Target y
                  </text>

                  {/* Regression Fit Line */}
                  {(() => {
                    const originX = 70;
                    const originY = 300;
                    const scaleX = 100;
                    const scaleY = 36;
                    const w = step.state.weight !== undefined ? Number(step.state.weight) : 0;
                    const b = step.state.bias !== undefined ? Number(step.state.bias) : 0;
                    const p1X = originX + 0.5 * scaleX;
                    const p1Y = originY - (w * 0.5 + b) * scaleY;
                    const p2X = originX + 5.5 * scaleX;
                    const p2Y = originY - (w * 5.5 + b) * scaleY;

                    return (
                      <line
                        x1={p1X}
                        y1={p1Y}
                        x2={p2X}
                        y2={p2Y}
                        stroke="url(#regGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="transition-all duration-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      />
                    );
                  })()}

                  {/* Data Points and Error Residuals */}
                  {points.map((p, idx) => {
                    const originX = 70;
                    const originY = 300;
                    const scaleX = 100;
                    const scaleY = 36;
                    const px = originX + p.x * scaleX;
                    const py = originY - p.y * scaleY;
                    const w = step.state.weight !== undefined ? Number(step.state.weight) : 0;
                    const b = step.state.bias !== undefined ? Number(step.state.bias) : 0;
                    const pyPred = originY - (p.yPred ?? (w * p.x + b)) * scaleY;

                    return (
                      <g key={idx}>
                        {/* Red Residual Error dashed line */}
                        <line
                          x1={px}
                          y1={py}
                          x2={px}
                          y2={pyPred}
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        />
                        {/* Target Data Point */}
                        <circle
                          cx={px}
                          cy={py}
                          r="7"
                          fill="#f59e0b"
                          stroke="#fbbf24"
                          strokeWidth="2"
                          className="drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]"
                        />
                        <text
                          x={px}
                          y={py - 12}
                          fill="#f1f5f9"
                          textAnchor="middle"
                          className="font-mono text-[11px] font-semibold"
                        >
                          ({p.x}, {p.y})
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. NEURAL NETWORK FORWARD PASS (MLP & Activation Layers)   */}
        {/* ========================================================= */}
        {layers && layers.length > 0 && (
          <div className="w-full max-w-3xl flex items-center justify-around py-4">
            {layers.map((layer) => (
              <div key={layer.name} className="flex flex-col items-center gap-4">
                <span className="text-xs font-mono font-bold opacity-70">
                  {layer.name}
                </span>

                <div className="flex flex-col gap-4">
                  {layer.nodes.map((node) => {
                    const isActive = node.value > 0;

                    return (
                      <div
                        key={node.label}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs border transition-all ${
                          isSketch
                            ? isActive
                              ? 'bg-[#fabd2f] text-[#282828] sketch-border font-bold'
                              : 'bg-[#fbf7ee] text-[#7c6f64] border-[#3c3836]/40'
                            : isActive
                              ? 'bg-gradient-to-r from-indigo-600/40 to-cyan-500/40 text-cyan-200 border-cyan-400 shadow-lg shadow-cyan-500/20 font-bold'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold bg-black/10 dark:bg-white/10">
                          {node.label}
                        </span>
                        <span>{node.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. TRANSFORMER SELF-ATTENTION & NEXT-TOKEN LOGITS         */}
        {/* ========================================================= */}
        {tokens && tokens.length > 0 && (
          <div className="w-full max-w-2xl flex flex-col items-center gap-6 py-2">
            {/* Context Token Window */}
            <div className="w-full">
              <div className="text-xs font-mono opacity-60 mb-2 flex items-center justify-between">
                <span>Causal Context Window (Q & K Tokens)</span>
                <span>Active Target: &ldquo;{tokens[tokens.length - 1]}&rdquo;</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {tokens.map((token, idx) => {
                  const isLast = idx === tokens.length - 1;
                  const isAttended = step.targets.includes(idx);

                  return (
                    <div
                      key={idx}
                      className={`relative flex flex-col items-center px-3.5 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
                        isSketch
                          ? isLast
                            ? 'bg-[#d65d0e] text-white sketch-border-subtle font-sketch text-lg'
                            : isAttended
                              ? 'bg-[#fabd2f] text-[#282828] sketch-border-subtle'
                              : 'bg-[#fbf7ee] text-[#282828] border border-[#3c3836]/40'
                          : isLast
                            ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/30 border border-cyan-400'
                            : isAttended
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
                              : 'bg-slate-800/80 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <span className="font-bold">&ldquo;{token}&rdquo;</span>
                      <span className="text-[10px] opacity-60 mt-0.5 font-mono">pos: {idx}</span>
                      {isLast && (
                        <span className="absolute -top-2.5 right-1 text-[9px] uppercase px-1.5 py-0.2 rounded font-bold bg-cyan-400 text-slate-900">
                          Query
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next-Token Probability Distribution Softmax Output */}
            {probabilities && probabilities.length > 0 && (
              <div
                className={`w-full p-4 rounded-xl transition-colors ${
                  isSketch
                    ? 'bg-[#fbf7ee] sketch-border-subtle text-[#282828]'
                    : 'bg-[#0f1626]/90 border border-[#222f46] text-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Softmax Logits & Next-Token Distribution
                  </span>
                  <span className="opacity-60">Vocab Projection</span>
                </div>

                <div className="space-y-2">
                  {probabilities.map((item, idx) => {
                    const isTop1 = idx === 0;
                    const pct = Math.round(item.prob * 100);

                    return (
                      <div key={item.token} className="flex items-center gap-3 text-xs font-mono">
                        <span
                          className={`w-16 truncate font-medium ${
                            isTop1
                              ? isSketch
                                ? 'text-[#d65d0e] font-bold'
                                : 'text-cyan-400 font-bold'
                              : 'opacity-70'
                          }`}
                        >
                          &ldquo;{item.token}&rdquo;
                        </span>

                        <div
                          className={`flex-1 h-3 rounded-full overflow-hidden ${
                            isSketch ? 'bg-[#ebdbb2]' : 'bg-slate-800'
                          }`}
                        >
                          <div
                            style={{ width: `${pct}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              isTop1
                                ? isSketch
                                  ? 'bg-[#d65d0e]'
                                  : 'bg-gradient-to-r from-cyan-400 to-indigo-500'
                                : isSketch
                                  ? 'bg-[#b57614]'
                                  : 'bg-slate-600'
                            }`}
                          />
                        </div>

                        <span
                          className={`w-12 text-right font-bold ${
                            isTop1
                              ? isSketch
                                ? 'text-[#d65d0e]'
                                : 'text-cyan-300'
                              : 'opacity-60'
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
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. CLASSICAL ARRAYS (for legacy reference)               */}
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

                return (
                  <g key={idx}>
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      textAnchor="middle"
                      className="font-sketch font-bold text-lg fill-[#282828]"
                    >
                      {val}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={height - 38}
                      textAnchor="middle"
                      className="font-mono text-xs fill-[#7c6f64]"
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

      {/* Stage Footer Status */}
      <div
        className={`pt-2 border-t text-xs font-mono flex items-center justify-between shrink-0 ${
          isSketch ? 'border-[#3c3836]/20 text-[#7c6f64]' : 'border-slate-800 text-slate-400'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Interactive AI Execution Trace Active
        </span>
        <span>Action: {step.action.toUpperCase()}</span>
      </div>
    </div>
  );
};
