import { httpClient } from './config.js';

/**
 * News API service
 */
export class NewsAPI {
  /**
   * Get all news with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.category - Filter by category
   * @param {string} params.priority - Filter by priority
   * @param {boolean} params.isPinned - Filter by pinned status
   * @returns {Promise<Object>} News data with pagination
   */
  static async getNews(params = {}) {
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.category && { category: params.category }),
        ...(params.priority && { priority: params.priority }),
        ...(params.isPinned !== undefined && { isPinned: params.isPinned }),
      };

      const response = await httpClient.get('/news/list', queryParams);
      return response;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }

  /**
   * Get a single news item by ID
   * @param {string} newsId - News item ID
   * @returns {Promise<Object>} News item data
   */
  static async getNewsById(newsId) {
    try {
      const response = await httpClient.get(`/news/${newsId}`);
      return response;
    } catch (error) {
      console.error('Error fetching news item:', error);
      throw error;
    }
  }

  /**
   * Get news categories
   * @returns {Promise<Array>} List of categories
   */
  static async getCategories() {
    try {
      const response = await httpClient.get('/news/categories');
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Increment view count for a news item
   * @param {string} newsId - News item ID
   * @returns {Promise<Object>} Updated news item
   */
  static async incrementViewCount(newsId) {
    try {
      const response = await httpClient.post(`/news/${newsId}/view`);
      return response;
    } catch (error) {
      console.error('Error incrementing view count:', error);
      throw error;
    }
  }
}

export default NewsAPI;
