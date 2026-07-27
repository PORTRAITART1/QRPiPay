/**
 * Premium Input Component - Navy + Cyan Harmony
 */

import React from 'react';
import './InputPremium.css';

export interface InputPremiumProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const InputPremium = React.forwardRef<HTMLInputElement, InputPremiumProps>(
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
      <div className={`input-premium-wrapper input-premium-size-${size}`}>
        {label && (
          <label className="input-premium-label">
            {label}
            {props.required && <span className="input-premium-required">*</span>}
          </label>
        )}

        <div className="input-premium-container">
          {icon && <span className="input-premium-icon">{icon}</span>}
          <input
            ref={ref}
            className={`
              input-premium
              ${error ? 'input-premium-error' : ''}
              ${icon ? 'input-premium-with-icon' : ''}
              ${className}
            `.trim()}
            disabled={disabled}
            {...props}
          />
        </div>

        {error && <span className="input-premium-error-message">{error}</span>}
        {hint && !error && <span className="input-premium-hint">{hint}</span>}
      </div>
    );
  }
);

InputPremium.displayName = 'InputPremium';

export default InputPremium;
