"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaWallet, FaSpinner, FaTelegram, FaCamera, FaTimes, FaTrophy } from 'react-icons/fa';
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
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [userData, setUserData] = useState(null);

  // Leaderboard data from API
  const [leaderboardDataState, setLeaderboardDataState] = useState({
    activeChallenge: [],
    lastReward: [],
    walletTopAdders: [],
    currentPeriod: null,
    lastPeriod: null,
    filters: null
  });

  // Initialize component and load user data
  useEffect(() => {
    setIsMounted(true);

    // Load user data from localStorage
    if (typeof window !== 'undefined') {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          setUserData(JSON.parse(storedUserData));
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
    }
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

  // Check if user is in top 3 of active challenge and show congratulations modal
  useEffect(() => {
    if (userData && leaderboardDataState.activeChallenge.length > 0 && !loading) {
      const userInTop3 = leaderboardDataState.activeChallenge
        .slice(0, 3)
        .find(user => user.id === userData._id);

      if (userInTop3) {
        setShowCongratulationsModal(true);
      }
    }
  }, [userData, leaderboardDataState.activeChallenge, loading]);

  // Helper function to check if user is in top 3 of last reward
  const isUserInLastRewardTop3 = () => {
    if (!userData || !leaderboardDataState.lastReward.length) return false;
    return leaderboardDataState.lastReward
      .slice(0, 3)
      .some(user => user.id === userData._id);
  };

  // Helper function to get user's position in active challenge
  const getUserPositionInActiveChallenge = () => {
    if (!userData || !leaderboardDataState.activeChallenge.length) return null;
    const userIndex = leaderboardDataState.activeChallenge.findIndex(user => user.id === userData._id);
    return userIndex !== -1 ? userIndex + 1 : null;
  };

  // Function to handle claim reward via Telegram
  const handleClaimReward = () => {
    if (!userData) return;

    const message = `Hello! I want to claim my leaderboard reward. 
    
My Details:
- Name: ${userData.name}
- Email: ${userData.email}
- Phone: ${userData.phone}
- User ID: ${userData._id}

I was in the top 3 of the last reward period. Please process my reward claim.

Thank you!`;

    const telegramUrl = `https://t.me/Topupmaniacs?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  // Function to take screenshot and share
  const handleScreenshotShare = async () => {
    try {
      if (navigator.share && 'getDisplayMedia' in navigator.mediaDevices) {
        // Use Web Share API with screenshot
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        video.addEventListener('loadedmetadata', () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0);

          canvas.toBlob(async (blob) => {
            const file = new File([blob], 'leaderboard-screenshot.png', { type: 'image/png' });

            try {
              await navigator.share({
                title: 'TopUp Mania Leaderboard',
                text: `🏆 I'm in the top 3 of TopUp Mania leaderboard! Check out my ranking!`,
                files: [file]
              });
            } catch (error) {
              console.error('Error sharing:', error);
              // Fallback: download the image
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'leaderboard-screenshot.png';
              a.click();
              URL.revokeObjectURL(url);
            }

            stream.getTracks().forEach(track => track.stop());
          });
        });
      } else {
        // Fallback: just copy text to clipboard
        const text = `🏆 I'm in the top 3 of TopUp Mania leaderboard! Check out my ranking at TopUp Mania!`;
        await navigator.clipboard.writeText(text);
        alert('Text copied to clipboard! You can now paste and share it.');
      }
    } catch (error) {
      console.error('Error taking screenshot:', error);
      // Final fallback: just copy text
      const text = `🏆 I'm in the top 3 of TopUp Mania leaderboard!`;
      try {
        await navigator.clipboard.writeText(text);
        alert('Text copied to clipboard! You can now paste and share it.');
      } catch (clipboardError) {
        alert('Unable to capture screenshot. Please take a manual screenshot to share!');
      }
    }
  };

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
          title: leaderboardDataState.currentPeriod || 'Active Challenge',
          emptyMessage: 'No active challenge data available'
        };
      } else { // reward
        return {
          topThree: leaderboardDataState.lastReward.slice(0, 3),
          remaining: leaderboardDataState.lastReward.slice(3),
          title: leaderboardDataState.lastPeriod || 'Last Reward',
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
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark
        ? 'bg-gradient-to-br from-gray-900 to-black'
        : 'bg-gradient-to-br from-gray-50 to-white'
      }`}>
      <div className="flex-grow pb-24">
        {/* Banner with Badges */}
        <div className={`w-full rounded-b-3xl pt-24 pb-30 px-4 relative overflow-hidden mt-16 ${isDark
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
                    <FaSpinner className={`animate-spin text-2xl ${isDark ? 'text-emerald-400' : 'text-emerald-600'
                      }`} />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
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

            {/* Claim Reward Section for Top 3 Users */}
            {activeTab === 'purchase' && activePurchaseTab === 'reward' && userData && !loading && (
              (() => {
                const userInTop3 = topThree.find(user => user.id === userData._id);
                return userInTop3 ? (
                  <div className="flex justify-center mt-6 mb-4">
                    <div className={`rounded-2xl p-6 ${isDark
                        ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-500/30'
                        : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-500/30'
                      } shadow-lg backdrop-blur-sm`}>
                      <div className="text-center mb-4">
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                          🎉 Congratulations {userData.name}!
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                          You finished in position #{userInTop3.position} in the last reward period!
                        </p>
                      </div>
                      <button
                        onClick={handleClaimReward}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isDark
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25'
                          }`}
                      >
                        <FaTelegram className="text-lg" />
                        Claim Your Reward
                      </button>
                    </div>
                  </div>
                ) : null;
              })()
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className="max-w-6xl mx-auto px-4 mt-12 relative z-20">
          <motion.div
            className={`backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden ${isDark
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
              <div className={`flex p-1 border-b ${isDark
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
                    className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab.id
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
                <div className={`flex justify-center py-2 ${isDark ? 'bg-gray-800/20' : 'bg-gray-100/20'
                  }`}>
                  <div className={`inline-flex rounded-lg p-1 border ${isDark
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
                        className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activePurchaseTab === tab.id
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
              <div className={`rounded-xl p-6 mt-4 ${isDark
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
                          <FaSpinner className={`animate-spin text-4xl mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'
                            }`} />
                          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            Loading leaderboard data...
                          </p>
                        </div>
                      ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className={`text-red-500 text-lg mb-4 ${isDark ? 'text-red-400' : 'text-red-600'
                            }`}>
                            ⚠️ {error}
                          </div>
                          <button
                            onClick={() => window.location.reload()}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${isDark
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
                            remaining.map((item) => {
                              // Check if this user should see claim button (top 3 in last reward and matches user ID)
                              const showClaimButton = activeTab === 'purchase' &&
                                activePurchaseTab === 'reward' &&
                                item.position <= 3 &&
                                userData &&
                                item.id === userData._id;

                              return (
                                <div key={item.id} className={`relative rounded-xl p-4 sm:p-6 border w-full ${isDark
                                    ? 'border-emerald-500/20'
                                    : 'border-emerald-500/30'
                                  }`}>
                                  <div className={`absolute top-1/2 right-2 sm:right-6 transform -translate-y-1/2 text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-1.5 rounded-full whitespace-nowrap ${isDark
                                      ? 'bg-emerald-900/80 text-emerald-300'
                                      : 'bg-emerald-100/80 text-emerald-700'
                                    }`}>
                                    ₹{item.amount} {activeTab === 'wallet' ? 'added' : ''}
                                  </div>
                                  <div className="flex items-center justify-between w-full pr-20 sm:pr-0">
                                    <div className="flex items-center">
                                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-emerald-500/30 ${isDark ? 'bg-gray-800' : 'bg-gray-100'
                                        }`}>
                                        <span className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                          }`}>
                                          {item.position}
                                        </span>
                                      </div>
                                      <div className="ml-3 sm:ml-4 max-w-[120px] sm:max-w-none">
                                        <h4 className={`font-medium text-sm sm:text-lg truncate ${isDark ? 'text-white' : 'text-gray-900'
                                          }`}>{item.name}</h4>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Claim Reward Button */}
                                  {showClaimButton && (
                                    <div className="mt-4 flex justify-center">
                                      <button
                                        onClick={handleClaimReward}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isDark
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25'
                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25'
                                          }`}
                                      >
                                        <FaTelegram className="text-lg" />
                                        Claim Reward
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className={`py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'
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

      {/* Congratulations Modal */}
      <AnimatePresence>
        {showCongratulationsModal && userData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCongratulationsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`relative max-w-md w-full rounded-2xl p-6 ${isDark
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-emerald-500/30'
                  : 'bg-gradient-to-br from-white to-gray-50 border border-emerald-500/30'
                } shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCongratulationsModal(false)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDark
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
              >
                <FaTimes />
              </button>

              {/* Content */}
              <div className="text-center">
                {/* Trophy Icon */}
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                    : 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                  } shadow-lg`}>
                  <FaTrophy className="text-2xl text-white" />
                </div>

                {/* Title */}
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  🎉 Congratulations!
                </h2>

                {/* Message */}
                <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  <span className="font-semibold text-emerald-500">{userData.name}</span>, you are currently in the
                  <span className="font-bold text-emerald-500"> top {getUserPositionInActiveChallenge()} </span>
                  of the leaderboard! Keep up the great work! 🚀
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleScreenshotShare}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isDark
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25'
                      }`}
                  >
                    <FaCamera />
                    Share Screenshot
                  </button>

                  <button
                    onClick={() => setShowCongratulationsModal(false)}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900'
                      }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
