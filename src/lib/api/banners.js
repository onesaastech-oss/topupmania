/**
 * Banners API Service
 */

import { httpClient } from './config.js';

/**
 * Get all public banners
 * @returns {Promise<Object>} Response with banners array
 */
export async function getPublicBanners() {
  try {
    const response = await httpClient.get('/banners/public/banners');
    
    return {
      success: true,
      data: response,
      banners: response.data || [],
      count: response.data?.length || 0,
    };
  } catch (error) {
    console.error('Failed to fetch banners:', error);
    return {
      success: false,
      error: error.message,
      banners: [],
      count: 0,
    };
  }
}

/**
 * Get banners by type
 * @param {string} type - Banner type (e.g., 'primary banner', 'secondary banner')
 * @returns {Promise<Object>} Response with filtered banners
 */
export async function getBannersByType(type) {
  try {
    const response = await httpClient.get('/banners/public/banners', { type });
    
    return {
      success: true,
      data: response,
      banners: response.data || [],
      count: response.data?.length || 0,
    };
  } catch (error) {
    console.error('Failed to fetch banners by type:', error);
    return {
      success: false,
      error: error.message,
      banners: [],
      count: 0,
    };
  }
}

/**
 * Transform API banner data to frontend format
 * @param {Object} apiBanner - Banner data from API
 * @returns {Object} Transformed banner data for frontend
 */
export function transformBannerData(apiBanner) {
  return {
    id: apiBanner._id,
    title: apiBanner.title,
    url: apiBanner.url,
    image: apiBanner.image,
    type: apiBanner.type,
    priority: apiBanner.priority,
    createdAt: apiBanner.createdAt,
    // Additional frontend fields
    displayTitle: apiBanner.title,
    isClickable: !!apiBanner.url,
    imageUrl: apiBanner.image,
  };
}

/**
 * Transform array of banners from API format to frontend format
 * @param {Array} apiBanners - Array of banners from API
 * @returns {Array} Array of transformed banners
 */
export function transformBannersArray(apiBanners) {
  if (!Array.isArray(apiBanners)) {
    return [];
  }
  
  return apiBanners.map(transformBannerData);
}

/**
 * Get primary banners (sorted by priority)
 * @returns {Promise<Object>} Response with primary banners
 */
export async function getPrimaryBanners() {
  try {
    const response = await getBannersByType('primary banner');
    
    if (response.success) {
      // Sort by priority (ascending)
      const sortedBanners = response.banners.sort((a, b) => a.priority - b.priority);
      return {
        ...response,
        banners: sortedBanners,
      };
    }
    
    return response;
  } catch (error) {
    console.error('Failed to fetch primary banners:', error);
    return {
      success: false,
      error: error.message,
      banners: [],
      count: 0,
    };
  }
}

/**
 * Get secondary banners (sorted by priority)
 * @returns {Promise<Object>} Response with secondary banners
 */
export async function getSecondaryBanners() {
  try {
    const response = await getBannersByType('secondary banner');
    
    if (response.success) {
      // Sort by priority (ascending)
      const sortedBanners = response.banners.sort((a, b) => a.priority - b.priority);
      return {
        ...response,
        banners: sortedBanners,
      };
    }
    
    return response;
  } catch (error) {
    console.error('Failed to fetch secondary banners:', error);
    return {
      success: false,
      error: error.message,
      banners: [],
      count: 0,
    };
  }
}
