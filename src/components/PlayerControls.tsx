import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ChevronLeft, 
  ChevronRight,
  Gauge
} from 'lucide-react';
import type { ThemeMode } from '../types';

interface PlayerControlsProps {
  theme: ThemeMode;
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onFirstStep: () => void;
  onLastStep: () => void;
  onSeek: (step: number) => void;
  onChangeSpeed: (speed: number) => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  theme,
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onFirstStep,
  onLastStep,
  onSeek,
  onChangeSpeed,
}) => {
  const isSketch = theme === 'sketch';
  const speeds = [0.5, 1, 2, 4];

  return (
    <div
      className={`w-full px-4 py-3 border-t select-none transition-colors ${
        isSketch
          ? 'bg-[#fcfaf5] border-[#3c3836]/30 text-[#282828]'
          : 'bg-[#0e1424] border-[#222f46] text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Scrubber and Step Indicator */}
        <div className="w-full md:w-5/12 flex items-center gap-3">
          <div className="flex items-baseline gap-1 text-xs font-mono shrink-0">
            <span
              className={`font-bold text-sm ${
                isSketch ? 'text-[#d65d0e]' : 'text-cyan-400'
              }`}
            >
              Step {currentStep}
            </span>
            <span className="opacity-40">/</span>
            <span className="opacity-60">{totalSteps}</span>
          </div>

          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min={1}
              max={Math.max(1, totalSteps)}
              value={currentStep}
              onChange={(e) => onSeek(Number(e.target.value))}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer outline-none transition-all ${
                isSketch
                  ? 'bg-[#ebdbb2] accent-[#d65d0e]'
                  : 'bg-[#1e293b] accent-cyan-400'
              }`}
            />
          </div>

          <div
            className={`hidden sm:block text-[11px] font-mono px-2 py-0.5 rounded ${
              isSketch ? 'bg-[#ebdbb2] text-[#3c3836]' : 'bg-[#192338] text-slate-400'
            }`}
          >
            {Math.round((currentStep / Math.max(1, totalSteps)) * 100)}%
          </div>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Jump to Start */}
          <button
            onClick={onFirstStep}
            disabled={currentStep <= 1}
            title="First Step (Home)"
            className={`p-2 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
              isSketch
                ? 'hover:bg-[#ebdbb2] text-[#3c3836]'
                : 'hover:bg-[#1f2b42] text-slate-300'
            }`}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Previous Step */}
          <button
            onClick={onPrevStep}
            disabled={currentStep <= 1}
            title="Step Back (Left Arrow)"
            className={`p-2 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
              isSketch
                ? 'hover:bg-[#ebdbb2] text-[#3c3836]'
                : 'hover:bg-[#1f2b42] text-slate-300'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            className={`flex items-center justify-center w-11 h-11 rounded-full font-bold transition-transform active:scale-95 shadow-md ${
              isSketch
                ? 'bg-[#d65d0e] hover:bg-[#af4707] text-white sketch-border-subtle'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Next Step */}
          <button
            onClick={onNextStep}
            disabled={currentStep >= totalSteps}
            title="Step Forward (Right Arrow)"
            className={`p-2 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
              isSketch
                ? 'hover:bg-[#ebdbb2] text-[#3c3836]'
                : 'hover:bg-[#1f2b42] text-slate-300'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Jump to End */}
          <button
            onClick={onLastStep}
            disabled={currentStep >= totalSteps}
            title="Last Step (End)"
            className={`p-2 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
              isSketch
                ? 'hover:bg-[#ebdbb2] text-[#3c3836]'
                : 'hover:bg-[#1f2b42] text-slate-300'
            }`}
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls & Hotkey Hints */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 opacity-60 hidden sm:inline" />
            <div
              className={`flex items-center p-0.5 rounded-md ${
                isSketch ? 'bg-[#ebdbb2]' : 'bg-[#151c2d] border border-[#232f48]'
              }`}
            >
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                    speed === s
                      ? isSketch
                        ? 'bg-[#d65d0e] text-white font-bold'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : isSketch
                        ? 'text-[#3c3836] hover:bg-[#d5c4a1]'
                        : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-[11px] opacity-50 font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">Space</kbd>
            <span>Play</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">←/→</kbd>
            <span>Step</span>
          </div>
        </div>
      </div>
    </div>
  );
};
