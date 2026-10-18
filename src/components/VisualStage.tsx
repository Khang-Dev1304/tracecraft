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
  const tokens = step.state.tokens;
  const probabilities = step.state.probabilities;

  // Rough.js dynamic sketching for Sketch Mode
  useEffect(() => {
    if (!isSketch || !svgRef.current) return;

    const svg = svgRef.current;
    // Clear previously drawn rough elements
    const oldRough = svg.querySelectorAll('.rough-element');
    oldRough.forEach((el) => el.remove());

    const rc = rough.svg(svg);

    if (arr && arr.length > 0) {
      const maxVal = Math.max(...arr, 1);
      const width = svg.clientWidth || 640;
      const height = svg.clientHeight || 340;
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
        const isPivot = (step.state.mid === idx || step.state.pivotIndex === idx);

        let fillColor = '#fbf7ee';
        let strokeColor = '#3c3836';
        let fillWeight = 1.2;

        if (isSwap) {
          fillColor = '#cc241d'; // Crimson swap
          strokeColor = '#9d0006';
        } else if (isTarget) {
          fillColor = '#fabd2f'; // Yellow active compare
          strokeColor = '#b57614';
        } else if (isPivot) {
          fillColor = '#b16286'; // Purple pivot/mid
          strokeColor = '#8f3f71';
        } else if (step.action === 'done') {
          fillColor = '#98971a'; // Green sorted
          strokeColor = '#79740e';
        }

        const rect = rc.rectangle(x, y, barWidth, barHeight, {
          fill: fillColor,
          fillStyle: 'hachure',
          stroke: strokeColor,
          strokeWidth: isTarget ? 2.5 : 1.8,
          fillWeight,
          roughness: 1.6,
          bowing: 1.2,
        });
        rect.classList.add('rough-element');
        svg.appendChild(rect);
      });
    }
  }, [isSketch, arr, step]);

  return (
    <div
      className={`relative w-full h-full min-h-[380px] flex flex-col justify-between p-4 overflow-hidden select-none transition-colors ${
        isSketch
          ? 'bg-sketch-dots text-[#282828]'
          : 'bg-studio-dots text-white'
      }`}
    >
      {/* Stage Header Info */}
      <div className="flex items-center justify-between z-10">
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

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-sm ${
                isSketch ? 'bg-[#fabd2f] border border-[#3c3836]' : 'bg-amber-400 shadow-sm shadow-amber-400/50'
              }`}
            />
            <span className="opacity-70">Active/Compare</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-sm ${
                isSketch ? 'bg-[#cc241d] border border-[#3c3836]' : 'bg-rose-500 shadow-sm shadow-rose-500/50'
              }`}
            />
            <span className="opacity-70">Swap/Mutate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-sm ${
                isSketch ? 'bg-[#98971a] border border-[#3c3836]' : 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
              }`}
            />
            <span className="opacity-70">Sorted/Complete</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 w-full flex items-center justify-center my-2">
        {/* Scenario 1: Array Visualization */}
        {arr && arr.length > 0 && (
          <div className="w-full h-full relative flex items-end justify-center pb-6">
            {isSketch ? (
              // Sketch Canvas (RoughJS SVGs + Handwritten labels)
              <svg ref={svgRef} className="w-full h-full absolute inset-0 overflow-visible">
                {arr.map((val, idx) => {
                  const maxVal = Math.max(...arr, 1);
                  const width = 640;
                  const height = 340;
                  const barMargin = 12;
                  const availableWidth = width - 80;
                  const barWidth = Math.min(64, Math.max(28, availableWidth / arr.length - barMargin));
                  const startX = (width - (arr.length * (barWidth + barMargin) - barMargin)) / 2;
                  const x = startX + idx * (barWidth + barMargin);
                  const barHeight = Math.max(30, (val / maxVal) * (height - 130));
                  const y = height - 60 - barHeight;

                  const isLeft = step.state.left === idx;
                  const isRight = step.state.right === idx;
                  const isMid = step.state.mid === idx;
                  const isI = step.state.i === idx;
                  const isJ = step.state.j === idx;

                  return (
                    <g key={idx}>
                      {/* Bar Value text */}
                      <text
                        x={x + barWidth / 2}
                        y={y - 8}
                        textAnchor="middle"
                        className="font-sketch font-bold text-lg fill-[#282828]"
                      >
                        {val}
                      </text>
                      {/* Index text */}
                      <text
                        x={x + barWidth / 2}
                        y={height - 38}
                        textAnchor="middle"
                        className="font-mono text-xs fill-[#7c6f64]"
                      >
                        [{idx}]
                      </text>

                      {/* Pointer labels */}
                      <g transform={`translate(${x + barWidth / 2}, ${height - 15})`}>
                        {isMid && (
                          <text textAnchor="middle" className="font-sketch font-bold text-sm fill-[#b16286]">
                            mid
                          </text>
                        )}
                        {isLeft && !isMid && (
                          <text textAnchor="middle" className="font-sketch font-bold text-sm fill-[#458588]">
                            left
                          </text>
                        )}
                        {isRight && !isMid && (
                          <text textAnchor="middle" className="font-sketch font-bold text-sm fill-[#458588]">
                            right
                          </text>
                        )}
                        {isI && isJ ? (
                          <text textAnchor="middle" className="font-sketch font-bold text-sm fill-[#d65d0e]">
                            i, j
                          </text>
                        ) : (
                          <>
                            {isI && (
                              <text textAnchor="middle" className="font-sketch font-bold text-sm fill-[#d65d0e]">
                                i
                              </text>
                            )}
                            {isJ && (
                              <text textAnchor="middle" className="font-sketch font-bold text-sm fill-[#b57614]">
                                j
                              </text>
                            )}
                          </>
                        )}
                      </g>
                    </g>
                  );
                })}
              </svg>
            ) : (
              // Clean Pro Studio Mode: Crisp Geometric glowing bars
              <div className="flex items-end justify-center gap-3 w-full h-full max-h-[300px] px-4">
                {arr.map((val, idx) => {
                  const maxVal = Math.max(...arr, 1);
                  const barHeightPct = Math.max(14, (val / maxVal) * 85);
                  const isTarget = step.targets.includes(idx);
                  const isSwap = step.action === 'swap' && isTarget;
                  const isMid = step.state.mid === idx;
                  const isLeft = step.state.left === idx;
                  const isRight = step.state.right === idx;
                  const isDone = step.action === 'done';

                  let barStyle = 'from-slate-700 to-slate-800 border-slate-600 text-slate-300';
                  if (isDone) {
                    barStyle = 'from-emerald-500 to-teal-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/20';
                  } else if (isSwap) {
                    barStyle = 'from-rose-500 to-red-600 border-rose-300 text-white shadow-lg shadow-rose-500/40 animate-pulse';
                  } else if (isTarget) {
                    barStyle = 'from-amber-400 to-orange-500 border-amber-300 text-slate-900 shadow-lg shadow-amber-400/40';
                  } else if (isMid) {
                    barStyle = 'from-purple-500 to-indigo-600 border-purple-400 text-white shadow-lg shadow-purple-500/30';
                  }

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-end h-full flex-1 max-w-[68px] group transition-all duration-300"
                    >
                      {/* Numerical Value Bubble */}
                      <span
                        className={`text-xs font-mono font-bold mb-1.5 transition-transform group-hover:scale-110 ${
                          isTarget ? 'text-amber-300' : 'text-slate-300'
                        }`}
                      >
                        {val}
                      </span>

                      {/* Bar Column */}
                      <div
                        style={{ height: `${barHeightPct}%` }}
                        className={`w-full rounded-t-lg bg-gradient-to-t border-t border-x transition-all duration-300 flex items-center justify-center ${barStyle}`}
                      >
                        {isTarget && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        )}
                      </div>

                      {/* Index & Pointer Labels */}
                      <div className="flex flex-col items-center mt-2 font-mono">
                        <span className="text-[11px] text-slate-500">[{idx}]</span>
                        <div className="h-5 flex items-center gap-1 text-[10px] font-bold">
                          {isMid && (
                            <span className="px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                              mid
                            </span>
                          )}
                          {isLeft && (
                            <span className="px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                              L
                            </span>
                          )}
                          {isRight && (
                            <span className="px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                              R
                            </span>
                          )}
                          {step.state.i === idx && (
                            <span className="px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                              i
                            </span>
                          )}
                          {step.state.j === idx && (
                            <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              j
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Scenario 2: Modern AI / Self-Attention Head Visualization */}
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
      </div>

      {/* Stage Footer Status */}
      <div
        className={`pt-2 border-t text-xs font-mono flex items-center justify-between ${
          isSketch ? 'border-[#3c3836]/20 text-[#7c6f64]' : 'border-slate-800 text-slate-400'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Interactive Trace Lockstep Active
        </span>
        <span>Action: {step.action.toUpperCase()}</span>
      </div>
    </div>
  );
};
