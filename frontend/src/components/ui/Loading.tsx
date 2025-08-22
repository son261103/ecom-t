import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  overlay = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };
  
  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={`${sizeClasses[size]} text-primary-600`} />
      </motion.div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${textSizeClasses[size]} text-secondary-600 font-medium`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-white flex items-center justify-center z-50"
      >
        <LoadingContent />
      </motion.div>
    );
  }
  
  if (overlay) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10"
      >
        <LoadingContent />
      </motion.div>
    );
  }
  
  return <LoadingContent />;
};

// Skeleton loading component
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  rounded = false,
}) => {
  return (
    <motion.div
      className={`
        bg-secondary-200 animate-pulse
        ${rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
      style={{ width, height }}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    />
  );
};

// Loading dots component
export const LoadingDots: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };
  
  const dotSize = dotSizes[size];
  
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${dotSize} bg-primary-600 rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default Loading;
