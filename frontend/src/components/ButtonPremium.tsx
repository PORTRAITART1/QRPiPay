/**
 * Premium Button Component - Navy + Cyan Harmony
 * Smooth animations, premium styling
 */

import React from 'react';
import './ButtonPremium.css';

export interface ButtonPremiumProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const ButtonPremium = React.forwardRef<HTMLButtonElement, ButtonPremiumProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
    children,
    className = '',
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          btn-premium
          btn-premium-${variant}
          btn-premium-${size}
          ${fullWidth ? 'btn-premium-full-width' : ''}
          ${loading ? 'btn-premium-loading' : ''}
          ${icon ? 'btn-premium-with-icon' : ''}
          ${className}
        `.trim()}
        {...props}
      >
        {loading && <span className="btn-premium-spinner" />}
        {icon && <span className="btn-premium-icon-el">{icon}</span>}
        <span className={loading ? 'btn-premium-text-hidden' : ''}>
          {children}
        </span>
      </button>
    );
  }
);

ButtonPremium.displayName = 'ButtonPremium';

export default ButtonPremium;
