import React from 'react';
import { SupportedLanguage } from '../../shared/types';
import { SUPPORTED_LANGUAGES } from '../../shared/schemas';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onSelect: (lang: SupportedLanguage) => void;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelect,
  compact = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      {!compact && (
        <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
          Language:
        </span>
      )}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelect(lang.code)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-white text-indigo-700 font-bold border border-slate-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
              title={`${lang.label} (${lang.native})`}
            >
              <span>{lang.native}</span>
              {!compact && <span className="ml-1 text-[10px] text-slate-400 uppercase">{lang.code}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
