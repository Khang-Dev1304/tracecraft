import React from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Code2, 
  AlertCircle 
} from 'lucide-react';
import type { ThemeMode, TraceStep, AlgorithmPreset } from '../types';
import { VisualStage } from './VisualStage';

interface MobileStoryModeProps {
  theme: ThemeMode;
  preset: AlgorithmPreset;
  step: TraceStep;
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSeek: (step: number) => void;
}

export const MobileStoryMode: React.FC<MobileStoryModeProps> = ({
  theme,
  preset,
  step,
  currentStep,
  totalSteps,
  isPlaying,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onSeek,
}) => {
  const isSketch = theme === 'sketch';
  const codeLines = preset.code.split('\n');
  const activeCodeLine = codeLines[step.line - 1] || codeLines[0];

  return (
    <div
      className={`w-full max-w-lg mx-auto flex flex-col gap-4 p-3 select-none transition-colors ${
        isSketch ? 'text-[#282828]' : 'text-white'
      }`}
    >
      {/* Step Header Card */}
      <div
        className={`p-3.5 rounded-xl flex items-center justify-between shadow-sm transition-colors ${
          isSketch
            ? 'bg-[#fbf7ee] sketch-border-subtle'
            : 'bg-[#121929] border border-[#232f48]'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded ${
                isSketch
                  ? 'bg-[#d65d0e] text-white'
                  : 'bg-indigo-600/80 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              {step.action}
            </span>
            <span className="text-xs font-mono opacity-70">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <h2
            className={`text-sm font-bold mt-1 ${
              isSketch ? 'font-sketch text-lg' : 'text-slate-100'
            }`}
          >
            {preset.title}
          </h2>
          <div className="mt-2 w-32 sm:w-44">
            <input
              type="range"
              min={1}
              max={Math.max(1, totalSteps)}
              value={currentStep}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
        <button
          onClick={onTogglePlay}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-transform active:scale-95 shadow-md ${
            isSketch
              ? 'bg-[#d65d0e] text-white sketch-border-subtle'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>
      </div>

      {/* Visual Canvas Container */}
      <div
        className={`w-full rounded-xl overflow-hidden border shadow-sm ${
          isSketch
            ? 'bg-[#fdfbf7] border-[#3c3836]/40'
            : 'bg-[#0a0e1a] border-[#222f46]'
        }`}
      >
        <VisualStage theme={theme} step={step} category={preset.category} />
      </div>

      {/* Active Code Snippet Card */}
      <div
        className={`p-3.5 rounded-xl border flex flex-col gap-1.5 transition-colors ${
          isSketch
            ? 'bg-[#fbf7ee] border-[#3c3836]/30'
            : 'bg-[#121929] border-[#232f48]'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-mono opacity-70">
          <div className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Line Execution</span>
          </div>
          <span className="font-bold">Line {step.line}</span>
        </div>

        <div
          className={`p-2.5 rounded font-mono text-xs overflow-x-auto whitespace-pre ${
            isSketch
              ? 'bg-[#ebdbb2]/50 text-[#282828] border border-[#3c3836]/20 font-semibold'
              : 'bg-[#090d16] text-cyan-300 border border-cyan-900/50'
          }`}
        >
          {activeCodeLine.trim()}
        </div>
      </div>

      {/* Diagnostic Explanation Card */}
      <div
        className={`p-3.5 rounded-xl border flex flex-col gap-2 transition-colors ${
          isSketch
            ? 'bg-[#fbf7ee] border-[#3c3836]/30'
            : 'bg-[#121929] border-[#232f48]'
        }`}
      >
        <div className="flex items-center gap-1.5 text-xs font-mono opacity-70">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Step Diagnostic</span>
        </div>
        <p
          className={`text-sm leading-relaxed ${
            isSketch ? 'font-sketch text-base font-bold' : 'text-slate-200'
          }`}
        >
          {step.explanation}
        </p>

        {step.invariant && (
          <div
            className={`p-2 rounded text-xs font-mono border-l-2 ${
              isSketch
                ? 'bg-[#ebdbb2]/40 border-[#d65d0e] text-[#282828]'
                : 'bg-cyan-950/20 border-cyan-400 text-slate-300'
            }`}
          >
            <span className="font-bold block text-[10px] text-cyan-400 uppercase mb-0.5">
              Invariant:
            </span>
            <span>{step.invariant}</span>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          onClick={onPrevStep}
          disabled={currentStep <= 1}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-1 text-sm font-bold transition-all disabled:opacity-40 ${
            isSketch
              ? 'bg-[#ebdbb2] border-2 border-[#3c3836] text-[#282828] active:bg-[#d5c4a1]'
              : 'bg-[#1c263c] border border-[#2a3752] text-white active:bg-[#25324e]'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <button
          onClick={onNextStep}
          disabled={currentStep >= totalSteps}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-1 text-sm font-bold transition-all disabled:opacity-40 shadow-md ${
            isSketch
              ? 'bg-[#d65d0e] text-white border-2 border-[#3c3836] active:bg-[#b04b08]'
              : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-cyan-500/20 active:opacity-90'
          }`}
        >
          <span>Next Step</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
