import React from 'react';

interface ButtonGroupProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  spacing?: 'tight' | 'normal' | 'wide';
  className?: string;
  language?: 'en' | 'dv';
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  align = 'left',
  spacing = 'normal',
  className = '',
  language = 'en'
}) => {
  const alignments = {
    left: language === 'dv' ? 'justify-end' : 'justify-start',
    center: 'justify-center',
    right: language === 'dv' ? 'justify-start' : 'justify-end',
  };

  const spacings = {
    tight: 'gap-2',
    normal: 'gap-4',
    wide: 'gap-6',
  };

  return (
    <div 
      className={`flex flex-wrap items-center ${alignments[align]} ${spacings[spacing]} ${className}`}
      role="group"
      dir={language === 'dv' ? 'rtl' : 'ltr'}
    >
      {children}
    </div>
  );
};

export default ButtonGroup;