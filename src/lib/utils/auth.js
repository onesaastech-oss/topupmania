/**
 * Authentication Utilities
 */

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result
 */
export function validatePhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
  
  if (!phone) {
    return {
      isValid: false,
      error: 'Phone number is required',
    };
  }
  
  if (phone.length !== 10) {
    return {
      isValid: false,
      error: 'Phone number must be 10 digits',
    };
  }
  
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      error: 'Please enter a valid Indian mobile number',
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate OTP format
 * @param {string} otp - OTP to validate
 * @returns {Object} Validation result
 */
export function validateOtp(otp) {
  if (!otp) {
    return {
      isValid: false,
      error: 'OTP is required',
    };
  }
  
  if (otp.length !== 6) {
    return {
      isValid: false,
      error: 'OTP must be 6 digits',
    };
  }
  
  if (!/^\d{6}$/.test(otp)) {
    return {
      isValid: false,
      error: 'OTP must contain only numbers',
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate name format
 * @param {string} name - Name to validate
 * @returns {Object} Validation result
 */
export function validateName(name) {
  if (!name) {
    return {
      isValid: false,
      error: 'Name is required',
    };
  }
  
  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: 'Name must be at least 2 characters long',
    };
  }
  
  if (name.trim().length > 50) {
    return {
      isValid: false,
      error: 'Name must be less than 50 characters',
    };
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return {
      isValid: false,
      error: 'Name can only contain letters and spaces',
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate password format
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export function validatePassword(password) {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }
  
  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long',
    };
  }
  
  if (password.length > 128) {
    return {
      isValid: false,
      error: 'Password must be less than 128 characters',
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export function formatPhoneDisplay(phone) {
  if (!phone || phone.length !== 10) return phone;
  
  // Format as: +91 98649 72356
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
}

/**
 * Sanitize phone number (remove all non-digits)
 * @param {string} phone - Phone number to sanitize
 * @returns {string} Sanitized phone number
 */
export function sanitizePhone(phone) {
  return phone.replace(/\D/g, '').slice(0, 10);
}

/**
 * Generate a random string for state management
 * @param {number} length - Length of random string
 * @returns {string} Random string
 */
export function generateRandomString(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Debounce function for API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
