import { httpClient } from './config.js';

/**
 * Fetch order status by order ID
 * @param {string} orderId - Order ID to fetch status for
 * @returns {Promise<Object>} Response with order status data
 */
export async function getOrderStatus(orderId) {
  try {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    const response = await httpClient.get(`/order/order-status?orderId=${orderId}`);
    
    // Check if the response contains an error
    if (response.error) {
      return {
        success: false,
        error: response.error,
        order: null,
        message: response.error
      };
    }
    
    return {
      success: true,
      data: response,
      order: response.order,
      message: response.message || 'Order status fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching order status:', error);
    return {
      success: false,
      error: error.message,
      order: null,
      message: error.message || 'Failed to fetch order status'
    };
  }
}

/**
 * Get order history for current user
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @returns {Promise<Object>} Response with order history
 */
export async function getOrderHistory(params = {}) {
  try {
    const { page = 1, limit = 10 } = params;
    
    const response = await httpClient.get('/order/history', { page, limit });
    
    return {
      success: true,
      data: response,
      orders: response.orders || [],
      totalCount: response.totalCount || 0,
      message: response.message || 'Order history fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching order history:', error);
    return {
      success: false,
      error: error.message,
      orders: [],
      totalCount: 0,
      message: error.message || 'Failed to fetch order history'
    };
  }
}

/**
 * Cancel an order by ID
 * @param {string} orderId - Order ID to cancel
 * @returns {Promise<Object>} Response with cancellation result
 */
export async function cancelOrder(orderId) {
  try {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    const response = await httpClient.post(`/order/cancel`, { orderId });
    
    return {
      success: true,
      data: response,
      message: response.message || 'Order cancelled successfully'
    };
  } catch (error) {
    console.error('Error cancelling order:', error);
    return {
      success: false,
      error: error.message,
      message: error.message || 'Failed to cancel order'
    };
  }
}
