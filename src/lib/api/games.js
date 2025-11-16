/**
 * Games API Service
 */

import { httpClient } from './config.js';

/**
 * Get all games
 * @returns {Promise<Object>} Response with games array
 */
export async function getAllGames() {
  try {
    const response = await httpClient.get('/games/get-all');
    
    return {
      success: true,
      data: response,
      games: response.games || [],
      count: response.count || 0,
    };
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return {
      success: false,
      error: error.message,
      games: [],
      count: 0,
    };
  }
}

/**
 * Get game by ID
 * @param {string} gameId - Game ID
 * @returns {Promise<Object>} Response with game data
 */
export async function getGameById(gameId) {
  try {
    const response = await httpClient.get(`/games/${gameId}`);
    
    return {
      success: true,
      data: response,
      game: response.game || null,
    };
  } catch (error) {
    console.error('Failed to fetch game:', error);
    return {
      success: false,
      error: error.message,
      game: null,
    };
  }
}

/**
 * Search games by name or publisher
 * @param {string} query - Search query
 * @returns {Promise<Object>} Response with filtered games
 */
export async function searchGames(query) {
  try {
    const response = await httpClient.get('/games/search', { query });
    
    return {
      success: true,
      data: response,
      games: response.games || [],
      count: response.count || 0,
    };
  } catch (error) {
    console.error('Failed to search games:', error);
    return {
      success: false,
      error: error.message,
      games: [],
      count: 0,
    };
  }
}

/**
 * Get games by publisher
 * @param {string} publisher - Publisher name
 * @returns {Promise<Object>} Response with publisher's games
 */
export async function getGamesByPublisher(publisher) {
  try {
    const response = await httpClient.get('/games/publisher', { publisher });
    
    return {
      success: true,
      data: response,
      games: response.games || [],
      count: response.count || 0,
    };
  } catch (error) {
    console.error('Failed to fetch games by publisher:', error);
    return {
      success: false,
      error: error.message,
      games: [],
      count: 0,
    };
  }
}

/**
 * Get diamond packs for a specific game
 * @param {string} gameId - Game ID
 * @returns {Promise<Object>} Response with diamond packs array
 */
export async function getGameDiamondPacks(gameId) {
  try {
    const response = await httpClient.get(`/games/${gameId}/diamond-packs`);
    
    return {
      success: true,
      data: response,
      diamondPacks: response.diamondPacks || [],
      gameData: response.gameData || null,
      count: response.count || 0,
    };
  } catch (error) {
    console.error('Failed to fetch diamond packs:', error);
    return {
      success: false,
      error: error.message,
      diamondPacks: [],
      gameData: null,
      count: 0,
    };
  }
}

/**
 * Validate user fields for a specific game
 * @param {Object} validationData - Validation data
 * @param {string} validationData.game - Game identifier (e.g., "MOBILE_LEGENDS_PRO")
 * @param {string} validationData.ogcode - Optional ogcode for the game
 * @param {Object} validationData - Dynamic field values (e.g., playerId, server, region)
 * @returns {Promise<Object>} Response with validation result
 */
export async function validateUser(validationData) {
  try {
    const { game, ogcode, gameId, ...fieldValues } = validationData;
    console.log(ogcode);
    
    
    // Debug: Log the validation data
    console.log('Validation data:', validationData);
    
    // Prepare the payload for Topup Mania API with dynamic field names
    const payload = {
      game: ogcode || game,
      gameId: gameId, // Include gameId in the payload
      ...fieldValues
    };
    
    console.log('API Payload:', payload);
    
    // Call Topup Mania API directly using httpClient
    const data = await httpClient.post('/games/validate-user', payload);
    
    // Debug: Log the API response
    console.log('Validation API Response:', data);
    
    // Handle the new API response format
    // Success response: {"valid": true, "name": "Nadeem", "server": "", "msg": "Validation successful", "authenticated": true}
    // Failed response: {"valid": false, "name": "", "server": "", "msg": "Player ID must contain only numbers (0-9). Special characters are not allowed.", "authenticated": true}
    
    if (data.valid === false) {
      // Handle failed validation - use the specific error message from API
      return {
        success: false,
        data: data,
        isValid: false,
        message: data.msg || "Invalid User ID or Server ID",
        userInfo: null,
        authenticated: data.authenticated,
      };
    }
    
    if (data.valid === true) {
      // Successful validation
      return {
        success: true,
        data: data,
        isValid: true,
        message: data.msg || 'User validated successfully',
        userInfo: { 
          username: data.name,
          server: data.server
        },
        authenticated: data.authenticated,
      };
    }
    
    // Default case for unexpected response format
    return {
      success: false,
      data: data,
      isValid: false,
      message: data.msg || "Invalid User ID or Server ID",
      userInfo: null,
      authenticated: data.authenticated,
    };
    
  } catch (error) {
    console.error('Failed to validate user:', error);
    return {
      success: false,
      error: error.message,
      isValid: false,
      message: error.message || 'Validation failed',
      userInfo: null,
    };
  }
}

/**
 * Transform API game data to frontend format
 * @param {Object} apiGame - Game data from API
 * @returns {Object} Transformed game data for frontend
 */
export function transformGameData(apiGame) {
  return {
    id: apiGame._id,
    name: apiGame.name,
    image: apiGame.image,
    productId: apiGame.productId,
    publisher: apiGame.publisher,
    validationFields: apiGame.validationFields || [],
    createdAt: apiGame.createdAt,
    updatedAt: apiGame.updatedAt,
    // Add any additional frontend-specific fields
    displayName: apiGame.name,
    publisherName: apiGame.publisher,
  };
}

