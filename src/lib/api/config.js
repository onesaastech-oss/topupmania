/**
 * API Configuration
 */

export const API_CONFIG = {
  BASE_URL: 'https://api.topupmania.com/api/v1',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

/**
 * HTTP Client with interceptors and error handling
 */
class HttpClient {
  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Create request headers
   */
  createHeaders(customHeaders = {}, isFormData = false) {
    const defaultHeaders = {};

    // Only set Content-Type for non-FormData requests
    if (!isFormData) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    // Add auth token if available
    const token = this.getToken();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    return { ...defaultHeaders, ...customHeaders };
  }

  /**
   * Get stored token
   */
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Set auth token
   */
  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  /**
   * Remove auth token
   */
  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Generic request method
   */
  async request(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const isFormData = options.body instanceof FormData;
      
      const config = {
        method: 'GET',
        headers: this.createHeaders(options.headers, isFormData),
        signal: controller.signal,
        ...options,
      };

      if (options.body && config.method !== 'GET') {
        // Don't JSON.stringify FormData objects
        if (options.body instanceof FormData) {
          config.body = options.body;
        } else {
          config.body = JSON.stringify(options.body);
        }
      }

      const response = await fetch(`${this.baseURL}${url}`, config);
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // For 404 errors, preserve the original error message from the API
        if (response.status === 404 && errorData.error) {
          throw new Error(errorData.error);
        }
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    
    return this.request(fullUrl, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'POST',
      body: data,
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'PUT',
      body: data,
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete(url, options = {}) {
    return this.request(url, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * PATCH request
   */
  async patch(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'PATCH',
      body: data,
      ...options,
    });
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
