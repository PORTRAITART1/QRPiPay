/**
 * Premium Badge Component - Navy + Cyan
 */

import React from 'react';
import './BadgePremium.css';

export interface BadgePremiumProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const BadgePremium = React.forwardRef<HTMLSpanElement, BadgePremiumProps>(
  ({
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    children,
    ...props
  }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          badge-premium
          badge-premium-${variant}
          badge-premium-${size}
          ${className}
        `.trim()}
        {...props}
      >
        {icon && <span className="badge-premium-icon">{icon}</span>}
        <span className="badge-premium-text">{children}</span>
      </span>
    );
  }
);

BadgePremium.displayName = 'BadgePremium';

export default BadgePremium;
