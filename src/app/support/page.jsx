"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import Link from "next/link";
import { BsChevronDown, BsHeadset } from "react-icons/bs";
import { useAuth } from '@/context/AuthContext';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

// Separate variants for collapsible content
const contentVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.1,
      ease: "easeOut"
    }
  }
};

export default function SupportPage() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const { user, isLoggedIn } = useAuth();

  // Handle support redirect to Telegram with user details
  const handleSupport = () => {
    if (!isLoggedIn) {
      // If user is not logged in, open Telegram without pre-filled message
      const telegramUrl = `https://t.me/credimics`;
      window.open(telegramUrl, '_blank');
      return;
    }

    const userName = user?.name || 'N/A';
    const userPhone = user?.phone || 'N/A';
    const userEmail = user?.email || 'N/A';

    const supportText = `Name: ${userName}
Phone: ${userPhone}
Email: ${userEmail}
Issue: Support Request`;

    const encodedText = encodeURIComponent(supportText);
    const telegramUrl = `https://t.me/credimics?text=${encodedText}`;
    window.open(telegramUrl, '_blank');
  };

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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-gray-100' 
        : 'bg-gradient-to-br from-gray-50 via-white to-emerald-50 text-gray-900'
    }`}>

      <main className="relative z-10">
        {/* Modern Hero Banner */}
        <section className={`relative w-full rounded-3xl min-h-[280px] md:min-h-[280px] overflow-hidden mt-16 ${
          isDark 
            ? 'bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900' 
            : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600'
        }`}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, #AA424A 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}></div>
         {/* Dynamic Grid Pattern */}
         <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: isDark 
            ? 'linear-gradient(rgba(100, 13, 20, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 13, 20, 0.25) 1px, transparent 1px)'
            : 'linear-gradient(rgba(170, 66, 74, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(170, 66, 74, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 70%)',
        }}></div>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(circle at 15% 25%, rgba(100, 13, 20, 0.55) 0%, transparent 25%),
              radial-gradient(circle at 85% 75%, rgba(170, 66, 74, 0.45) 0%, transparent 25%),
              linear-gradient(45deg, rgba(170, 66, 74, 0.15) 0%, transparent 100%)
            `,
            backgroundSize: '200% 200%',
          }}></div>
          
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -left-20 w-40 h-40 bg-emerald-500/20 rounded-full mix-blend-overlay filter blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-teal-500/20 rounded-full mix-blend-overlay filter blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/5 rounded-full mix-blend-overlay filter blur-2xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
              >
                <BsHeadset className="text-white text-3xl" />
              </motion.div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold text-white mb-4"
              >
                Support Center
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-emerald-100 max-w-2xl text-sm"
              >
                We're here to help you 24/7 with any questions or issues
              </motion.p>
            </div>
          </div>
          
          {/* Bottom wave effect with enhanced blur */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500/10 via-teal-400/10 to-cyan-400/20 backdrop-blur-md"></div>
        </section>

        <main className="relative z-10 -mt-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex-1">
          {/* Main Content */}
          
          <motion.div 
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 -mt-16"
          >
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`rounded-2xl shadow-2xl overflow-hidden ${
                isDark 
                  ? 'bg-gray-800/95 border border-gray-700/50' 
                  : 'bg-white/95 border border-gray-200/50'
              }`}
            >
              <motion.div variants={itemVariants}>
                <button
                  type="button"
                  onClick={() => setIsChatOpen((v) => !v)}
                  className={`w-full flex items-center justify-between px-6 py-5 text-left transition-all duration-300 group ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-4">
                      <BsHeadset className="text-white" />
                    </span>
                    <div>
                      <h2 className={`text-xl font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>24/7 Chat Support</h2>
                      <p className={`text-sm mt-1 ${
                        isDark ? 'text-emerald-100/80' : 'text-emerald-700/80'
                      }`}>Get instant assistance from our team</p>
                    </div>
                  </div>
                  <BsChevronDown
                    className={`transition-transform duration-300 ${
                      isDark ? 'text-emerald-500' : 'text-emerald-600'
                    } ${isChatOpen ? "rotate-180" : "rotate-0"}`}
                    size={20}
                  />
                </button>
              </motion.div>

              <AnimatePresence mode="wait">
                {isChatOpen && (
                  <motion.div
                    key="chat-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className={`px-6 pb-6 pt-2 border-t ${
                      isDark ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`}>
                      <motion.div 
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        className={`max-w-none leading-relaxed text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        <p>
                          At Credimi, we take pride in offering an unparalleled level of customer support through our 24/7 Live Chat Support Service. 
                          Our dedicated team is here to help with any questions or assistance you need while using our platform.
                        </p>
                        <p className="mt-3">
                          Whether you're experiencing technical issues, have inquiries about our services, or simply need guidance, 
                          we're committed to providing prompt and reliable support to ensure your experience is seamless and satisfactory.
                        </p>
                      </motion.div>

                      <motion.div 
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.2 }}
                        className="mt-8"
                      >
                        <button
                          onClick={handleSupport}
                          className={`inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 ${
                            isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                          }`}
                        >
                          <BsHeadset className="mr-2" />
                          Start Chat Now
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
          </main>
      </main>

      <Footer />
    </div>
  );
}