"use client";

import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { FaCoins, FaRightToBracket } from "react-icons/fa6";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { getTheme, setTheme, subscribeToThemeChanges } from '@/lib/utils/theme';

export default function HeaderBar() {
  const { toggleSidebar } = useSidebar();
  const { openAddMoney } = useModal();
  const { user, logout, isLoggedIn } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Theme management
  useEffect(() => {
    setMounted(true);
    setCurrentTheme(getTheme());

    const unsubscribe = subscribeToThemeChanges((theme) => {
      setCurrentTheme(theme);
    });

    return unsubscribe;
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = currentTheme === 'dark';

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  const navigateToAccount = () => {
    router.push('/myaccount');
    setIsMenuOpen(false);
  };
  return (
    <div className={`w-full fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300 px-4 py-0 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 relative">

        {/* Left side - Menu button and Logo */}
        <div className="flex items-center gap-2">
          <div className="menuContainer flex justify-center items-center pt- m-auto"
               style={{
                 filter: 'drop-shadow(0 4px 12px rgba(255, 221, 87, 0.4)) drop-shadow(0 2px 6px rgba(170, 66, 74, 0.3))'
               }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }}
              className="flex items-center justify-center p-2 rounded-full text-white hover:text-yellow-100 transition-all duration-300 border-none cursor-pointer hover:scale-105"
              style={{
                boxShadow: '0 6px 24px rgba(255, 221, 87, 0.25), 0 3px 12px rgba(170, 66, 74, 0.2), 0 1px 6px rgba(255, 111, 97, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.2)',
                background: 'linear-gradient(145deg, #AA424A, #640D14)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transform: 'perspective(1000px) rotateX(5deg)',
                transformOrigin: 'center bottom'
              }}
              aria-label="Toggle menu"
            >
              <FaBars className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3" onClick={() => router.push('/')}>
            <picture>
              <source 
                srcSet={isDark ? '/images/logo-dark.webp' : '/images/logo-light.webp'} 
                type="image/webp" 
              />
              <Image
                src={isDark ? '/images/logo-dark.png' : '/images/logo-light.png'}
                alt="Logo"
                width={90}
                height={90}
                priority
                className="cursor-pointer"
              />
            </picture>
          </div>
        </div>

        {/* Right side - Wallet and Profile */}
        <div className="flex items-center gap-4 ml-auto">

          {/* Wallet/Coins Button */}
          <div style={{
          }}>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  router.push('/login');
                  return;
                }
                openAddMoney();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 border-none cursor-pointer group"
              style={{
                boxShadow: '0 6px 24px rgba(255, 221, 87, 0.25), 0 3px 12px rgba(170, 66, 74, 0.2), 0 1px 6px rgba(255, 111, 97, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.2)',
                background: 'linear-gradient(145deg, #AA424A, #640D14)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transform: 'perspective(1000px) rotateX(5deg)',
                transformOrigin: 'center bottom'
              }}
              aria-label="Wallet"
            >
              <FaCoins
                className="w-5 h-5 text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300"
              />
              <div className="flex flex-col items-start">
                <span className="text-sm text-white font-bold leading-none mt-0.5">
                  ₹{user?.walletBalance?.toFixed(2) || '0.00'}
                </span>
              </div>
            </button>
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={menuRef} style={{
            filter: isMenuOpen 
              ? 'drop-shadow(0 3px 10px rgba(255, 111, 97, 0.4)) drop-shadow(0 1px 5px rgba(255, 221, 87, 0.3))'
              : 'drop-shadow(0 3px 10px rgba(170, 66, 74, 0.4)) drop-shadow(0 1px 5px rgba(255, 221, 87, 0.2))'
          }}>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  router.push('/login');
                  return;
                }
                toggleMenu();
              }}
              className={`w-10 h-10 rounded-full ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} border flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 p-0 m-0 overflow-hidden`}

              aria-label={isLoggedIn ? "User menu" : "Login"}
              aria-expanded={isLoggedIn ? isMenuOpen : false}
            >
              {isLoggedIn ? (
                user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                )
              ) : (
                <FaRightToBracket className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              )}
            </button>

            {/* Dropdown Menu */}
            {isLoggedIn && isMenuOpen && (
              <div >
                <div 
                  className={`absolute right-0 mt-2 w-56 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} z-50 overflow-hidden transition-all duration-200 border ${isDark ? 'border-gray-600' : 'border-green-500/20'}`}
                >
                <div className="py-1">
                  {/* User Info */}
                  {/* {user && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">{user.name || 'User'}</p>
                          <p className="text-xs text-gray-500">{user.email || user.phone}</p>
                        </div>
                      </div>
                    </div>
                  )} */}

                  <button
                    onClick={navigateToAccount}
                    className={`w-full text-left px-4 py-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'} flex items-center bg-transparent border-none cursor-pointer transition-all duration-150 ${isDark ? 'hover:bg-gray-700 hover:text-white' : 'hover:bg-green-50 hover:text-green-800'}`}
                  >
                    <FaUserCircle className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                    My Account
                  </button>

                  <div className={`border-t ${isDark ? 'border-gray-600' : 'border-gray-100'} my-1`}></div>

                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-3 text-sm ${isDark ? 'text-red-400' : 'text-red-600'} flex items-center bg-transparent border-none cursor-pointer transition-all duration-150 ${isDark ? 'hover:bg-red-900/20 hover:text-red-300' : 'hover:bg-red-50 hover:text-red-800'}`}
                  >
                    <FaSignOutAlt className="mr-3" />
                    Sign out
                  </button>
                </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}