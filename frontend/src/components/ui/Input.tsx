import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const inputClasses = `
    block w-full rounded-lg border px-3 py-2 text-sm placeholder-secondary-400 
    focus:outline-none focus:ring-1 transition-colors duration-200
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
    }
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${className}
  `;
  
  const containerClasses = `
    ${fullWidth ? 'w-full' : ''}
  `;
  
  return (
    <div className={containerClasses}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`
            absolute inset-y-0 flex items-center pointer-events-none z-10
            ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'}
          `}>
            <span className={`text-secondary-400 ${error ? 'text-red-400' : ''}`}>
              {icon}
            </span>
          </div>
        )}
        
        <motion.input
          ref={ref}
          className={inputClasses}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...(props as any)}
        />
      </div>
      
      {(error || helperText) && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-secondary-500'}`}
        >
          {error || helperText}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
