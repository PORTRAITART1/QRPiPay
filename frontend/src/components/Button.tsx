/**
 * 🔘 Premium Button Component
 * Styles Stripe/Apple/Revolut
 */

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  className = '',
  icon,
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3.5 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  const variantClasses = {
    primary:
      'btn-primary hover:shadow-[0_0_40px_rgba(107,15,185,0.5)] hover:scale-105 active:scale-95',
    secondary:
      'btn-secondary hover:bg-pi-purple-50 dark:hover:bg-pi-gray-700',
    ghost: 'btn-ghost hover:bg-pi-gray-100 dark:hover:bg-pi-gray-800',
  };

  return (
    <motion.button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {loading ? (
        <svg
          className="animate-spin w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="4" />
          <path d="M4 12a8 8 0 0 1 8-8" strokeWidth="4" />
        </svg>
      ) : (
        icon
      )}
      {children}
    </motion.button>
  );
};
