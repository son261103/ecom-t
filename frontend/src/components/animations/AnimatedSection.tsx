import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'bounceIn';
  delay?: number;
  duration?: number;
  once?: boolean;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  once = true,
}) => {
  const variants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    },
    fadeInDown: {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
    },
    slideInLeft: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    },
    slideInRight: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    bounceIn: {
      initial: { opacity: 0, scale: 0.3 },
      animate: {
        opacity: 1,
        scale: 1,
      },
    },
  };

  const selectedVariant = variants[animation];

  return (
    <motion.div
      className={className}
      initial={selectedVariant.initial}
      whileInView={selectedVariant.animate}
      viewport={{ once, margin: "-100px" }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
