import React from 'react';
import { Code2, ArrowRight, Variable, ChevronLeft } from 'lucide-react';
import type { ThemeMode, TraceStep } from '../types';

interface CodePaneProps {
  theme: ThemeMode;
  code: string;
  activeLine: number;
  step: TraceStep;
  onToggleCollapse?: () => void;
}

export const CodePane: React.FC<CodePaneProps> = ({
  theme,
  code,
  activeLine,
  step,
  onToggleCollapse,
}) => {
  const isSketch = theme === 'sketch';
  const lines = code.split('\n');

  // Collect active scalar registers
  const activeVars = Object.entries(step.state).filter(([key, val]) => {
    return (
      val !== undefined &&
      !Array.isArray(val) &&
      typeof val !== 'object' &&
      key !== 'arr' &&
      key !== 'tokens' &&
      key !== 'probabilities'
    );
  });

  return (
    <div
      className={`flex flex-col h-full border-r overflow-hidden select-none transition-colors ${
        isSketch
          ? 'bg-[#fdfbf7] border-[#3c3836]/30 text-[#282828]'
          : 'bg-[#0d121f] border-[#222f46] text-slate-200'
      }`}
    >
      {/* Pane Header */}
      <div
        className={`px-3 py-2 border-b flex items-center justify-between text-xs font-mono font-medium shrink-0 ${
          isSketch ? 'border-[#3c3836]/20 bg-[#f6f2e9]' : 'border-[#222f46] bg-[#111828]'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 opacity-70" />
          <span>Execution Traced Source</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] opacity-60">
            Line {activeLine} of {lines.length}
          </span>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title="Collapse Code Pane"
              className={`p-1 rounded transition-colors ${
                isSketch
                  ? 'hover:bg-[#ebdbb2] text-[#3c3836]'
                  : 'hover:bg-[#1a233a] text-slate-400 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Code Editor Body with horizontal & vertical scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-2 font-mono text-xs sm:text-sm leading-relaxed">
        <div className="min-w-max pb-4">
          {lines.map((lineText, idx) => {
            const lineNum = idx + 1;
            const isActive = lineNum === activeLine;

            return (
              <div
                key={idx}
                className={`relative flex items-center group py-0.5 px-1.5 rounded transition-colors ${
                  isActive
                    ? isSketch
                      ? 'bg-[#fabd2f]/30 border-l-4 border-[#d65d0e] font-semibold'
                      : 'bg-indigo-500/20 border-l-4 border-cyan-400 text-white shadow-sm'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                }`}
              >
                {/* Active Arrow Indicator */}
                <div className="w-4 flex items-center justify-center shrink-0 mr-1">
                  {isActive && (
                    <ArrowRight
                      className={`w-3.5 h-3.5 animate-pulse ${
                        isSketch ? 'text-[#d65d0e]' : 'text-cyan-400'
                      }`}
                    />
                  )}
                </div>

                {/* Line Number */}
                <span
                  className={`w-6 text-right pr-2 select-none text-[11px] shrink-0 ${
                    isActive
                      ? isSketch
                        ? 'text-[#d65d0e] font-bold'
                        : 'text-cyan-400 font-bold'
                      : 'opacity-40'
                  }`}
                >
                  {lineNum}
                </span>

                {/* Code Line Content */}
                <span className="whitespace-pre font-mono pr-4">
                  {lineText || ' '}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dedicated Active Line State Callout - Fixed at bottom, NEVER clips */}
      {activeVars.length > 0 && (
        <div
          className={`p-2.5 border-t shrink-0 font-mono text-xs transition-colors ${
            isSketch
              ? 'bg-[#f6f2e9] border-[#3c3836]/20 text-[#282828]'
              : 'bg-[#111828] border-[#222f46] text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] opacity-70 mb-1.5 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Variable className="w-3 h-3 text-cyan-400" />
              Active Line Registers (Line {activeLine})
            </span>
            <span className="opacity-60">{step.action.toUpperCase()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {activeVars.map(([key, val]) => {
              const diff = step.variableDiff?.[key];
              const isMutated = Boolean(diff);

              return (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                    isMutated
                      ? isSketch
                        ? 'bg-[#fabd2f] text-[#282828] border border-[#d65d0e]'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : isSketch
                        ? 'bg-[#ebdbb2] text-[#3c3836]'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  <span className="opacity-60">{key}:</span>
                  <span>{String(val)}</span>
                  {diff && (
                    <span className="text-[9px] opacity-60">
                      ({String(diff.before)} → {String(diff.after)})
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
