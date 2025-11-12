"use client";

import Footer from "@/components/Footer";
import { BsCreditCard, BsChevronDown, BsNewspaper } from "react-icons/bs";
import { FaMoneyBillWave, FaRocket, FaTags, FaRegClock, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { NewsAPI } from "@/lib/api/news";

// Helper function to get icon based on category
const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'announcement':
      return <BsNewspaper className="text-blue-500" />;
    case 'promotion':
      return <FaTags className="text-purple-500" />;
    case 'update':
      return <BsCreditCard className="text-blue-500" />;
    case 'feature':
      return <FaRocket className="text-green-500" />;
    case 'payment':
      return <FaMoneyBillWave className="text-green-500" />;
    default:
      return <BsNewspaper className="text-gray-500" />;
  }
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Helper function to calculate read time
const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};

const NewsCard = ({ item, isOpen, onClick, isDark }) => (
  <motion.div 
    className={`mb-6 overflow-hidden rounded-2xl backdrop-blur-sm shadow-xl transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-emerald-500/20 hover:shadow-emerald-900/20 hover:border-emerald-500/30' 
        : 'bg-gradient-to-br from-white/90 to-gray-50/90 border border-emerald-500/30 hover:shadow-emerald-500/20 hover:border-emerald-500/40'
    }`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.01 }}
  >
    <button
      className="w-full text-left p-6 flex flex-col"
      onClick={onClick}
    >
      <div className="flex justify-between items-start w-full">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {getCategoryIcon(item.category)}
          </div>
          <div>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-opacity-20 bg-blue-500 mb-2 ${
              isDark ? 'text-blue-300' : 'text-blue-600'
            }`}>
              {item.category}
            </span>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
          </div>
        </div>
        <BsChevronDown
          className={`transition-transform duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'} ${isOpen ? "rotate-180" : ""}`}
          size={20}
        />
      </div>
      
      <div className={`flex items-center mt-4 text-sm ${isDark ? 'text-emerald-100/80' : 'text-emerald-700/80'}`}>
        <div className="flex items-center mr-4">
          <FaRegClock className="mr-1" />
          <span>{formatDate(item.publishedAt || item.createdAt)}</span>
        </div>
        <div className="flex items-center">
          <span>•</span>
          <span className="ml-2">{calculateReadTime(item.content)}</span>
        </div>
        {item.isPinned && (
          <div className="flex items-center ml-4">
            <span>•</span>
            <span className="ml-2 text-yellow-500">📌 Pinned</span>
          </div>
        )}
      </div>
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className={`px-6 pb-3 pt-2 border-t ${isDark ? 'text-gray-300 border-gray-700' : 'text-gray-600 border-gray-200'}`}>
            {/* News Image */}
            {item.image && (
              <div className="mb-4">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div 
              className="mb-3 text-sm leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default function NewsPage() {
  const [openItem, setOpenItem] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await NewsAPI.getNews({ limit: 20 });
        
        if (response.success) {
          setNewsData(response.data.news);
          setPagination(response.data.pagination);
        } else {
          setError('Failed to fetch news');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err.message || 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-gray-100' 
        : 'bg-gradient-to-br from-gray-50 via-white to-emerald-50 text-gray-900'
    }`}>
      
      {/* Modern Green Banner */}
      <section className={`relative w-full rounded-3xl min-h-[280px] md:min-h-[280px] overflow-hidden mt-16 ${
        isDark 
          ? 'bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900' 
          : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600'
      }`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, #AA424A 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(170, 66, 74, 0.35) 0%, transparent 30%),
            radial-gradient(circle at 80% 70%, rgba(100, 13, 20, 0.4) 0%, transparent 30%),
            linear-gradient(135deg, rgba(170, 66, 74, 0.2) 0%, transparent 50%)
          `,
          animation: 'pulse 12s ease-in-out infinite alternate',
        }}></div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center py-12">
          <div className={`inline-block px-4 py-2 mb-4 text-sm font-medium rounded-full backdrop-blur-sm border ${
            isDark 
              ? 'text-emerald-100 bg-emerald-800/50 border-emerald-700/50' 
              : 'text-emerald-50 bg-emerald-700/50 border-emerald-600/50'
          }`}>
            Latest Updates
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            News & Announcements
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-xl text-emerald-100/90">
            Stay updated with the latest news, updates, and promotions
          </p>
        </div>
      </section>

      <main className="flex-1 relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="animate-spin text-4xl text-emerald-500 mb-4" />
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading news...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className={`text-center p-8 rounded-2xl ${
              isDark 
                ? 'bg-red-900/20 border border-red-500/30' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                Failed to load news
              </h3>
              <p className={`${isDark ? 'text-red-200' : 'text-red-500'}`}>
                {error}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : newsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <BsNewspaper className="text-6xl text-gray-400 mb-4" />
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              No news available
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Check back later for updates
            </p>
          </div>
        ) : (
          <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {newsData.map((item, idx) => (
              <NewsCard
                key={item._id}
                item={item}
                isOpen={openItem === idx}
                onClick={() => setOpenItem(openItem === idx ? null : idx)}
                isDark={isDark}
              />
            ))}
          </motion.div>
        )}
        
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className={`flex items-center space-x-2 p-4 rounded-xl ${
              isDark 
                ? 'bg-gray-800/50 border border-gray-700' 
                : 'bg-white/50 border border-gray-200'
            }`}>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                • {pagination.totalNews} total news
              </span>
            </div>
          </div>
        )}
      </main>
      
      <Footer className="mt-auto" />
    </div>
  );
}
