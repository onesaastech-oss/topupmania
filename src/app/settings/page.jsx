"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaUser, 
  FaSignOutAlt,
  FaFileAlt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaUserCog,
  FaCamera,
} from 'react-icons/fa';
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";



export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [isDark, setIsDark] = useState(false);

  // Set profile image from user data
  useEffect(() => {
    if (user?.profilePicture) {
      setProfileImage(user.profilePicture);
    }
  }, [user]);

  // Theme reactivity
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initial theme check
    const checkTheme = () => {
      const root = document.documentElement;
      const isDarkTheme = root.classList.contains('dark');
      setIsDark(prevIsDark => {
        // Only update if actually changed to prevent unnecessary re-renders
        return prevIsDark !== isDarkTheme ? isDarkTheme : prevIsDark;
      });
    };
    
    // Check theme on mount
    checkTheme();
    
    // Listen for theme changes with debouncing
    let timeoutId;
    const debouncedCheckTheme = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkTheme, 50);
    };
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          debouncedCheckTheme();
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
        debouncedCheckTheme();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/');
  }, [logout, router]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const settingItems = useMemo(() => [
    { icon: <FaUser className="text-blue-500" />, label: 'My Account', path: '/myaccount' },
    { icon: <FaShieldAlt className="text-green-400" />, label: 'Privacy Policy', path: '/Privacypolicy' },
    { icon: <FaFileAlt className="text-gray-500" />, label: 'Terms & Conditions', path: '/termsandcondition' },
    { icon: <FaMoneyBillWave className="text-green-600" />, label: 'Refund Policy', path: '/refundpolicy' },
  ], []);

  const handleNavigation = useCallback((path) => {
    router.push(path);
  }, [router]);

  const handleCameraClick = useCallback(() => {
    const input = document.getElementById('profileImageInput');
    if (input) {
      input.click();
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-gray-100' 
        : 'bg-gradient-to-br from-gray-50 via-white to-emerald-50 text-gray-900'
    }`}>
      <div className="page-content">

      {/* Header Section */}
      <div className={`relative w-full rounded-3xl pt-10 pb-20 mt-16 ${
        isDark 
          ? 'bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900' 
          : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600'
      }`}>
        {/* Dynamic Grid Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: isDark 
              ? 'linear-gradient(rgba(100, 13, 20, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 13, 20, 0.25) 1px, transparent 1px)'
              : 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage:
              'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 70%)',
          }}
        ></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <FaUserCog className="text-white text-3xl md:text-4xl" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Account Settings
          </h1>
          <p className="text-green-100 max-w-lg mx-auto">
            Manage your profile and account preferences
          </p>
        </div>
      </div> 

        <main className="relative z-10 -mt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className={`backdrop-blur-sm shadow-2xl rounded-2xl p-8 md:p-10 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
          : 'bg-gradient-to-br from-gray-100/20 to-gray-300 border border-gray-200'
      }`}>
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-green-500/30">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${
                    isDark 
                      ? 'text-green-100 bg-gray-800' 
                      : 'text-green-600 bg-gray-100'
                  }`}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                {/* <button
                  className="absolute -bottom-2 right-0 bg-green-600 hover:bg-green-500 text-white rounded-full p-2 shadow-lg transition-all duration-300 transform hover:scale-110"
                  onClick={handleCameraClick}
                >
                  <FaCamera className="text-sm" />
                </button> */}
                <input
                  type="file"
                  id="profileImageInput"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <h2 className={`text-2xl font-bold mt-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{user?.name || 'User'}</h2>
            <p className={`mt-1 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {user?.phone || user?.email || 'No contact information'}
            </p>
            {user?.role && (
              <p className={`mt-1 text-sm ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                Role: {user.role}
              </p>
            )}
          </div>

          {/* Settings List */}
          <div className="space-y-6">
            {settingItems.map((item, index) => (
              <div
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center p-2 px-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700 hover:border-gray-600' 
                    : 'bg-gray-100/50 hover:bg-gray-200/70 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  {item.icon}
                </div>
                <span className={`flex-1 text-sm font-medium ${
                  isDark ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {item.label}
                </span>
                <svg
                  className={`w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            ))}

            {/* Logout Button */}
            <div
              onClick={handleLogout}
              className={`flex items-center py-2 px-3 rounded-xl cursor-pointer transition-all duration-300 mt-8 ${
                isDark 
                  ? 'bg-red-900/30 hover:bg-red-900/50 border border-red-900/50 hover:border-red-800/70' 
                  : 'bg-red-100/50 hover:bg-red-200/50 border border-red-200/50 hover:border-red-300/70'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
                isDark ? 'bg-red-900/50' : 'bg-red-100/50'
              }`}>
                <FaSignOutAlt className={isDark ? 'text-red-400' : 'text-red-500'} />
              </div>
              <span className={`flex-1 font-medium ${
                isDark ? 'text-red-300' : 'text-red-600'
              }`}>Logout</span>
              <svg
                className={`w-5 h-5 ${
                  isDark ? 'text-red-400' : 'text-red-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
          </div>
        </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
