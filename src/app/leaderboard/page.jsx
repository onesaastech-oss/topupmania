"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaWallet, FaSpinner } from 'react-icons/fa';
import Footer from "@/components/Footer";
import LeaderboardBadge from "@/components/LeaderboardBadge";
import { getFormattedLeaderboard } from '@/lib/api';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('purchase'); // 'purchase' or 'wallet'
  const [activePurchaseTab, setActivePurchaseTab] = useState('challenge'); // 'challenge' or 'reward'
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Leaderboard data from API
  const [leaderboardDataState, setLeaderboardDataState] = useState({
    activeChallenge: [],
    lastReward: [],
    walletTopAdders: [],
    currentMonth: null,
    lastMonth: null
  });
  
  // Initialize component
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch leaderboard data from API
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFormattedLeaderboard();
        setLeaderboardDataState(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard data:', err);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  // Generate confetti only on client after mount to avoid SSR hydration mismatches
  const confettiSpecs = useMemo(() => {
    if (!isMounted) return [];
    return Array.from({ length: 50 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      background: ['#FFD700', '#FF1493', '#00BFFF', '#7CFC00', '#FF4500', '#9370DB'][Math.floor(Math.random() * 6)],
      scale: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
  }, [isMounted]);

  // Theme reactivity
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initial theme check
    const checkTheme = () => {
      const root = document.documentElement;
      const isDarkTheme = root.classList.contains('dark');
      setIsDark(isDarkTheme);
    };
    
    // Check theme on mount
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Also listen for storage changes (in case theme is changed in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        checkTheme();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Get data based on active tab
  const getCurrentTabData = () => {
    if (activeTab === 'purchase') {
      if (activePurchaseTab === 'challenge') {
        return {
          topThree: leaderboardDataState.activeChallenge.slice(0, 3),
          remaining: leaderboardDataState.activeChallenge.slice(3),
          title: leaderboardDataState.currentMonth || 'Active Challenge',
          emptyMessage: 'No active challenge data available'
        };
      } else { // reward
        return {
          topThree: leaderboardDataState.lastReward.slice(0, 3),
          remaining: leaderboardDataState.lastReward.slice(3),
          title: leaderboardDataState.lastMonth || 'Last Reward',
          emptyMessage: 'No reward data available'
        };
      }
    } else { // wallet
      return {
        topThree: leaderboardDataState.walletTopAdders.slice(0, 3),
        remaining: leaderboardDataState.walletTopAdders.slice(3),
        title: 'Wallet Top Adders',
        emptyMessage: 'No wallet data available'
      };
    }
  };
  
  const { topThree, remaining, title, emptyMessage } = getCurrentTabData();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 to-black' 
        : 'bg-gradient-to-br from-gray-50 to-white'
    }`}>
      <div className="flex-grow pb-24">
        {/* Banner with Badges */}
        <div className={`w-full rounded-b-3xl pt-24 pb-30 px-4 relative overflow-hidden mt-16 ${
          isDark 
            ? 'bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900' 
            : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600'
        }`}>
          {/* Confetti Container */}
          <div className="absolute inset-0 overflow-hidden">
            {confettiSpecs.map((c, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: c.left,
                  top: c.top,
                  background: c.background,
                  transform: `scale(${c.scale})`,
                  opacity: c.opacity,
                  animation: `confetti-fall ${c.duration}s linear infinite`,
                  animationDelay: `${c.delay}s`,
                  zIndex: 1,
                }}
              />
            ))}
          </div>
          <style jsx>{`
            @keyframes confetti-fall {
              0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
              }
            }
          `}</style>
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent"></div>
          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <h1 className="text-3xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100 mb-4">
              Leaderboard
            </h1>
            <p className="text-emerald-100/80 text-sm max-w-2xl mx-auto mb-2">
              Track your ranking and compete with other users
            </p>
            
            {/* Badges Row */}
            <div className="flex justify-center items-end space-x-1 sm:space-x-3 md:space-x-6 pt-10 pb-4 mb-16">
              {/* Top 3 Badges */}
              <div className="flex justify-center items-end gap-1 sm:gap-2 md:gap-6 lg:gap-10 -mb-8 z-10 relative">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <FaSpinner className={`animate-spin text-2xl ${
                      isDark ? 'text-emerald-400' : 'text-emerald-600'
                    }`} />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Unable to load top performers
                    </p>
                  </div>
                ) : (
                  <>
                    {topThree.length >= 2 && (
                      <div className="relative -mb-2 sm:mb-0">
                        <LeaderboardBadge 
                          position={2}
                          name={topThree[1]?.name || 'Player 2'}
                          amount={`₹${topThree[1]?.amount || '0.00'}`}
                          imageUrl="/images/trophy2.jpg"
                        />
                      </div>
                    )}
                    {topThree.length >= 1 && (
                      <div className="relative -mt-6 sm:-mt-8 md:-mt-10 lg:-mt-12">
                        <LeaderboardBadge 
                          position={1}
                          name={topThree[0]?.name || 'Player 1'}
                          amount={`₹${topThree[0]?.amount || '0.00'}`}
                          imageUrl="/images/trophy1.jpg"
                        />
                      </div>
                    )}
                    {topThree.length >= 3 && (
                      <div className="relative -mb-2 sm:mb-0">
                        <LeaderboardBadge 
                          position={3}
                          name={topThree[2]?.name || 'Player 3'}
                          amount={`₹${topThree[2]?.amount || '0.00'}`}
                          imageUrl="/images/trophy3.jpg"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="max-w-6xl mx-auto px-4 mt-12 relative z-20">
          <motion.div
            className={`backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-emerald-500/20' 
                : 'bg-gradient-to-br from-white/80 to-gray-50/80 border border-emerald-500/30'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tabs */}
            <div className="flex flex-col">
              {/* Main Tabs */}
              <div className={`flex p-1 border-b ${
                isDark 
                  ? 'bg-gray-800/30 border-gray-700/50' 
                  : 'bg-gray-100/30 border-gray-200/50'
              }`}>
                {[
                  { id: 'purchase', icon: <FaShoppingCart className="mr-2" />, label: 'Purchase' },
                  { id: 'wallet', icon: <FaWallet className="mr-2" />, label: 'Wallet' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? isDark 
                          ? 'bg-gray-700/50 text-emerald-400 shadow-lg'
                          : 'bg-gray-200/50 text-emerald-600 shadow-lg'
                        : isDark 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/30'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Purchase Sub-tabs */}
              {activeTab === 'purchase' && (
                <div className={`flex justify-center py-2 ${
                  isDark ? 'bg-gray-800/20' : 'bg-gray-100/20'
                }`}>
                  <div className={`inline-flex rounded-lg p-1 border ${
                    isDark 
                      ? 'bg-gray-800/80 border-gray-700/50' 
                      : 'bg-gray-100/80 border-gray-200/50'
                  }`}>
                    {[
                      { id: 'challenge', label: 'Active Challenge' },
                      { id: 'reward', label: 'Last Reward' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActivePurchaseTab(tab.id)}
                        className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                          activePurchaseTab === tab.id
                            ? isDark 
                              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                              : 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                            : isDark 
                              ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full">
                <div className={`rounded-xl p-6 mt-4 ${
                  isDark 
                    ? 'bg-gray-800/30 border border-gray-700/50' 
                    : 'bg-gray-100/30 border border-gray-200/50'
                }`}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-center"
                    >
                      <div className="w-full">
                        {loading ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <FaSpinner className={`animate-spin text-4xl mb-4 ${
                              isDark ? 'text-emerald-400' : 'text-emerald-600'
                            }`} />
                            <p className={`text-lg ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              Loading leaderboard data...
                            </p>
                          </div>
                        ) : error ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <div className={`text-red-500 text-lg mb-4 ${
                              isDark ? 'text-red-400' : 'text-red-600'
                            }`}>
                              ⚠️ {error}
                            </div>
                            <button
                              onClick={() => window.location.reload()}
                              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                isDark 
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                              }`}
                            >
                              Try Again
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {remaining.length > 0 ? (
                              remaining.map((item) => (
                                <div key={item.id} className={`relative rounded-xl p-4 sm:p-6 border w-full ${
                                  isDark 
                                    ? 'border-emerald-500/20' 
                                    : 'border-emerald-500/30'
                                }`}>
                                  <div className={`absolute top-1/2 right-2 sm:right-6 transform -translate-y-1/2 text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-1.5 rounded-full whitespace-nowrap ${
                                    isDark 
                                      ? 'bg-emerald-900/80 text-emerald-300' 
                                      : 'bg-emerald-100/80 text-emerald-700'
                                  }`}>
                                    ₹{item.amount} {activeTab === 'wallet' ? 'added' : ''}
                                  </div>
                                  <div className="flex items-center justify-between w-full pr-20 sm:pr-0">
                                    <div className="flex items-center">
                                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-emerald-500/30 ${
                                        isDark ? 'bg-gray-800' : 'bg-gray-100'
                                      }`}>
                                        <span className={`text-xl sm:text-2xl font-bold ${
                                          isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                          {item.position}
                                        </span>
                                      </div>
                                      <div className="ml-3 sm:ml-4 max-w-[120px] sm:max-w-none">
                                        <h4 className={`font-medium text-sm sm:text-lg truncate ${
                                          isDark ? 'text-white' : 'text-gray-900'
                                        }`}>{item.name}</h4>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className={`py-8 ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {emptyMessage}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
          </motion.div>
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
