import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Layers, 
  Binary, 
  BrainCircuit, 
  ChevronRight, 
  BookOpen, 
  ExternalLink 
} from 'lucide-react';
import type { 
  ThemeMode, 
  AlgorithmPreset, 
  AlgorithmCategory 
} from '../types';
import { ALGORITHM_PRESETS } from '../algorithms/presets';

interface CurriculumSidebarProps {
  theme: ThemeMode;
  isOpen: boolean;
  onClose: () => void;
  selectedPreset: AlgorithmPreset;
  onSelectPreset: (preset: AlgorithmPreset) => void;
  onViewFullCatalog: () => void;
}

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({
  theme,
  isOpen,
  onClose,
  selectedPreset,
  onSelectPreset,
  onViewFullCatalog,
}) => {
  const isSketch = theme === 'sketch';
  const [search, setSearch] = useState('');

  // Filter topics
  const filteredPresets = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return ALGORITHM_PRESETS;
    return ALGORITHM_PRESETS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [search]);

  // Group by category
  const grouped = useMemo(() => {
    const map: Partial<Record<AlgorithmCategory, AlgorithmPreset[]>> = {};
    for (const p of filteredPresets) {
      if (!map[p.category]) map[p.category] = [];
      map[p.category]?.push(p);
    }
    return map;
  }, [filteredPresets]);

  const getCategoryIcon = (category: AlgorithmCategory) => {
    switch (category) {
      case 'Foundations & Sorting':
        return <Layers className="w-4 h-4 text-amber-500" />;
      case 'Search & Pointers':
        return <Binary className="w-4 h-4 text-emerald-500" />;
      case 'Modern AI & LLMs':
        return <BrainCircuit className="w-4 h-4 text-cyan-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-indigo-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-80 shadow-2xl flex flex-col border-r transition-all duration-300 select-none ${
        isSketch
          ? 'bg-[#fdfbf7] border-[#3c3836]/40 text-[#282828]'
          : 'bg-[#0d121f] border-[#222f46] text-white'
      }`}
    >
      {/* Sidebar Header */}
      <div
        className={`p-4 border-b flex items-center justify-between ${
          isSketch ? 'border-[#3c3836]/20 bg-[#f6f2e9]' : 'border-[#222f46] bg-[#111828]'
        }`}
      >
        <div className="flex items-center gap-2">
          <BookOpen
            className={`w-4 h-4 ${
              isSketch ? 'text-[#d65d0e]' : 'text-cyan-400'
            }`}
          />
          <h2
            className={`text-sm font-bold ${
              isSketch ? 'font-sketch text-lg' : 'text-slate-100'
            }`}
          >
            Curriculum Topics
          </h2>
        </div>

        <button
          onClick={onClose}
          title="Close Sidebar (Esc)"
          className={`p-1.5 rounded-md transition-colors ${
            isSketch
              ? 'hover:bg-[#ebdbb2] text-[#3c3836]'
              : 'hover:bg-[#1a233a] text-slate-400 hover:text-white'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Search Input */}
      <div className="p-3 border-b border-inherit">
        <div
          className={`flex items-center px-3 py-1.5 rounded-lg border text-xs ${
            isSketch
              ? 'bg-[#fbf7ee] border-[#3c3836]/30'
              : 'bg-[#151c2d] border-[#222f46] text-slate-200'
          }`}
        >
          <Search className="w-3.5 h-3.5 opacity-50 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search curriculum..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none font-mono"
          />
        </div>
      </div>

      {/* Topics List Grouped by Category */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-8 text-xs font-mono opacity-50">
            No topics found.
          </div>
        ) : (
          (Object.entries(grouped) as [AlgorithmCategory, AlgorithmPreset[]][]).map(
            ([category, presets]) => (
              <div key={category} className="space-y-1">
                {/* Category Header */}
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono font-bold uppercase tracking-wider opacity-60">
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                </div>

                {/* Topic Items */}
                <div className="space-y-1">
                  {presets.map((preset) => {
                    const isSelected = preset.id === selectedPreset.id;

                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          onSelectPreset(preset);
                          onClose();
                        }}
                        className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between text-xs transition-all ${
                          isSelected
                            ? isSketch
                              ? 'bg-[#d65d0e] text-white font-bold sketch-border-subtle'
                              : 'bg-indigo-600/30 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                            : isSketch
                              ? 'hover:bg-[#ebdbb2]/60 text-[#282828]'
                              : 'hover:bg-[#151c2d] text-slate-300'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span
                            className={`font-medium ${
                              isSketch && !isSelected ? 'font-sketch text-sm' : ''
                            }`}
                          >
                            {preset.title}
                          </span>
                          <span className="text-[10px] opacity-60 font-mono mt-0.5">
                            {preset.badge} • {preset.difficulty}
                          </span>
                        </div>

                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isSelected
                              ? 'translate-x-0.5 opacity-100'
                              : 'opacity-40 group-hover:opacity-70'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          )
        )}
      </div>

      {/* Sidebar Footer Link */}
      <div
        className={`p-3 border-t text-xs font-mono shrink-0 ${
          isSketch ? 'border-[#3c3836]/20 bg-[#f6f2e9]' : 'border-[#222f46] bg-[#111828]'
        }`}
      >
        <button
          onClick={() => {
            onViewFullCatalog();
            onClose();
          }}
          className={`w-full py-2 px-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors ${
            isSketch
              ? 'bg-[#ebdbb2] hover:bg-[#d5c4a1] text-[#282828] border border-[#3c3836]/30'
              : 'bg-[#151c2d] hover:bg-[#1f293d] text-cyan-400 border border-[#2a3752]'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Full Catalog</span>
        </button>
      </div>
    </aside>
  );
};
