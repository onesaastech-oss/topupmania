/**
 * Authentication API Service
 */

import { httpClient } from './config.js';

/**
 * Send OTP to phone number
 * @param {string} phone - Phone number (10 digits)
 * @returns {Promise<Object>} Response with success message and phone
 */
export async function sendOtp(phone) {
  try {
    const response = await httpClient.post('/user/send-otp', { phone });
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Verify OTP and login/check if user exists
 * @param {string} phone - Phone number
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} Response with user data and token or registration requirement
 */
export async function verifyOtp(phone, otp) {
  try {
    const response = await httpClient.post('/user/verify-otp', { phone, otp });
    
    // Check if registration is required
    if (response.requiresRegistration) {
      return {
        success: true,
        data: response,
        requiresRegistration: true,
        phone: response.phone,
        message: response.message,
      };
    }
    
    // Store token if login successful (existing user)
    if (response.token) {
      httpClient.setToken(response.token);
      
      // Store user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(response.user));
        localStorage.setItem('isNewUser', response.isNewUser?.toString() || 'false');
      }
    }
    
    return {
      success: true,
      data: response,
      isNewUser: response.isNewUser || false,
      requiresRegistration: false,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Complete user registration
 * @param {Object} registrationData - User registration data
 * @param {string} registrationData.name - Full name
 * @param {string} registrationData.phone - Phone number
 * @param {string} registrationData.email - Email address
 * @param {string} registrationData.password - Password
 * @returns {Promise<Object>} Response with user data and token
 */
export async function completeRegistration(registrationData) {
  try {
    const response = await httpClient.post('/user/complete-registration', registrationData);
    
    // Store token and user data
    if (response.token) {
      httpClient.setToken(response.token);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(response.user));
        localStorage.setItem('isNewUser', response.isNewUser.toString());
      }
    }
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Logout user
 */
export function logout() {
  httpClient.removeToken();
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userData');
    localStorage.removeItem('isNewUser');
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export function isAuthenticated() {
  return !!httpClient.getToken();
}

/**
 * Get current user data
 * @returns {Object|null} User data or null
 */
export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
}

/**
 * Get authentication token
 * @returns {string|null} Auth token or null
 */
export function getAuthToken() {
  return httpClient.getToken();
}

/**
 * Fetch current user profile data
 * @returns {Promise<Object>} Response with user profile data
 */
export async function fetchUserProfile() {
  try {
    const response = await httpClient.get('/user/me');
    
    // Update stored user data with fresh profile data
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify(response));
    }
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
