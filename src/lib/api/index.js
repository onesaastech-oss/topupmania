/**
 * API Module Entry Point
 * Re-export all API functions for easy imports
 */

// Auth API
export {
  sendOtp,
  verifyOtp,
  completeRegistration,
  logout,
  isAuthenticated,
  getCurrentUser,
  getAuthToken,
} from './auth.js';

// Games API
export {
  getAllGames,
  getGameById,
  getGameDiamondPacks,
  validateUser,
  createDiamondPackOrder,
  searchGames,
  getGamesByPublisher,
  transformGameData,
  transformGamesArray,
  transformDiamondPackData,
  transformDiamondPacksArray,
} from './games.js';

// User API
export {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
} from './user.js';

// Leaderboard API
export {
  getLeaderboard,
  transformLeaderboardData,
  getFormattedLeaderboard,
} from './leaderboard.js';

// Banners API
export {
  getPublicBanners,
  getBannersByType,
  getPrimaryBanners,
  getSecondaryBanners,
  transformBannerData,
  transformBannersArray,
} from './banners.js';

// HTTP Client
export { httpClient, API_CONFIG } from './config.js';

// Transaction API
export { TransactionAPI } from './transactions.js';

// Auth Utilities
export {
  validatePhone,
  validateOtp,
  validateEmail,
  validateName,
  validatePassword,
  formatPhoneDisplay,
  sanitizePhone,
  generateRandomString,
  debounce,
} from '../utils/auth.js';
