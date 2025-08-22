export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SystemInfo {
  message: string;
  timestamp: string;
  swaggerUrl: string;
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: NavItem[];
  requireAuth?: boolean;
  roles?: string[];
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

// Animation types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
}

export interface MotionVariants {
  initial: any;
  animate: any;
  exit?: any;
  transition?: any;
}
