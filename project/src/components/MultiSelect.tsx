import React, { useState, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';

interface Option {
  id: number;
  name: string;
  name_en: string;
  atoll?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
}

interface MultiSelectProps {
  options: Option[];
  value: number[];
  onChange: (values: number[]) => void;
  language: 'en' | 'dv';
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  language,
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index when search term changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  const filteredOptions = options.filter(option => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = (language === 'dv' ? option.name : option.name_en)
      ?.toLowerCase()
      ?.includes(searchLower);
    const altNameMatch = (language === 'dv' ? option.name_en : option.name)
      ?.toLowerCase()
      ?.includes(searchLower);
    const atollMatch = option.atoll && (
      (language === 'dv' ? option.atoll.name : option.atoll.name_en)
        ?.toLowerCase()
        ?.includes(searchLower)
    );
    return !value.includes(option.id) && (nameMatch || altNameMatch || atollMatch);
  });

  const handleSelect = (optionId: number) => {
    onChange([...value, optionId]);
    setSearchTerm('');
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleRemove = (optionId: number) => {
    onChange(value.filter(id => id !== optionId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key !== 'Backspace') {
      setIsOpen(true);
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].id);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      case 'Backspace':
        if (searchTerm === '' && value.length > 0) {
          e.preventDefault();
          handleRemove(value[value.length - 1]);
        }
        break;
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex]);

  const selectedOptions = options.filter(option => value.includes(option.id));

  return (
    <div ref={wrapperRef} className="relative">
      <div 
        className={`min-h-[38px] w-full rounded-lg border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${
          isOpen ? 'border-blue-500 ring-1 ring-blue-500' : ''
        }`}
        onClick={() => {
          inputRef.current?.focus();
          setIsOpen(true);
        }}
      >
        <div className={`flex flex-wrap gap-2 p-2 ${language === 'dv' ? 'flex-row-reverse' : ''}`}>
          {selectedOptions.map(option => (
            <div 
              key={option.id}
              className={`inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm ${
                language === 'dv' ? 'flex-row-reverse' : ''
              }`}
            >
              <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                {language === 'dv' ? option.name : option.name_en}
                {option.atoll && (
                  <span className="text-blue-500 opacity-75">
                    {' '}
                    ({language === 'dv' ? option.atoll.name : option.atoll.name_en})
                  </span>
                )}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(option.id);
                }}
                className={`hover:text-blue-900 ${language === 'dv' ? 'ml-0 mr-2' : 'ml-2'}`}
                aria-label={language === 'dv' ? `${option.name} އުނިކުރައްވާ` : `Remove ${option.name_en}`}
                title={language === 'dv' ? `${option.name} އުނިކުރައްވާ` : `Remove ${option.name_en}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <div className={`flex-1 flex items-center min-w-[60px] ${
            language === 'dv' ? 'flex-row-reverse' : ''
          }`}>
            <Search size={16} className={`text-gray-400 ${
              language === 'dv' ? 'mr-0 ml-2' : 'ml-0 mr-2'
            }`} />
            <input
              ref={inputRef}
              type="text"
              className={`w-full border-none focus:ring-0 p-0 text-sm ${
                language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed text-right' : ''
              }`}
              placeholder={selectedOptions.length === 0 ? placeholder : ''}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              dir={language === 'dv' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div 
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto"
        >
          {filteredOptions.length > 0 ? (
            <div className="py-1">
              {filteredOptions.map((option, index) => (
                <button
                  key={option.id}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    index === highlightedIndex 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-100'
                  } ${language === 'dv' ? 'thaana-waheed text-right' : ''}`}
                  onClick={() => handleSelect(option.id)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  dir={language === 'dv' ? 'rtl' : 'ltr'}
                >
                  <span>
                    {language === 'dv' ? option.name : option.name_en}
                    {option.atoll && (
                      <span className="text-gray-500">
                        {' '}
                        ({language === 'dv' ? option.atoll.name : option.atoll.name_en})
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className={`p-4 text-sm text-gray-500 text-center ${
              language === 'dv' ? 'thaana-waheed' : ''
            }`}>
              {language === 'dv' ? 'ނަތީޖާއެއް ނުލިބުނު' : 'No results found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};