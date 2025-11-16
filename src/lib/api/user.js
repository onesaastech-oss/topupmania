/**
 * User API functions
 */

import { httpClient } from './config.js';

/**
 * Get current user profile
 */
export const getUserProfile = async () => {
  try {
    const response = await httpClient.get('/user/me');
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await httpClient.put('/user/profile', userData);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (imageFile) => {
  try {
    // Validate the image file
    if (!imageFile || !(imageFile instanceof File)) {
      throw new Error('Invalid image file provided');
    }
    
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Don't set Content-Type header manually for FormData
    // The browser will set it automatically with the correct boundary
    const response = await httpClient.post('/user/profile-picture', formData);
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