/**
 * Transform API diamond pack data to frontend format
 * @param {Object} apiDiamondPack - Diamond pack data from API
 * @returns {Object} Transformed diamond pack data for frontend
 */
export function transformDiamondPackData(apiDiamondPack) {
  return {
    id: apiDiamondPack._id,
    gameId: apiDiamondPack.game,
    amount: apiDiamondPack.amount,
    commission: apiDiamondPack.commission,
    cashback: apiDiamondPack.cashback,
    logo: apiDiamondPack.logo,
    description: apiDiamondPack.description,
    status: apiDiamondPack.status,
    apiMappings: apiDiamondPack.apiMappings || [],
    createdAt: apiDiamondPack.createdAt,
    updatedAt: apiDiamondPack.updatedAt,
    // Additional frontend fields
    displayAmount: `₹${apiDiamondPack.amount}`,
    isActive: apiDiamondPack.status === 'active',
  };
}

/**
 * Transform array of games from API format to frontend format
 * @param {Array} apiGames - Array of games from API
 * @returns {Array} Array of transformed games
 */
export function transformGamesArray(apiGames) {
  if (!Array.isArray(apiGames)) {
    return [];
  }
  
  return apiGames.map(transformGameData);
}

/**
 * Transform array of diamond packs from API format to frontend format
 * @param {Array} apiDiamondPacks - Array of diamond packs from API
 * @returns {Array} Array of transformed diamond packs
 */
export function transformDiamondPacksArray(apiDiamondPacks) {
  if (!Array.isArray(apiDiamondPacks)) {
    return [];
  }
  
  return apiDiamondPacks.map(transformDiamondPackData);
}

/**
 * Create a diamond pack order
 * @param {Object} orderData - Order data
 * @param {string} orderData.diamondPackId - Diamond pack ID
 * @param {string} orderData.playerId - Player ID
 * @param {string} orderData.server - Server ID
 * @param {number} orderData.quantity - Quantity (default: 1)
 * @returns {Promise<Object>} Response with order details
 */
export async function createDiamondPackOrder(orderData) {
  try {
    const { diamondPackId, playerId, server, quantity = 1 } = orderData;
    
    if (!diamondPackId || !playerId ) {
      throw new Error('Missing required parameters: diamondPackId and playerId are required');
    }

    const payload = {
      diamondPackId,
      playerId,
      server,
      quantity
    };

    console.log('Wallet Order Payload:', payload);

    const data = await httpClient.post('/order/diamond-pack', payload);
    
    return {
      success: data.success || true,
      data: data,
      order: data.order,
      orderId: data.orderId,
      performance: data.performance,
      successfulProviders: data.successfulProviders,
      failedProviders: data.failedProviders,
      attemptedProviders: data.attemptedProviders,
      apiResults: data.apiResults,
      message: data.message || 'Order created successfully'
    };
  } catch (error) {
    console.error('Failed to create diamond pack order:', error);
    return {
      success: false,
      error: error.message,
      order: null,
      orderId: null,
      performance: null,
      successfulProviders: [],
      failedProviders: [],
      attemptedProviders: [],
      apiResults: [],
      message: error.message || 'Failed to create order'
    };
  }
}

/**
 * Create a diamond pack order with UPI payment
 * @param {Object} orderData - Order data
 * @param {string} orderData.diamondPackId - Diamond pack ID
 * @param {string} orderData.playerId - Player ID
 * @param {string} orderData.server - Server ID
 * @param {number} orderData.quantity - Quantity (default: 1)
 * @param {string} orderData.redirectUrl - Redirect URL after payment
 * @returns {Promise<Object>} Response with order details
 */
export async function createDiamondPackOrderUPI(orderData) {
  try {
    const { diamondPackId, playerId, server, quantity = 1, redirectUrl } = orderData;
    
    if (!diamondPackId || !playerId || !server) {
      throw new Error('Missing required parameters: diamondPackId, playerId, and server are required');
    }

    const payload = {
      diamondPackId,
      playerId,
      server,
      quantity,
      redirectUrl: redirectUrl || `${window.location.origin}/payment-status`
    };

    console.log('UPI Order Payload:', payload);

    // Use the UPI-specific endpoint
    const data = await httpClient.post('/order/diamond-pack-upi', payload);
    
    return {
      success: data.success || true,
      data: data,
      order: data.order,
      transaction: data.transaction,
      orderId: data.order?.id || data.orderId,
      paymentUrl: data.transaction?.paymentUrl,
      upiIntent: data.transaction?.upiIntent,
      message: data.message || 'UPI order created successfully'
    };
  } catch (error) {
    console.error('Failed to create UPI diamond pack order:', error);
    return {
      success: false,
      error: error.message,
      order: null,
      transaction: null,
      orderId: null,
      paymentUrl: null,
      upiIntent: null,
      message: error.message || 'Failed to create UPI order'
    };
  }
}

/**
 * Get validation history for a specific game
 * @param {string} gameId - Game ID
 * @returns {Promise<Object>} Response with validation history
 */
export async function getValidationHistory(gameId) {
  try {
    const response = await httpClient.get(`/games/${gameId}/validation-history`);
    
    return {
      success: true,
      gameId: response.gameId,
      count: response.count || 0,
      validationHistory: response.validationHistory || [],
    };
  } catch (error) {
    console.error('Failed to fetch validation history:', error);
    return {
      success: false,
      error: error.message,
      gameId: gameId,
      count: 0,
      validationHistory: [],
    };
  }
}
