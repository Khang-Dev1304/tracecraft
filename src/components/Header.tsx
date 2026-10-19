import React from 'react';
import { 
  Sparkles, 
  Paintbrush, 
  Sliders, 
  Smartphone, 
  Monitor, 
  RotateCcw,
  Cpu,
  ArrowLeft
} from 'lucide-react';
import type { ThemeMode, ViewMode, AlgorithmPreset } from '../types';
import { ALGORITHM_PRESETS } from '../algorithms/presets';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  selectedPreset: AlgorithmPreset;
  onSelectPreset: (preset: AlgorithmPreset) => void;
  inputStr: string;
  onChangeInput: (newInput: string) => void;
  onReset: () => void;
  onBackToCatalog: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  viewMode,
  onToggleViewMode,
  selectedPreset,
  onSelectPreset,
  inputStr,
  onChangeInput,
  onReset,
  onBackToCatalog,
}) => {
  const isSketch = theme === 'sketch';

  return (
    <header
      className={`w-full border-b transition-colors duration-200 select-none ${
        isSketch
          ? 'bg-[#fcfaf5] border-[#3c3836]/30 text-[#282828]'
          : 'bg-[#0b0f19] border-[#222f46] text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-lg font-bold text-lg ${
              isSketch
                ? 'bg-[#d65d0e] text-white sketch-border-subtle font-sketch text-xl'
                : 'bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20'
            }`}
          >
            {isSketch ? '✍' : <Cpu className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-extrabold tracking-tight text-lg ${
                  isSketch ? 'font-sketch text-2xl tracking-normal text-[#282828]' : 'text-white'
                }`}
              >
                TraceCraft
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                  isSketch
                    ? 'bg-[#ebdbb2] text-[#3c3836] border border-[#3c3836]/20'
                    : 'bg-indigo-950/80 text-cyan-400 border border-cyan-800/40'
                }`}
              >
                Next-Gen Viz
              </span>
            </div>
            <p className="text-xs opacity-60 hidden sm:block">
              Interactive Execution Tracing for Algorithms & Modern AI
            </p>
          </div>

          {/* Back to Catalog Button */}
          <button
            onClick={onBackToCatalog}
            title="Back to Topics Catalog"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ml-1 ${
              isSketch
                ? 'bg-[#ebdbb2] border border-[#3c3836]/40 hover:bg-[#d5c4a1] text-[#282828] font-sketch text-sm'
                : 'bg-[#151c2d] border border-[#2a3752] text-slate-200 hover:text-cyan-400 hover:border-cyan-500/50'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Topics</span>
          </button>
        </div>

        {/* Algorithm Picker & Input */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="preset-select"
              className="text-xs font-medium opacity-70 hidden md:inline"
            >
              Topic:
            </label>
            <select
              id="preset-select"
              value={selectedPreset.id}
              onChange={(e) => {
                const found = ALGORITHM_PRESETS.find((p) => p.id === e.target.value);
                if (found) onSelectPreset(found);
              }}
              className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-md cursor-pointer transition-colors outline-none ${
                isSketch
                  ? 'bg-[#fbf7ee] border-2 border-[#3c3836] text-[#282828] font-sketch text-base'
                  : 'bg-[#151c2d] border border-[#2a3752] text-slate-200 hover:border-indigo-500/50 focus:border-indigo-500'
              }`}
            >
              {ALGORITHM_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  [{preset.category}] {preset.title}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Input Tweaker */}
          <div className="hidden lg:flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 opacity-60" />
            <input
              type="text"
              value={inputStr}
              onChange={(e) => onChangeInput(e.target.value)}
              title="Edit comma-separated values to trace custom inputs"
              placeholder="e.g. 5, 2, 8, 1, 4"
              className={`text-xs px-2.5 py-1.5 rounded w-44 font-mono transition-colors outline-none ${
                isSketch
                  ? 'bg-[#fbf7ee] border border-[#3c3836]/40 text-[#282828]'
                  : 'bg-[#151c2d] border border-[#2a3752] text-slate-200 focus:border-cyan-500/70'
              }`}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile Story vs 3-Pane Desktop switch */}
          <button
            onClick={onToggleViewMode}
            title={
              viewMode === 'desktop-3pane'
                ? 'Switch to Mobile Story Card Mode'
                : 'Switch to 3-Pane Studio Layout'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'mobile-story'
                ? isSketch
                  ? 'bg-[#d65d0e] text-white border-2 border-[#3c3836]'
                  : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : isSketch
                  ? 'bg-[#f6f2e9] border border-[#3c3836]/30 hover:bg-[#ebdbb2]'
                  : 'bg-[#151c2d] border border-[#2a3752] text-slate-300 hover:bg-[#1f293d]'
            }`}
          >
            {viewMode === 'mobile-story' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Story Mode (Mobile)</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 opacity-70" />
                <span className="hidden sm:inline">3-Pane Studio</span>
              </>
            )}
          </button>

          {/* Theme Mode Toggle (Sketch Hand-Drawn vs Clean Pro Studio) */}
          <button
            onClick={onToggleTheme}
            title={`Switch to ${isSketch ? 'Clean Pro Studio' : 'Hand-Drawn Sketch'} theme`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              isSketch
                ? 'bg-[#ebdbb2] border-2 border-[#3c3836] text-[#282828] hover:bg-[#d5c4a1] font-sketch text-sm'
                : 'bg-[#151c2d] border border-[#2a3752] text-slate-200 hover:border-cyan-500/50 hover:bg-[#1a233a]'
            }`}
          >
            {isSketch ? (
              <>
                <Paintbrush className="w-3.5 h-3.5 text-[#d65d0e]" />
                <span>Sketch Mode</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Clean Studio</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            title="Reset trace to step 1"
            className={`p-1.5 rounded-md transition-colors ${
              isSketch
                ? 'hover:bg-[#ebdbb2] text-[#3c3836]'
                : 'hover:bg-[#1f293d] text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
