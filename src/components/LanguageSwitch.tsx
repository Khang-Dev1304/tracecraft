import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import type { Language, ThemeMode } from '../types';

interface LanguageSwitchProps {
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  theme: ThemeMode;
}

export const LanguageSwitch: React.FC<LanguageSwitchProps> = ({
  language,
  onSelectLanguage,
  theme,
}) => {
  const isDark = theme === 'studio';
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const current = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative inline-block text-left select-none z-30">
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
          isDark
            ? 'bg-[#151c2d] border-[#222f46] text-slate-200 hover:border-cyan-500/50'
            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
        <span className="mr-0.5">{current.flag}</span>
        <span className="font-bold">{current.label}</span>
        <ChevronDown className="w-3 h-3 opacity-50 ml-0.5" />
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setDropdownOpen(false)}
          />
          <div
            className={`absolute right-0 mt-1.5 w-36 rounded-2xl border shadow-lg py-1 z-40 transition-all ${
              isDark
                ? 'bg-[#111827] border-[#1e293b] text-slate-200'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => {
                  onSelectLanguage(item.code);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between font-medium transition-colors ${
                  language === item.code
                    ? isDark
                      ? 'bg-cyan-950/60 text-cyan-300 font-bold'
                      : 'bg-blue-50 text-blue-700 font-bold'
                    : isDark
                      ? 'hover:bg-slate-800'
                      : 'hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </div>
                {language === item.code && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
