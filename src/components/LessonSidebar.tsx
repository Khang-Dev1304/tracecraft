import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Layers, 
  Binary, 
  BrainCircuit, 
  Sparkles
} from 'lucide-react';
import type { ThemeMode, AlgorithmPreset, AICategory, Language } from '../types';
import { ALGORITHM_PRESETS, getPresetTitle } from '../algorithms/presets';
import { getLocalizedText } from '../i18n/translations';

interface LessonSidebarProps {
  theme: ThemeMode;
  selectedPreset: AlgorithmPreset;
  onSelectPreset: (preset: AlgorithmPreset) => void;
  language: Language;
  width?: number;
}
export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  theme,
  selectedPreset,
  onSelectPreset,
  language,
  width,
}) => {
  const isDark = theme === 'studio';
  const t = getLocalizedText(language);
  const [search, setSearch] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Classical Machine Learning': true,
    'Deep Learning & Neural Networks': true,
    'Transformers & Modern LLMs': true,
  });

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

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
    const map: Partial<Record<AICategory, AlgorithmPreset[]>> = {};
    for (const p of filteredPresets) {
      if (!map[p.category]) map[p.category] = [];
      map[p.category]?.push(p);
    }
    return map;
  }, [filteredPresets]);

  const getCategoryIcon = (category: AICategory) => {
    switch (category) {
      case 'Classical Machine Learning':
        return <Layers className="w-4 h-4 text-amber-500" />;
      case 'Deep Learning & Neural Networks':
        return <Binary className="w-4 h-4 text-indigo-400" />;
      case 'Transformers & Modern LLMs':
        return <BrainCircuit className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <div
      style={{ width: width ? `${width}px` : undefined }}
      className={`w-full shrink-0 flex flex-col h-full border-r transition-colors select-none ${
        isDark
          ? 'bg-[#0b0f19] border-[#1e293b] text-slate-300'
          : 'bg-[#fafafa] border-[#e2e8f0] text-slate-700'
      }`}
    >
      {/* Search Bar */}
      <div className="p-3 border-b border-inherit">
        <div
          className={`flex items-center px-3 py-1.5 rounded-xl border text-xs transition-colors ${
            isDark
              ? 'bg-[#151c2d] border-[#222f46] text-slate-200 focus-within:border-cyan-500/60'
              : 'bg-white border-slate-200 text-slate-800 focus-within:border-blue-500'
          }`}
        >
          <Search className="w-3.5 h-3.5 opacity-50 mr-2 shrink-0" />
          <input
            type="text"
            placeholder={t.searchLessons}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Accordion Categories & Lessons */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {(Object.entries(grouped) as [AICategory, AlgorithmPreset[]][]).map(
          ([category, presets]) => {
            const isOpen = openCategories[category] !== false;

            return (
              <div key={category} className="space-y-1">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isDark
                      ? 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                      : 'hover:bg-slate-200/60 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getCategoryIcon(category)}
                    <span className="truncate">{t.categories[category] || category}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                  )}
                </button>

                {/* Lesson Items */}
                {isOpen && (
                  <div className="space-y-0.5 pl-2">
                    {presets.map((preset) => {
                      const isSelected = preset.id === selectedPreset.id;

                      return (
                        <button
                          key={preset.id}
                          onClick={() => onSelectPreset(preset)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? isDark
                                ? 'bg-cyan-950/60 text-cyan-300 font-bold border-l-2 border-cyan-400 shadow-sm'
                                : 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600 shadow-xs'
                              : isDark
                                ? 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate">{getPresetTitle(preset, language)}</span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400 shrink-0 ml-1.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
        )}

        {/* Bonus / Roadmap Teasers (Just like VizLearn's locked lessons) */}
        <div className="pt-2 border-t border-inherit/40 space-y-1">
          <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider opacity-50 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{t.upcomingTopics}</span>
          </div>
          {['Diffusion Models & Noise Sampling', 'LoRA Fine-Tuning Internals', 'Vision Transformers (ViT)'].map(
            (locked) => (
              <div
                key={locked}
                className="px-3 py-1.5 text-xs opacity-40 flex items-center justify-between cursor-not-allowed"
              >
                <span className="truncate">{locked}</span>
                <span className="text-[10px] font-mono">{t.soon}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
