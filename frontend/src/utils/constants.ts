// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART_DATA: 'cart_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  NEWS: '/news',
  NEWS_DETAIL: '/news/:id',
  ABOUT: '/about',
  SEARCH: '/search',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_CREATE: '/admin/products/create',
  ADMIN_PRODUCT_EDIT: '/admin/products/:id/edit',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_BRANDS: '/admin/brands',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
};

// User Roles
export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'COD',
  VNPAY: 'VNPAY',
  SEPAY: 'SEPAY',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Form Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_ADDRESS_LENGTH: 500,
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// Toast Configuration
export const TOAST_CONFIG = {
  DURATION: 4000,
  POSITION: 'top-right' as const,
  SUCCESS_ICON: '✅',
  ERROR_ICON: '❌',
  WARNING_ICON: '⚠️',
  INFO_ICON: 'ℹ️',
};

// Theme Colors (matching Tailwind config)
export const THEME_COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  SECONDARY: {
    50: '#f8fafc',
    500: '#64748b',
    600: '#475569',
    900: '#0f172a',
  },
  SUCCESS: {
    500: '#22c55e',
    600: '#16a34a',
  },
  WARNING: {
    500: '#f59e0b',
    600: '#d97706',
  },
  ERROR: {
    500: '#ef4444',
    600: '#dc2626',
  },
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com',
  INSTAGRAM: 'https://instagram.com',
  TWITTER: 'https://twitter.com',
  YOUTUBE: 'https://youtube.com',
  LINKEDIN: 'https://linkedin.com',
};

// Company Information
export const COMPANY_INFO = {
  NAME: 'Electro',
  DESCRIPTION: 'Cửa hàng điện tử hàng đầu Việt Nam',
  EMAIL: 'contact@electro.com',
  PHONE: '1900 1234',
  ADDRESS: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
  WORKING_HOURS: 'Thứ 2 - Chủ nhật: 8:00 - 22:00',
};

// Feature Flags
export const FEATURES = {
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_CHAT_SUPPORT: false,
  ENABLE_REVIEWS: true,
  ENABLE_COUPONS: false,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập.',
  FORBIDDEN: 'Truy cập bị từ chối.',
  NOT_FOUND: 'Không tìm thấy tài nguyên.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
  UNKNOWN_ERROR: 'Đã xảy ra lỗi không xác định.',
};
