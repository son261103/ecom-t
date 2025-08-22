// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Phone number validation (Vietnamese format)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(0|\+84)[3-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Name validation
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 255;
};

// Price validation
export const isValidPrice = (price: number): boolean => {
  return price > 0 && price <= 999999999;
};

// Quantity validation
export const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0 && quantity <= 9999;
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Image URL validation
export const isValidImageUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const lowercaseUrl = url.toLowerCase();
  
  return imageExtensions.some(ext => lowercaseUrl.includes(ext)) || 
         lowercaseUrl.includes('cloudinary') || 
         lowercaseUrl.includes('imgur') ||
         lowercaseUrl.includes('unsplash');
};

// Vietnamese postal code validation
export const isValidPostalCode = (code: string): boolean => {
  const postalCodeRegex = /^\d{5,6}$/;
  return postalCodeRegex.test(code);
};

// Credit card validation (basic Luhn algorithm)
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (!/^\d+$/.test(cleaned) || cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// File validation
export const isValidFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const isValidImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return isValidFileType(file, allowedTypes) && isValidFileSize(file, 5); // 5MB max
};

// Form validation helpers
export const validateRequired = (value: any): string | undefined => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return 'Trường này là bắt buộc';
  }
  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  if (!email) return 'Email là bắt buộc';
  if (!isValidEmail(email)) return 'Email không hợp lệ';
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Mật khẩu là bắt buộc';
  if (!isValidPassword(password)) return 'Mật khẩu phải có ít nhất 6 ký tự';
  return undefined;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) return 'Xác nhận mật khẩu là bắt buộc';
  if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp';
  return undefined;
};

export const validateName = (name: string): string | undefined => {
  if (!name) return 'Tên là bắt buộc';
  if (!isValidName(name)) return 'Tên phải có từ 2 đến 255 ký tự';
  return undefined;
};

export const validatePhoneNumber = (phone: string): string | undefined => {
  if (!phone) return 'Số điện thoại là bắt buộc';
  if (!isValidPhoneNumber(phone)) return 'Số điện thoại không hợp lệ';
  return undefined;
};

export const validatePrice = (price: number): string | undefined => {
  if (price === undefined || price === null) return 'Giá là bắt buộc';
  if (!isValidPrice(price)) return 'Giá phải lớn hơn 0 và nhỏ hơn 999,999,999';
  return undefined;
};

export const validateQuantity = (quantity: number): string | undefined => {
  if (quantity === undefined || quantity === null) return 'Số lượng là bắt buộc';
  if (!isValidQuantity(quantity)) return 'Số lượng phải là số nguyên dương và nhỏ hơn 10,000';
  return undefined;
};

// Complex validation
export const validateForm = (data: any, rules: { [key: string]: (value: any) => string | undefined }): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  
  Object.keys(rules).forEach(field => {
    const error = rules[field](data[field]);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
};
