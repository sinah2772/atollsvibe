import React from 'react';
import { Plus, Languages } from 'lucide-react';

interface ActionButtonsProps {
  onAdd?: () => void;
  addLabel?: string;
  className?: string;
  language?: 'en' | 'dv';
  onLanguageChange?: () => void;
  showLanguageToggle?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAdd,
  addLabel,
  className = '',
  language = 'en',
  onLanguageChange,
  showLanguageToggle = false,
}) => {
  return (
    <div 
      className={`flex flex-wrap items-center gap-4 ${className}`}
      dir={language === 'dv' ? 'rtl' : 'ltr'}
    >
      {showLanguageToggle && onLanguageChange && (
        <button
          onClick={onLanguageChange}
          className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Languages size={18} className={language === 'dv' ? 'ml-2' : 'mr-2'} />
          <span className={language === 'dv' ? 'thaana-waheed' : ''}>
            {language === 'dv' ? 'English' : 'ދިވެހި'}
          </span>
        </button>
      )}

      {onAdd && (
        <button
          onClick={onAdd}
          className={`
            inline-flex items-center justify-center gap-2 px-4 py-2 
            bg-blue-600 text-white rounded-lg text-sm font-medium 
            hover:bg-blue-700 transition-colors
            ${language === 'dv' ? 'thaana-waheed' : ''}
          `}
        >
          {language === 'dv' ? (
            <>
              <span>{addLabel}</span>
              <Plus size={18} />
            </>
          ) : (
            <>
              <Plus size={18} />
              <span>{addLabel}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;