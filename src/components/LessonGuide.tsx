import React from 'react';
import { 
  BookOpen, 
  Play, 
  Lightbulb, 
  Code2 
} from 'lucide-react';
import type { ThemeMode, AlgorithmPreset } from '../types';
import { MathFormula } from './MathFormula';

interface LessonGuideProps {
  theme: ThemeMode;
  preset: AlgorithmPreset;
  onLaunchVisualizer: () => void;
}

export const LessonGuide: React.FC<LessonGuideProps> = ({
  theme,
  preset,
  onLaunchVisualizer,
}) => {
  const isSketch = theme === 'sketch';

  return (
    <div
      className={`w-full max-w-4xl mx-auto p-4 sm:p-6 overflow-y-auto select-none transition-colors ${
        isSketch ? 'text-[#282828]' : 'text-slate-100'
      }`}
    >
      {/* Lesson Header Banner */}
      <div
        className={`p-6 rounded-2xl mb-6 shadow-sm border transition-colors ${
          isSketch
            ? 'bg-[#fbf7ee] sketch-border'
            : 'bg-gradient-to-br from-[#111828] to-[#162035] border-[#222f46]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono uppercase px-2.5 py-1 rounded-full font-bold ${
                isSketch
                  ? 'bg-[#d65d0e] text-white'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {preset.category}
            </span>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded font-semibold ${
                isSketch ? 'bg-[#ebdbb2] text-[#3c3836]' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {preset.difficulty}
            </span>
          </div>

          <button
            onClick={onLaunchVisualizer}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              isSketch
                ? 'bg-[#d65d0e] hover:bg-[#af4707] text-white sketch-border-subtle'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold shadow-cyan-500/25'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Interactive Trace</span>
          </button>
        </div>

        <h1
          className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 ${
            isSketch ? 'font-sketch text-3xl sm:text-5xl text-[#282828]' : 'text-white'
          }`}
        >
          {preset.title}
        </h1>

        <p
          className={`text-sm sm:text-base leading-relaxed opacity-85 mb-4 ${
            isSketch ? 'font-sketch text-lg text-[#3c3836]' : 'text-slate-300'
          }`}
        >
          {preset.description}
        </p>

        {/* Mathematical Formula Box */}
        {preset.formula && (
          <div
            className={`p-3.5 rounded-xl border font-mono text-xs sm:text-sm flex items-center justify-between gap-3 ${
              isSketch
                ? 'bg-[#ebdbb2]/40 border-[#3c3836]/30 text-[#282828]'
                : 'bg-slate-950/80 border-cyan-900/60 text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                Formula:
              </span>
              <MathFormula math={preset.formula} className="text-sm font-semibold" />
            </div>
            <span className="text-[11px] opacity-60 hidden sm:inline">
              Complexity: {preset.timeComplexity}
            </span>
          </div>
        )}
      </div>

      {/* Structured Lesson Sections */}
      <div className="space-y-6 mb-8">
        {preset.sections.map((section, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-colors ${
              isSketch
                ? 'bg-[#fbf7ee] sketch-border-subtle'
                : 'bg-[#101625] border-[#222f46]'
            }`}
          >
            <h2
              className={`text-lg font-bold mb-2 flex items-center gap-2 ${
                isSketch ? 'font-sketch text-2xl text-[#282828]' : 'text-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>{section.title}</span>
            </h2>

            <p
              className={`text-sm leading-relaxed opacity-85 mb-3 ${
                isSketch ? 'font-sketch text-base' : 'text-slate-300'
              }`}
            >
              {section.content}
            </p>

            {section.formula && (
              <div
                className={`p-3 rounded-xl overflow-x-auto my-2 border ${
                  isSketch
                    ? 'bg-[#f6f2e9] border-[#3c3836]/20 text-[#282828]'
                    : 'bg-slate-950/80 border-cyan-900/40 text-cyan-200'
                }`}
              >
                <MathFormula math={section.formula} block={true} />
              </div>
            )}
            {section.keyTakeaway && (
              <div
                className={`p-3 rounded-xl flex items-start gap-2.5 text-xs font-medium ${
                  isSketch
                    ? 'bg-[#ebdbb2]/50 text-[#3c3836] border border-[#3c3836]/20'
                    : 'bg-cyan-950/30 text-cyan-200 border border-cyan-800/40'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Key Takeaway:</strong> {section.keyTakeaway}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Authentic Python Implementation */}
      <div
        className={`p-5 rounded-2xl border mb-8 transition-colors ${
          isSketch
            ? 'bg-[#fbf7ee] sketch-border-subtle'
            : 'bg-[#101625] border-[#222f46]'
        }`}
      >
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <div className="flex items-center gap-2 font-bold">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Python Reference Implementation</span>
          </div>
          <span className="opacity-60">NumPy / PyTorch</span>
        </div>

        <pre
          className={`p-4 rounded-xl font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed border ${
            isSketch
              ? 'bg-[#f6f2e9] text-[#282828] border-[#3c3836]/20'
              : 'bg-[#090d16] text-cyan-200 border-[#1c273c]'
          }`}
        >
          {preset.pythonCode}
        </pre>
      </div>

      {/* Bottom Launch Callout */}
      <div className="text-center pt-2 pb-8">
        <button
          onClick={onLaunchVisualizer}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 ${
            isSketch
              ? 'bg-[#d65d0e] hover:bg-[#af4707] text-white sketch-border'
              : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold shadow-cyan-500/30 hover:opacity-90'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Interactive Visualization & Step Debugger</span>
        </button>
      </div>
    </div>
  );
};
