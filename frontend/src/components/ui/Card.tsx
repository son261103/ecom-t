import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-soft',
    lg: 'shadow-medium',
  };
  
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };
  
  const baseClasses = `
    bg-white border border-secondary-100
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${roundedClasses[rounded]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;
  
  const hoverProps = hover ? {
    whileHover: { 
      scale: 1.02,
      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
    },
    transition: { duration: 0.2 }
  } : {};
  
  return (
    <motion.div
      className={baseClasses}
      onClick={onClick}
      {...hoverProps}
    >
      {children}
    </motion.div>
  );
};

export default Card;
