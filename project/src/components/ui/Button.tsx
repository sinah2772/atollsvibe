import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'add' | 'edit' | 'delete';
  children: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  language?: 'en' | 'dv';
}

const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  loading = false,
  fullWidth = false,
  language = 'en',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
    text-sm font-medium transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    ${language === 'dv' ? 'thaana-waheed' : ''}
  `;
  
  const variants = {
    add: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
    edit: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    delete: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-red-600',
  };

  const icons = {
    add: <Plus size={16} className={language === 'dv' ? 'ml-2' : 'mr-2'} />,
    edit: <Pencil size={16} className={language === 'dv' ? 'ml-2' : 'mr-2'} />,
    delete: <Trash2 size={16} className={language === 'dv' ? 'ml-2' : 'mr-2'} />,
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'delete') {
      const confirmed = window.confirm(
        language === 'dv' 
          ? 'މި އައިޓަމް ޑިލީޓްކުރަން ބޭނުންތޯ؟' 
          : 'Are you sure you want to delete this item?'
      );
      if (!confirmed) {
        e.preventDefault();
        return;
      }
    }
    onClick?.(e);
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={handleClick}
      dir={language === 'dv' ? 'rtl' : 'ltr'}
      {...props}
    >
      {language === 'dv' ? (
        <>
          {children}
          {icons[variant]}
        </>
      ) : (
        <>
          {icons[variant]}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;