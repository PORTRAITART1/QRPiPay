/**
 * 📋 Card Component - Glassmorphism
 */

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'premium';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'premium',
  hover = true,
}) => {
  const glassClass =
    'glass p-6 rounded-2xl backdrop-blur-xl border border-white/10';

  const premiumClass =
    'card-premium';

  return (
    <motion.div
      className={`${variant === 'glass' ? glassClass : premiumClass} ${className}`}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
