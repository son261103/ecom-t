// Currency formatting
export const formatCurrency = (amount: number, currency: string = 'VND'): string => {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Number formatting
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

// Date formatting
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'long':
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    case 'time':
      return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    default:
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(dateObj);
  }
};

// Relative time formatting
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Vừa xong';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ngày trước`;
  } else {
    return formatDate(dateObj);
  }
};

// Text formatting
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Phone number formatting
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Vietnamese phone numbers
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  } else if (cleaned.length === 11 && cleaned.startsWith('84')) {
    return '+84 ' + cleaned.substring(2).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phone;
};

// Percentage formatting
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Order status formatting
export const formatOrderStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'PENDING': 'Chờ xử lý',
    'PROCESSING': 'Đang xử lý',
    'COMPLETED': 'Hoàn thành',
    'CANCELLED': 'Đã hủy',
  };
  
  return statusMap[status] || status;
};

// Payment status formatting
export const formatPaymentStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'PENDING': 'Chờ thanh toán',
    'PAID': 'Đã thanh toán',
    'FAILED': 'Thanh toán thất bại',
    'REFUNDED': 'Đã hoàn tiền',
  };
  
  return statusMap[status] || status;
};

// Payment method formatting
export const formatPaymentMethod = (method: string): string => {
  const methodMap: { [key: string]: string } = {
    'COD': 'Thanh toán khi nhận hàng',
    'VNPAY': 'VNPay',
    'SEPAY': 'SePay',
  };
  
  return methodMap[method] || method;
};
