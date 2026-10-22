import React from 'react';
import { 
  Code2, 
  Sliders, 
  ListOrdered, 
  ArrowRight,
  Binary,
  Shuffle
} from 'lucide-react';
import type { ThemeMode, TraceStep, AlgorithmPreset, Language } from '../types';
import { getPresetVariants } from '../algorithms/presets';
import { getLocalizedText } from '../i18n/translations';

interface RightPanelsProps {
  theme: ThemeMode;
  preset: AlgorithmPreset;
  step: TraceStep;
  activeLine: number;
  inputStr: string;
  onChangeInput: (newInput: string) => void;
  language: Language;
}

const DATA_PRESETS = [
  { label: 'Standard', value: '(1, 2.2), (2, 2.8), (3, 4.5), (4, 4.9), (5, 6.2)' },
  { label: 'Noisy', value: '(1, 1.4), (2, 3.8), (3, 3.1), (4, 5.9), (5, 5.2)' },
  { label: 'Outlier', value: '(1, 2.0), (2, 2.5), (3, 3.0), (4, 3.5), (5, 8.5)' },
  { label: 'Steep', value: '(1, 0.5), (2, 2.4), (3, 4.2), (4, 6.1), (5, 8.0)' },
];

export const RightPanels: React.FC<RightPanelsProps> = ({
  theme,
  preset,
  step,
  activeLine,
  inputStr,
  onChangeInput,
  language,
}) => {
  const isDark = theme === 'studio';
  const t = getLocalizedText(language);
  const lines = preset.code.split('\n');
  const variants = getPresetVariants(preset, language) || DATA_PRESETS;
  // Generate random data
  const handleRandomize = () => {
    if (preset.visualType === 'regression-plot') {
      const randomPoints = [1, 2, 3, 4, 5].map((x) => {
        const y = Number((x * (0.8 + Math.random() * 0.8) + (Math.random() * 2)).toFixed(1));
        return `(${x}, ${y})`;
      });
      onChangeInput(randomPoints.join(', '));
    } else {
      const randomArr = Array.from({ length: 5 }, () => Math.floor(Math.random() * 50) + 1);
      onChangeInput(randomArr.join(', '));
    }
  };

  return (
    <div className="w-80 lg:w-96 max-w-full shrink-0 h-full overflow-y-auto p-3 space-y-3 flex flex-col select-none border-l border-inherit">
      {/* ========================================= */}
      {/* CARD 1: CODE PANE                        */}
      {/* ========================================= */}
      <div
        className={`rounded-2xl border flex flex-col overflow-hidden shadow-xs transition-colors ${
          isDark
            ? 'bg-[#111827] border-[#1e293b] text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div
          className={`px-3.5 py-2 border-b flex items-center justify-between text-xs font-semibold ${
            isDark ? 'border-slate-800 bg-[#0d131f]' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            <span className="font-bold">{t.code}</span>
          </div>
          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
              isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
            }`}
          >
            Python
          </span>
        </div>

        <div className="p-2 font-mono text-xs leading-relaxed max-h-56 overflow-y-auto overflow-x-auto">
          {lines.map((lineText, idx) => {
            const lineNum = idx + 1;
            const isActive = lineNum === activeLine;

            return (
              <div
                key={idx}
                className={`flex items-center py-0.5 px-2 rounded-lg transition-colors whitespace-pre ${
                  isActive
                    ? isDark
                      ? 'bg-blue-950/70 text-cyan-300 font-semibold border-l-2 border-cyan-400 shadow-xs'
                      : 'bg-blue-50 text-blue-900 font-semibold border-l-2 border-blue-600 shadow-xs'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                <span className="w-6 text-right pr-2 select-none opacity-40 text-[10px] shrink-0">
                  {lineNum}
                </span>
                <span>{lineText || ' '}</span>
                {isActive && (
                  <ArrowRight className="w-3 h-3 ml-2 text-blue-500 dark:text-cyan-400 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================= */}
      {/* CARD 2: INPUTS & PARAMETERS               */}
      {/* ========================================= */}
      <div
        className={`rounded-2xl border p-3.5 space-y-3 shadow-xs transition-colors ${
          isDark
            ? 'bg-[#111827] border-[#1e293b] text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.inputs}</span>
          </div>
          <button
            onClick={handleRandomize}
            title="Randomize data"
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Variant Presets */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-1.5">
            {t.presetVariant}
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {variants.map((p) => {
              const isSelected = inputStr.trim().replace(/\s+/g, '') === p.value.trim().replace(/\s+/g, '');
              return (
                <button
                  key={p.label}
                  onClick={() => onChangeInput(p.value)}
                  className={`px-2 py-1.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                    isSelected
                      ? isDark
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-700 shadow-xs'
                        : 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : isDark
                        ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Data Input Box */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-1">
            {t.dataValues}
          </span>
          <div
            className={`flex items-center px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
              isDark
                ? 'bg-[#090d16] border-[#222f46] text-slate-200'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <input
              type="text"
              value={inputStr}
              onChange={(e) => onChangeInput(e.target.value)}
              className="w-full bg-transparent outline-none font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* CARD 3: STEP LOG & INVARIANTS             */}
      {/* ========================================= */}
      <div
        className={`rounded-2xl border p-3.5 space-y-2.5 shadow-xs transition-colors flex-1 ${
          isDark
            ? 'bg-[#111827] border-[#1e293b] text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-bold border-b pb-2 border-inherit">
          <div className="flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.executionLog}</span>
          </div>
          <span
            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
              isDark
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {step.action}
          </span>
        </div>

        <p className="text-xs leading-relaxed opacity-90 font-medium">
          {step.explanation}
        </p>

        {step.invariant && (
          <div
            className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
              isDark
                ? 'bg-[#0b0f19] border-slate-800 text-indigo-300'
                : 'bg-blue-50/60 border-blue-100 text-blue-900'
            }`}
          >
            <Binary className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>{t.invariant}:</strong> {step.invariant}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
