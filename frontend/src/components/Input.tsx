/**
 * 📱 Input Component - Premium styled
 */

import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  className = '',
  icon,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-pi-gray-700 dark:text-pi-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`input-premium ${error ? 'border-red-500' : ''} ${className}`}
        />
        {icon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-pi-gray-400">
            {icon}
          </span>
        )}
      </div>
      {error && (
        <span className="text-xs font-medium text-red-500">{error}</span>
      )}
    </div>
  );
};
