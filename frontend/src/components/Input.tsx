/**
 * Input Component - Design System
 * Text input, textarea, select with design tokens
 */

import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    hint,
    icon,
    size = 'md',
    disabled = false,
    className = '',
    ...props
  }, ref) => {
    return (
      <div className={`input-wrapper input-size-${size}`}>
        {label && (
          <label className="input-label">
            {label}
            {props.required && <span className="input-required">*</span>}
          </label>
        )}
        
        <div className="input-container">
          {icon && <span className="input-icon">{icon}</span>}
          <input
            ref={ref}
            className={`
              input
              ${error ? 'input-error' : ''}
              ${icon ? 'input-with-icon' : ''}
              ${className}
            `.trim()}
            disabled={disabled}
            {...props}
          />
        </div>

        {error && <span className="input-error-message">{error}</span>}
        {hint && !error && <span className="input-hint">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({
    label,
    error,
    hint,
    size = 'md',
    disabled = false,
    className = '',
    ...props
  }, ref) => {
    return (
      <div className={`input-wrapper input-size-${size}`}>
        {label && (
          <label className="input-label">
            {label}
            {props.required && <span className="input-required">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={`
            textarea
            ${error ? 'input-error' : ''}
            ${className}
          `.trim()}
          disabled={disabled}
          {...props}
        />

        {error && <span className="input-error-message">{error}</span>}
        {hint && !error && <span className="input-hint">{hint}</span>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    label,
    error,
    hint,
    size = 'md',
    disabled = false,
    options,
    className = '',
    ...props
  }, ref) => {
    return (
      <div className={`input-wrapper input-size-${size}`}>
        {label && (
          <label className="input-label">
            {label}
            {props.required && <span className="input-required">*</span>}
          </label>
        )}
        
        <select
          ref={ref}
          className={`
            select
            ${error ? 'input-error' : ''}
            ${className}
          `.trim()}
          disabled={disabled}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && <span className="input-error-message">{error}</span>}
        {hint && !error && <span className="input-hint">{hint}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Input;
