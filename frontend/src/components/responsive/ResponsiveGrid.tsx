import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
}) => {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const getColsClass = () => {
    let classes = 'grid';
    
    if (cols.default) classes += ` grid-cols-${cols.default}`;
    if (cols.sm) classes += ` sm:grid-cols-${cols.sm}`;
    if (cols.md) classes += ` md:grid-cols-${cols.md}`;
    if (cols.lg) classes += ` lg:grid-cols-${cols.lg}`;
    if (cols.xl) classes += ` xl:grid-cols-${cols.xl}`;
    
    return classes;
  };

  return (
    <div className={`${getColsClass()} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;
