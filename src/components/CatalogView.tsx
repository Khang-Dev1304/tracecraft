import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Play, 
  Clock, 
  Cpu, 
  Binary, 
  Layers, 
  BrainCircuit, 
  ArrowRight
} from 'lucide-react';
import type { 
  ThemeMode, 
  AlgorithmPreset, 
  AlgorithmCategory, 
  DifficultyLevel,
  Language,
  AICategory
} from '../types';
import { 
  ALGORITHM_PRESETS,
  getPresetTitle,
  getPresetSummary,
  getPresetBadge
} from '../algorithms/presets';
import { MathFormula } from './MathFormula';
import { getLocalizedText } from '../i18n/translations';
import { LanguageSwitch } from './LanguageSwitch';

interface CatalogViewProps {
  theme: ThemeMode;
  onSelectAlgorithm: (preset: AlgorithmPreset) => void;
  onToggleTheme: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  theme,
  onSelectAlgorithm,
  onToggleTheme,
  language,
  onSelectLanguage,
}) => {
  const isSketch = theme === 'sketch';
  const t = getLocalizedText(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory | 'All'>('All');

  const categories: (AlgorithmCategory | 'All')[] = [
    'All',
    'Classical Machine Learning',
    'Deep Learning & Neural Networks',
    'Transformers & Modern LLMs',
  ];

  const filteredPresets = useMemo(() => {
    return ALGORITHM_PRESETS.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Group filtered items by category
  const groupedPresets = useMemo(() => {
    const groups: Partial<Record<AlgorithmCategory, AlgorithmPreset[]>> = {};
    for (const preset of filteredPresets) {
      if (!groups[preset.category]) {
        groups[preset.category] = [];
      }
      groups[preset.category]?.push(preset);
    }
    return groups;
  }, [filteredPresets]);

  const getCategoryIcon = (category: AlgorithmCategory) => {
    switch (category) {
      case 'Classical Machine Learning':
        return <Layers className="w-5 h-5 text-amber-500" />;
      case 'Deep Learning & Neural Networks':
        return <Binary className="w-5 h-5 text-indigo-400" />;
      case 'Transformers & Modern LLMs':
        return <BrainCircuit className="w-5 h-5 text-cyan-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getDifficultyBadge = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'Beginner':
        return isSketch
          ? 'bg-[#98971a]/20 text-[#79740e] border border-[#79740e]/40'
          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'Intermediate':
        return isSketch
          ? 'bg-[#fabd2f]/30 text-[#b57614] border border-[#b57614]/40'
          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'Advanced':
        return isSketch
          ? 'bg-[#cc241d]/20 text-[#9d0006] border border-[#9d0006]/40'
          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col select-none transition-colors duration-200 ${
        isSketch
          ? 'bg-sketch-grid text-[#282828] font-sans'
          : 'bg-studio-grid text-slate-100 font-sans'
      }`}
    >
      {/* Top Navbar */}
      <header
        className={`w-full border-b transition-colors ${
          isSketch
            ? 'bg-[#fcfaf5] border-[#3c3836]/30 text-[#282828]'
            : 'bg-[#0b0f19] border-[#222f46] text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
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
                  className={`font-extrabold tracking-tight text-xl ${
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
                  Curriculum
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Top Language Switcher */}
            <LanguageSwitch
              language={language}
              onSelectLanguage={onSelectLanguage}
              theme={theme}
            />

            <button
              onClick={onToggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                isSketch
                  ? 'bg-[#ebdbb2] border-2 border-[#3c3836] text-[#282828] font-sketch text-sm'
                  : 'bg-[#151c2d] border border-[#2a3752] text-slate-200 hover:border-cyan-500/50 hover:bg-[#1a233a]'
              }`}
            >
              {isSketch ? '✍ Sketch Mode' : '💎 Clean Studio'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-6 w-full text-center">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 ${
            isSketch
              ? 'bg-[#ebdbb2] text-[#3c3836] border border-[#3c3836]/30'
              : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.tagline}</span>
        </div>

        <h1
          className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 ${
            isSketch
              ? 'font-sketch text-4xl sm:text-6xl text-[#282828]'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300'
          }`}
        >
          {t.heroTitle}
        </h1>

        <p
          className={`max-w-2xl mx-auto text-sm sm:text-base leading-relaxed opacity-80 ${
            isSketch ? 'font-sketch text-lg sm:text-xl' : 'text-slate-300'
          }`}
        >
          {t.heroSubtitle}
        </p>
        {/* Search & Filter Bar */}
        <div className="max-w-3xl mx-auto mt-8 flex flex-col sm:flex-row items-center gap-3">
          <div
            className={`w-full flex-1 flex items-center px-3.5 py-2.5 rounded-xl border transition-colors ${
              isSketch
                ? 'bg-[#fbf7ee] border-2 border-[#3c3836]'
                : 'bg-[#131b2e] border-[#222f46] text-white focus-within:border-cyan-500/60'
            }`}
          >
            <Search className="w-4 h-4 opacity-50 mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-2 rounded-lg font-mono font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? isSketch
                      ? 'bg-[#d65d0e] text-white font-bold sketch-border-subtle'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : isSketch
                      ? 'bg-[#fbf7ee] text-[#282828] border border-[#3c3836]/30 hover:bg-[#ebdbb2]'
                      : 'bg-[#151c2d] text-slate-400 border border-[#24314c] hover:text-white'
                }`}
              >
                {cat === 'All' ? t.all : t.categories[cat as AICategory] || cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categorized Listings */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 space-y-12">
        {Object.keys(groupedPresets).length === 0 ? (
          <div className="text-center py-16 opacity-60 font-mono text-sm">
            No algorithms match &ldquo;{searchQuery}&rdquo;. Try another search keyword.
          </div>
        ) : (
          (Object.entries(groupedPresets) as [AlgorithmCategory, AlgorithmPreset[]][]).map(
            ([category, presets]) => (
              <section key={category} className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between border-b pb-2.5">
                  <div className="flex items-center gap-2.5">
                    {getCategoryIcon(category)}
                    <h2
                      className={`text-xl sm:text-2xl font-bold tracking-tight ${
                        isSketch ? 'font-sketch text-2xl sm:text-3xl text-[#282828]' : 'text-slate-100'
                      }`}
                    >
                      {category}
                    </h2>
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                        isSketch ? 'bg-[#ebdbb2] text-[#3c3836]' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {presets.length} {presets.length === 1 ? 'topic' : 'topics'}
                    </span>
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => onSelectAlgorithm(preset)}
                      className={`group cursor-pointer rounded-xl p-5 flex flex-col justify-between transition-all duration-200 transform hover:-translate-y-1 ${
                        isSketch
                          ? 'bg-[#fbf7ee] sketch-border hover:shadow-lg'
                          : 'bg-[#111828]/80 hover:bg-[#151d32] border border-[#222f46] hover:border-cyan-500/50 shadow-md hover:shadow-cyan-500/10'
                      }`}
                    >
                      {/* Card Header */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${getDifficultyBadge(
                              preset.difficulty
                            )}`}
                          >
                            {t.difficulties[preset.difficulty] || preset.difficulty}
                          </span>
                          <span
                            className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                              isSketch
                                ? 'bg-[#ebdbb2] text-[#3c3836]'
                                : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/40'
                            }`}
                          >
                            {getPresetBadge(preset, language)}
                          </span>
                        </div>

                        <h3
                          className={`text-lg font-bold group-hover:text-cyan-400 transition-colors ${
                            isSketch
                              ? 'font-sketch text-2xl text-[#282828] group-hover:text-[#d65d0e]'
                              : 'text-white'
                          }`}
                        >
                          {getPresetTitle(preset, language)}
                        </h3>

                        {/* Brief Summary */}
                        <p
                          className={`text-xs mt-2 leading-relaxed opacity-80 line-clamp-2 ${
                            isSketch ? 'font-sketch text-base' : 'text-slate-300'
                          }`}
                        >
                          {getPresetSummary(preset, language)}
                        </p>

                        {/* Formula snippet */}
                        {/* Formula snippet rendered via KaTeX */}
                        {preset.formula && (
                          <div
                            className={`mt-2.5 p-2 rounded overflow-x-auto ${
                              isSketch
                                ? 'bg-[#ebdbb2]/50 text-[#282828] border border-[#3c3836]/20'
                                : 'bg-slate-900/80 text-cyan-300 border border-slate-800'
                            }`}
                          >
                            <MathFormula math={preset.formula} className="text-xs" />
                          </div>
                        )}
                      </div>

                      {/* Card Footer Details */}
                      <div className="mt-5 pt-3 border-t border-slate-700/20 dark:border-slate-800 space-y-3">
                        {/* Complexities */}
                        <div className="flex items-center justify-between text-[11px] font-mono opacity-70">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {preset.timeComplexity}
                          </span>
                          <span>{preset.spaceComplexity}</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {preset.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                                isSketch
                                  ? 'bg-[#ebdbb2]/60 text-[#3c3836]'
                                  : 'bg-slate-800/60 text-slate-400'
                              }`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Launch Action */}
                        <div
                          className={`flex items-center justify-between pt-1 text-xs font-bold transition-colors ${
                            isSketch
                              ? 'text-[#d65d0e] group-hover:underline'
                              : 'text-cyan-400 group-hover:text-cyan-300'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Play className="w-3.5 h-3.5 fill-current" />
                            {t.launchVisualizer}
                          </span>
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          )
        )}
      </main>

      {/* Footer */}
      <footer
        className={`w-full py-6 mt-12 border-t text-center text-xs font-mono transition-colors ${
          isSketch ? 'border-[#3c3836]/20 text-[#7c6f64]' : 'border-slate-800 text-slate-500'
        }`}
      >
        <p>
          TraceCraft — Open source interactive algorithm and AI execution tracer.
        </p>
      </footer>
    </div>
  );
};
