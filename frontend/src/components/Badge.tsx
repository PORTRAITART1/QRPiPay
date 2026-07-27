/**
 * Badge Component - Design System
 * Status and category badges
 */

import React from 'react';
import './Badge.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    variant = 'default',
    size = 'md',
    icon,
    dismissible = false,
    onDismiss,
    className = '',
    children,
    ...props
  }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          badge
          badge-${variant}
          badge-${size}
          ${className}
        `.trim()}
        {...props}
      >
        {icon && <span className="badge-icon">{icon}</span>}
        <span className="badge-text">{children}</span>
        {dismissible && (
          <button
            className="badge-dismiss"
            onClick={onDismiss}
            aria-label="Dismiss"
            type="button"
          >
            âœ•
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
