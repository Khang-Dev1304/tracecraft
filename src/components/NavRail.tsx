import React from 'react';
import { 
  Home, 
  Layers, 
  Binary, 
  BrainCircuit, 
  Sun, 
  Moon, 
  Code2,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import type { ThemeMode, AICategory } from '../types';

interface NavRailProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onSelectCategory: (cat: AICategory | 'All') => void;
  onGoHome: () => void;
}

export const NavRail: React.FC<NavRailProps> = ({
  theme,
  onToggleTheme,
  sidebarOpen,
  onToggleSidebar,
  onSelectCategory,
  onGoHome,
}) => {
  const isDark = theme === 'studio';

  return (
    <aside
      className={`w-14 shrink-0 flex flex-col items-center justify-between py-4 border-r transition-colors select-none z-30 ${
        isDark
          ? 'bg-[#0f1422] border-[#1e293b] text-slate-400'
          : 'bg-[#ffffff] border-[#e2e8f0] text-slate-500'
      }`}
    >
      {/* Brand Logo & Top Actions */}
      <div className="flex flex-col items-center gap-4">
        {/* Logo */}
        <button
          onClick={onGoHome}
          title="TraceCraft Home Catalog"
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white bg-slate-900 dark:bg-indigo-600 hover:scale-105 transition-transform shadow-sm"
        >
          <span className="font-display font-bold text-lg tracking-tight">T</span>
        </button>

        {/* Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </button>

        <div className="w-6 h-px bg-slate-200 dark:bg-slate-800 my-1" />

        {/* Category Icons */}
        <button
          onClick={onGoHome}
          title="Curriculum Catalog"
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
        </button>

        <button
          onClick={() => onSelectCategory('Classical Machine Learning')}
          title="Classical Machine Learning"
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500 transition-colors"
        >
          <Layers className="w-5 h-5" />
        </button>

        <button
          onClick={() => onSelectCategory('Deep Learning & Neural Networks')}
          title="Deep Learning & Neural Networks"
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-400 transition-colors"
        >
          <Binary className="w-5 h-5" />
        </button>

        <button
          onClick={() => onSelectCategory('Transformers & Modern LLMs')}
          title="Transformers & LLMs"
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-400 transition-colors"
        >
          <BrainCircuit className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Actions: Theme & GitHub */}
      <div className="flex flex-col items-center gap-3">
        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* GitHub link */}
        <a
          href="https://github.com/Khang-Dev1304/tracecraft"
          target="_blank"
          rel="noreferrer"
          title="GitHub Repository"
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Code2 className="w-5 h-5" />
        </a>
      </div>
    </aside>
  );
};
