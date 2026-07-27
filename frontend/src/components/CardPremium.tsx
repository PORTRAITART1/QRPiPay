/**
 * Premium Card Component - Navy + Cyan Harmony
 * With glowing borders and smooth animations
 */

import React from 'react';
import './CardPremium.css';

export interface CardPremiumProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'glow';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const CardPremium = React.forwardRef<HTMLDivElement, CardPremiumProps>(
  ({
    variant = 'default',
    padding = 'md',
    className = '',
    children,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          card-premium
          card-premium-${variant}
          card-premium-padding-${padding}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardPremium.displayName = 'CardPremium';

export interface CardHeaderPremiumProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeaderPremium = React.forwardRef<HTMLDivElement, CardHeaderPremiumProps>(
  ({ className = '', children, ...props }, ref) => (
    <div className={`card-premium-header ${className}`.trim()} ref={ref} {...props}>
      {children}
    </div>
  )
);

CardHeaderPremium.displayName = 'CardHeaderPremium';

export interface CardBodyPremiumProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBodyPremium = React.forwardRef<HTMLDivElement, CardBodyPremiumProps>(
  ({ className = '', children, ...props }, ref) => (
    <div className={`card-premium-body ${className}`.trim()} ref={ref} {...props}>
      {children}
    </div>
  )
);

CardBodyPremium.displayName = 'CardBodyPremium';

export interface CardFooterPremiumProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooterPremium = React.forwardRef<HTMLDivElement, CardFooterPremiumProps>(
  ({ className = '', children, ...props }, ref) => (
    <div className={`card-premium-footer ${className}`.trim()} ref={ref} {...props}>
      {children}
    </div>
  )
);

CardFooterPremium.displayName = 'CardFooterPremium';

export default CardPremium;
