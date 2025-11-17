/**
 * Leaderboard API functions
 */

import { httpClient } from './config.js';

/**
 * Fetch leaderboard data from the API
 * @returns {Promise<Object>} Leaderboard data with currentMonth and lastMonth
 */
export async function getLeaderboard() {
  try {
    const response = await httpClient.get('/user/leaderboard');
    return response;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

/**
 * Transform API leaderboard data to match component structure
 * @param {Object} apiData - Raw API response
 * @returns {Object} Transformed data for the leaderboard component
 */
export function transformLeaderboardData(apiData) {
  if (!apiData || !apiData.currentMonth) {
    return {
      activeChallenge: [],
      lastReward: [],
      walletTopAdders: []
    };
  }

  // Transform current month data (Active Challenge - Purchase Leaderboard)
  const activeChallenge = apiData.currentMonth.leaderboard.map((user, index) => ({
    id: user._id,
    name: user.name || 'Anonymous',
    amount: user.totalPurchaseAmount?.toLocaleString('en-IN') || '0',
    position: index + 1,
    email: user.email,
    avatar: user.avatar,
    purchaseCount: user.purchaseCount
  }));

  // Transform last month data (Last Reward) - if available
  const lastReward = apiData.lastMonth?.leaderboard?.map((user, index) => ({
    id: user._id,
    name: user.name || 'Anonymous',
    amount: user.totalPurchaseAmount?.toLocaleString('en-IN') || '0',
    position: index + 1,
    email: user.email,
    avatar: user.avatar,
    purchaseCount: user.purchaseCount
  })) || [];

  // Transform current month wallet top adders
  const walletTopAdders = apiData.currentMonth.walletAdders?.map((user, index) => ({
    id: user._id,
    name: user.name || 'Anonymous',
    amount: user.totalWalletAdded?.toLocaleString('en-IN') || '0',
    position: index + 1,
    email: user.email,
    avatar: user.avatar,
    walletAddCount: user.walletAddCount
  })) || [];

  return {
    activeChallenge,
    lastReward,
    walletTopAdders,
    currentMonth: apiData.currentMonth?.month,
    lastMonth: apiData.lastMonth?.month
  };
}

/**
 * Get formatted leaderboard data ready for component consumption
 * @returns {Promise<Object>} Formatted leaderboard data
 */
export async function getFormattedLeaderboard() {
  try {
    const rawData = await getLeaderboard();
    return transformLeaderboardData(rawData);
  } catch (error) {
    console.error('Error getting formatted leaderboard:', error);
    // Return empty data structure on error
    return {
      activeChallenge: [],
      lastReward: [],
      walletTopAdders: [],
      currentMonth: null,
      lastMonth: null
    };
  }
}
