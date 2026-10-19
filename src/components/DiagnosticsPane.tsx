import React, { useState } from 'react';
import { 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  BrainCircuit,
  Binary,
  ChevronRight
} from 'lucide-react';
import type { ThemeMode, TraceStep, StepAction } from '../types';

interface DiagnosticsPaneProps {
  theme: ThemeMode;
  step: TraceStep;
  algorithmTitle: string;
  onToggleCollapse?: () => void;
}
export const DiagnosticsPane: React.FC<DiagnosticsPaneProps> = ({
  theme,
  step,
  algorithmTitle,
  onToggleCollapse,
}) => {
  const isSketch = theme === 'sketch';
  const [socraticOpen, setSocraticOpen] = useState(false);

  const getActionBadgeColor = (action: StepAction) => {
    switch (action) {
      case 'swap':
        return isSketch
          ? 'bg-[#cc241d] text-white border-2 border-[#3c3836]'
          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40';
      case 'compare':
        return isSketch
          ? 'bg-[#fabd2f] text-[#282828] border-2 border-[#3c3836]'
          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'pivot':
      case 'compute':
        return isSketch
          ? 'bg-[#b16286] text-white border-2 border-[#3c3836]'
          : 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
      case 'found':
      case 'done':
        return isSketch
          ? 'bg-[#98971a] text-white border-2 border-[#3c3836]'
          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      default:
        return isSketch
          ? 'bg-[#ebdbb2] text-[#3c3836] border-2 border-[#3c3836]'
          : 'bg-slate-700/40 text-slate-300 border border-slate-600';
    }
  };

  // Generate grounded Socratic AI explanation for the active step
  const getSocraticExplanation = () => {
    switch (step.action) {
      case 'swap':
        return {
          question: 'Why must these elements be swapped right now?',
          answer:
            'The inversion violation (arr[j] > arr[j+1]) contradicts the non-decreasing sorted invariant. By swapping them, the larger element moves one step closer to its final resting position at the end of the array.',
          counterfactual: 'If skipped, the inversion persists and the array terminates in an unsorted state.',
        };
      case 'compare':
        return {
          question: 'What is being verified in this comparison?',
          answer:
            'Checking whether the adjacent pair preserves monotonicity. This is an atomic comparison step contributing directly to the worst-case O(n²) comparison budget.',
          counterfactual: 'Without comparing each adjacent pair, non-local inversions cannot be detected without auxiliary indexing.',
        };
      case 'pivot':
        return {
          question: 'Why choose this midpoint index?',
          answer:
            'Taking mid = ⌊(left + right) / 2⌋ partitions the remaining search space into two equal halves, ensuring a logarithmic search tree depth of ⌈log₂ n⌉.',
          counterfactual: 'Selecting an unbalanced pivot degrades binary search toward linear O(n) scan time.',
        };
      case 'done':
        return {
          question: 'How do we know the algorithm is safely finished?',
          answer:
            'All loop termination criteria or early-exit flags have resolved. The global invariant holds across all elements with zero remaining violations.',
          counterfactual: 'Stopping before all passes or conditions resolve risks unverified prefix/suffix segments.',
        };
      default:
        return {
          question: 'What does this state transition establish?',
          answer:
            'Initializes loop boundary pointers and allocates execution registers for the current iteration pass.',
          counterfactual: 'Uninitialized indices cause out-of-bounds memory faults or infinite loop cycles.',
        };
    }
  };

  const socratic = getSocraticExplanation();

  // Extract scalar state entries for table
  const stateEntries = Object.entries(step.state).filter(([, val]) => {
    return (
      val !== undefined &&
      !Array.isArray(val) &&
      typeof val !== 'object'
    );
  });

  return (
    <div
      className={`flex flex-col h-full border-l overflow-y-auto select-none transition-colors ${
        isSketch
          ? 'bg-[#fcfaf5] border-[#3c3836]/30 text-[#282828]'
          : 'bg-[#0d121f] border-[#222f46] text-slate-200'
      }`}
    >
      {/* Pane Header */}
      <div
        className={`px-3 py-2 border-b flex items-center justify-between text-xs font-mono font-medium ${
          isSketch ? 'border-[#3c3836]/20 bg-[#f6f2e9]' : 'border-[#222f46] bg-[#111828]'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate mr-2">
          <Activity className="w-3.5 h-3.5 opacity-70 shrink-0" />
          <span className="truncate">{algorithmTitle} Diagnostics</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${getActionBadgeColor(
              step.action
            )}`}
          >
            {step.action}
          </span>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title="Collapse Diagnostics"
              className={`p-1 rounded transition-colors ml-1 ${
                isSketch
                  ? 'hover:bg-[#ebdbb2] text-[#3c3836]'
                  : 'hover:bg-[#1a233a] text-slate-400 hover:text-white'
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Diagnostic Explanation Card */}
        <div
          className={`p-3 rounded-lg transition-colors ${
            isSketch
              ? 'bg-[#fbf7ee] sketch-border-subtle'
              : 'bg-[#141b2d] border border-[#232f48]'
          }`}
        >
          <div className="text-xs font-mono opacity-60 mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-cyan-400" />
            <span>Active Step Log</span>
          </div>
          <p
            className={`text-sm leading-relaxed ${
              isSketch ? 'font-sketch text-base font-bold text-[#282828]' : 'text-slate-100 font-medium'
            }`}
          >
            {step.explanation}
          </p>
        </div>

        {/* Mathematical Invariant */}
        {step.invariant && (
          <div
            className={`p-3 rounded-lg border-l-4 transition-colors ${
              isSketch
                ? 'bg-[#f6f2e9] border-[#458588] text-[#282828]'
                : 'bg-cyan-950/20 border-cyan-400 text-slate-300'
            }`}
          >
            <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5 font-bold">
              <Binary className="w-3 h-3" />
              <span>Algorithmic Invariant</span>
            </div>
            <p className="text-xs font-mono leading-relaxed opacity-90">
              {step.invariant}
            </p>
          </div>
        )}

        {/* State Inspector Table */}
        <div
          className={`p-3 rounded-lg transition-colors ${
            isSketch
              ? 'bg-[#fbf7ee] border border-[#3c3836]/30'
              : 'bg-[#141b2d] border border-[#232f48]'
          }`}
        >
          <div className="text-xs font-mono font-bold opacity-70 mb-2 flex items-center justify-between">
            <span>Local State Inspector</span>
            <span className="text-[10px] font-normal opacity-60">Register View</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {stateEntries.map(([key, value]) => {
              const diff = step.variableDiff?.[key];
              const isMutated = Boolean(diff);

              return (
                <div
                  key={key}
                  className={`p-2 rounded flex items-center justify-between ${
                    isMutated
                      ? isSketch
                        ? 'bg-[#fabd2f]/30 border border-[#d65d0e]'
                        : 'bg-cyan-950/50 border border-cyan-500/60 text-cyan-200'
                      : isSketch
                        ? 'bg-[#ebdbb2]/40'
                        : 'bg-[#1a233a]'
                  }`}
                >
                  <span className="opacity-60 font-semibold">{key}:</span>
                  <span className="font-bold">
                    {String(value)}
                    {diff && (
                      <span className="text-[10px] opacity-60 ml-1">
                        ({String(diff.before)} → {String(diff.after)})
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grounded Socratic AI Explainer (Interactive accordion) */}
        <div
          className={`rounded-lg overflow-hidden transition-all border ${
            isSketch
              ? 'bg-[#fbf7ee] border-[#3c3836]/40'
              : 'bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500/30'
          }`}
        >
          <button
            onClick={() => setSocraticOpen(!socraticOpen)}
            className="w-full p-3 flex items-center justify-between text-left transition-colors hover:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span
                className={`text-xs font-bold ${
                  isSketch ? 'font-sketch text-base' : 'text-indigo-200'
                }`}
              >
                Socratic AI Step Explainer
              </span>
            </div>
            {socraticOpen ? (
              <ChevronUp className="w-4 h-4 opacity-60" />
            ) : (
              <ChevronDown className="w-4 h-4 opacity-60" />
            )}
          </button>

          {socraticOpen && (
            <div className="px-3 pb-3 pt-1 space-y-2.5 text-xs font-mono border-t border-indigo-500/20">
              <div>
                <span className="font-bold text-indigo-300 block mb-0.5">
                  Q: {socratic.question}
                </span>
                <p className="opacity-80 leading-relaxed">{socratic.answer}</p>
              </div>

              <div
                className={`p-2 rounded text-[11px] ${
                  isSketch
                    ? 'bg-[#ebdbb2] text-[#282828]'
                    : 'bg-indigo-950/60 text-indigo-200 border border-indigo-800/40'
                }`}
              >
                <span className="font-bold block mb-0.5">
                  💡 Counterfactual Analysis:
                </span>
                <span>{socratic.counterfactual}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
