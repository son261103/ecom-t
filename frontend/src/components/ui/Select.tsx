import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  children,
  ...props
}, ref) => {
  const selectClasses = `
    block w-full rounded-lg border px-3 py-2 text-sm placeholder-secondary-400 
    focus:outline-none focus:ring-1 transition-colors duration-200 appearance-none bg-white
    ${
      error 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
        : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
    }
    ${
      className
    }
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
        <motion.select
          ref={ref}
          className={selectClasses}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...(props as any)}
        >
          {children}
        </motion.select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-secondary-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
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

Select.displayName = 'Select';

export default Select;

