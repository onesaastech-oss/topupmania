import { httpClient } from './config.js';

/**
 * Check maintenance status
 * @returns {Promise<Object>} Response with maintenance status
 */
export async function getMaintenanceStatus() {
  try {
    const response = await httpClient.get('/maintenance/status');
    
    return {
      success: true,
      data: response,
      isMaintenance: response.status === true,
      message: response.message || 'Maintenance status checked',
      timestamp: response.timestamp
    };
  } catch (error) {
    console.error('Error checking maintenance status:', error);
    return {
      success: false,
      isMaintenance: false,
      message: 'Failed to check maintenance status',
      error: error.message
    };
  }
}
