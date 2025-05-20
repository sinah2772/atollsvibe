import React, { useEffect, useState } from 'react';
import { MultiSelect } from './MultiSelect';
import { useIslands } from '../hooks/useIslands';

interface IslandsSelectProps {
  atollIds?: number[];
  value: number[];
  onChange: (values: number[]) => void;
  language?: 'en' | 'dv';
  placeholder?: string;
  className?: string;
}

export const IslandsSelect: React.FC<IslandsSelectProps> = ({
  atollIds,
  value,
  onChange,
  language = 'dv',
  placeholder,
  className
}) => {
  const { islands, loading, error } = useIslands(atollIds);
  const [filteredIslands, setFilteredIslands] = useState(islands || []);

  // Update filtered islands when atoll selection changes
  useEffect(() => {
    if (islands) {
      // Keep any selected islands that are still valid after atoll selection changes
      const validSelectedIslands = value.filter(id => 
        islands.some(island => island.id === id)
      );
      
      // If some selected islands are no longer valid, update the selection
      if (validSelectedIslands.length !== value.length) {
        onChange(validSelectedIslands);
      }
      
      setFilteredIslands(islands);
    }
  }, [islands, value, onChange]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-[38px] bg-gray-200 rounded-lg w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 text-sm ${className}`}>
        {language === 'dv' ? 'މައްސަލައެއް ދިމާވެއްޖެ' : 'Failed to load islands'}
      </div>
    );
  }

  // Filter and map islands to match MultiSelect option format
  const options = filteredIslands.map(island => ({
    id: island.id,
    name: island.name,
    name_en: island.name_en,
    atoll: island.atoll
  })) || [];

  return (
    <div className={className}>
      <MultiSelect
        options={options}
        value={value}
        onChange={onChange}
        language={language}
        placeholder={placeholder || (language === 'dv' ? 'ރަށްތައް އިޚްތިޔާރު ކުރައްވާ' : 'Select islands')}
      />
    </div>
  );
};