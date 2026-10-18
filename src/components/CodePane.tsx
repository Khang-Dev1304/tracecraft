import React from 'react';
import { Code2, ArrowRight } from 'lucide-react';
import type { ThemeMode, TraceStep } from '../types';

interface CodePaneProps {
  theme: ThemeMode;
  code: string;
  activeLine: number;
  step: TraceStep;
}

export const CodePane: React.FC<CodePaneProps> = ({
  theme,
  code,
  activeLine,
  step,
}) => {
  const isSketch = theme === 'sketch';
  const lines = code.split('\n');

  // Format concise in-line snapshot of local variables
  const getInlineState = (): string | null => {
    const parts: string[] = [];
    if (step.state.i !== undefined) parts.push(`i: ${step.state.i}`);
    if (step.state.j !== undefined) parts.push(`j: ${step.state.j}`);
    if (step.state.left !== undefined) parts.push(`L: ${step.state.left}`);
    if (step.state.mid !== undefined) parts.push(`mid: ${step.state.mid}`);
    if (step.state.right !== undefined) parts.push(`R: ${step.state.right}`);
    if (step.state.swapped !== undefined) parts.push(`swapped: ${step.state.swapped}`);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  const inlineState = getInlineState();

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
        className={`px-3 py-2 border-b flex items-center justify-between text-xs font-mono font-medium ${
          isSketch ? 'border-[#3c3836]/20 bg-[#f6f2e9]' : 'border-[#222f46] bg-[#111828]'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 opacity-70" />
          <span>Execution Traced Source</span>
        </div>
        <div className="text-[11px] opacity-60">
          Line {activeLine} of {lines.length}
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 overflow-y-auto p-2 font-mono text-xs sm:text-sm leading-relaxed">
        {lines.map((lineText, idx) => {
          const lineNum = idx + 1;
          const isActive = lineNum === activeLine;

          return (
            <div
              key={idx}
              className={`relative flex items-center group py-0.5 px-1 rounded transition-colors ${
                isActive
                  ? isSketch
                    ? 'bg-[#fabd2f]/30 border-l-4 border-[#d65d0e] font-semibold'
                    : 'bg-indigo-500/20 border-l-4 border-cyan-400 text-white shadow-sm'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
              }`}
            >
              {/* Active Arrow Indicator */}
              <div className="w-4 flex items-center justify-center shrink-0">
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
                className={`w-7 text-right pr-3 select-none text-[11px] shrink-0 ${
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
              <span className="flex-1 whitespace-pre font-mono">
                {lineText || ' '}
              </span>

              {/* In-line Variable Bubble if active */}
              {isActive && inlineState && (
                <span
                  className={`hidden lg:inline-flex text-[10px] px-1.5 py-0.2 rounded ml-2 shrink-0 select-none shadow-sm ${
                    isSketch
                      ? 'bg-[#ebdbb2] text-[#3c3836] border border-[#3c3836]/30'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}
                >
                  {inlineState}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
