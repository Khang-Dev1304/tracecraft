import React from 'react';
import { 
  Play, 
  BookOpen, 
  Sun, 
  Moon, 
  Smartphone, 
  Monitor,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import type { ThemeMode, ViewMode, AlgorithmPreset, StudioTab } from '../types';

interface TopBarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  selectedPreset: AlgorithmPreset;
  studioTab: StudioTab;
  onSelectStudioTab: (tab: StudioTab) => void;
  onReset: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  theme,
  onToggleTheme,
  viewMode,
  onToggleViewMode,
  selectedPreset,
  studioTab,
  onSelectStudioTab,
  onReset,
}) => {
  const isDark = theme === 'studio';

  return (
    <header
      className={`h-14 px-4 border-b flex items-center justify-between transition-colors select-none shrink-0 ${
        isDark
          ? 'bg-[#0b0f19] border-[#1e293b] text-slate-200'
          : 'bg-[#ffffff] border-[#e2e8f0] text-slate-800'
      }`}
    >
      {/* Left Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-medium">
        <span className="opacity-50">{selectedPreset.category}</span>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
          {selectedPreset.title}
        </span>
        <span
          className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${
            isDark
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}
        >
          {selectedPreset.badge}
        </span>
      </div>

      {/* Center Segmented Switcher: [▷ Visualize] [📖 Explain] */}
      <div
        className={`flex items-center p-1 rounded-xl border text-xs font-semibold ${
          isDark
            ? 'bg-[#131b2d] border-[#1f293d]'
            : 'bg-slate-100 border-slate-200'
        }`}
      >
        <button
          onClick={() => onSelectStudioTab('trace')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            studioTab === 'trace'
              ? isDark
                ? 'bg-[#1e293b] text-cyan-300 shadow-sm border border-slate-700'
                : 'bg-white text-slate-900 shadow-sm'
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Visualize</span>
        </button>

        <button
          onClick={() => onSelectStudioTab('theory')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            studioTab === 'theory'
              ? isDark
                ? 'bg-[#1e293b] text-cyan-300 shadow-sm border border-slate-700'
                : 'bg-white text-slate-900 shadow-sm'
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Explain</span>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile Story vs Desktop toggle */}
        <button
          onClick={onToggleViewMode}
          title={viewMode === 'desktop-3pane' ? 'Mobile Story Mode' : 'Desktop 3-Pane'}
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          {viewMode === 'desktop-3pane' ? (
            <Smartphone className="w-4 h-4" />
          ) : (
            <Monitor className="w-4 h-4" />
          )}
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          title="Toggle Light / Dark"
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'hover:bg-slate-800 text-amber-400' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset Step to Beginning"
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
