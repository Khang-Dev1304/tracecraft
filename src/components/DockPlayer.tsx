import React from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import type { ThemeMode } from '../types';

interface DockPlayerProps {
  theme: ThemeMode;
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  onSeek: (step: number) => void;
  onChangeSpeed: (speed: number) => void;
}

export const DockPlayer: React.FC<DockPlayerProps> = ({
  theme,
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onReset,
  onSeek,
  onChangeSpeed,
}) => {
  const isDark = theme === 'studio';
  const speeds = [0.5, 1, 2];

  const cycleSpeed = () => {
    const idx = speeds.indexOf(speed);
    const nextSpeed = speeds[(idx + 1) % speeds.length];
    onChangeSpeed(nextSpeed);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 select-none shrink-0 z-20">
      <div
        className={`rounded-2xl border px-4 py-2.5 shadow-dock flex flex-col gap-2 transition-all ${
          isDark
            ? 'bg-[#111827]/95 border-[#1e293b] text-slate-100 backdrop-blur-md'
            : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-md'
        }`}
      >
        {/* Full-width Scrubber Slider */}
        <div className="w-full relative flex items-center">
          <input
            type="range"
            min={1}
            max={Math.max(1, totalSteps)}
            value={currentStep}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-cyan-400"
          />
        </div>

        {/* Player Controls Row */}
        <div className="flex items-center justify-between">
          {/* Step Counter Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-xl border ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              # Step {currentStep} / {totalSteps}
            </span>

            {/* Quiz Chip */}
            <span
              className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                isDark
                  ? 'bg-indigo-950/40 border-indigo-800/40 text-indigo-300'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Interactive</span>
            </span>
          </div>

          {/* Core Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Reset */}
            <button
              onClick={onReset}
              title="Reset to Step 1"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 opacity-60 hover:opacity-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Previous Step */}
            <button
              onClick={onPrevStep}
              disabled={currentStep <= 1}
              title="Previous Step"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 opacity-80 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Play/Pause (VizLearn solid black button with white icon) */}
            <button
              onClick={onTogglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white transition-transform active:scale-95 shadow-sm ${
                isDark
                  ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Step */}
            <button
              onClick={onNextStep}
              disabled={currentStep >= totalSteps}
              title="Next Step"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 opacity-80 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Speed Pill */}
            <button
              onClick={cycleSpeed}
              title="Change Speed"
              className={`text-xs font-mono font-bold px-2 py-1 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950'
              }`}
            >
              {speed}x
            </button>
          </div>

          {/* Time Counter */}
          <div className="text-[11px] font-mono opacity-50 hidden sm:block">
            0:0{Math.min(9, currentStep)} / 0:{Math.max(10, totalSteps)}
          </div>
        </div>
      </div>
    </div>
  );
};
