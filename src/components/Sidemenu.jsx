"use client";

import { usePathname, useRouter } from 'next/navigation';
import { FaHome, FaWallet, FaTrophy, FaHistory, FaGift, FaTimes } from 'react-icons/fa';
import { FiChevronRight, FiHelpCircle, FiShield, FiSettings, FiUser, FiLogOut, FiMoon, FiFileText } from 'react-icons/fi';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { getTheme, setTheme, subscribeToThemeChanges } from '@/lib/utils/theme';

export default function Sidemenu() {
  const { isOpen, closeSidebar } = useSidebar(true);
  const { openAddMoney } = useModal();
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [currentTheme, setCurrentTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTheme(getTheme());

    const unsubscribe = subscribeToThemeChanges((theme) => {
      setCurrentTheme(theme);
    });

    return unsubscribe;
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  const isDark = currentTheme === 'dark';

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  // Theme-based classes
  const themeClasses = {
    // Sidebar backgrounds - Enhanced glassmorphism
    sidebarBg: isDark
      ? 'bg-gray-900'
      : 'bg-gray-200',
    sidebarBorder: isDark ? 'border-white/20' : 'border-white/30',

    // Text colors
    text: isDark ? 'text-white' : 'text-slate-900',
    textSecondary: isDark ? 'text-slate-200' : 'text-black',
    textMuted: isDark ? 'text-slate-300' : 'text-slate-500',
    textSubtle: isDark ? 'text-slate-400' : 'text-slate-600',

    // Interactive elements - Enhanced glassmorphism
    divider: isDark ? 'bg-white/20' : 'bg-white/30',
    itemBg: isDark ? 'bg-white/10' : 'bg-white/20',
    itemBgHover: isDark ? 'hover:bg-white/15' : 'hover:bg-white/25',
    itemBgActive: isDark ? 'bg-white/15 ring-1 ring-white/30' : 'bg-white ring-1 ring-white/40',
    itemRing: isDark ? 'ring-white/30' : 'ring-white/40',

    // Icon colors - using consistent emerald/green theme
    iconBg: isDark ? 'from-emerald-600 to-green-600' : 'from-emerald-500 to-green-500',
    iconBgSecondary: isDark ? 'from-teal-600 to-emerald-600' : 'from-teal-500 to-emerald-500',
    iconBgTertiary: isDark ? 'from-green-700 to-emerald-800' : 'from-green-600 to-emerald-600',

    // Theme toggle
    toggleBg: isDark ? 'bg-emerald-500' : 'bg-slate-600',
    toggleIconBg: isDark ? 'from-orange-400 to-yellow-500' : 'from-slate-400 to-slate-500',

    // Quick actions - using consistent theme colors
    quickActionBg1: isDark ? 'bg-gradient-to-b from-emerald-600 to-green-600' : 'bg-gradient-to-b from-emerald-500 to-green-500',
    quickActionBg2: isDark ? 'bg-gradient-to-b from-green-600 to-teal-600' : 'bg-gradient-to-b from-green-500 to-teal-500',
    quickActionBg3: isDark ? 'bg-gradient-to-b from-teal-600 to-emerald-600' : 'bg-gradient-to-b from-teal-500 to-emerald-500',

    // Footer buttons - Enhanced glassmorphism
    footerButtonBg: isDark ? 'bg-white/10' : 'bg-white/20',
    footerButtonBgHover: isDark ? 'hover:bg-white/15' : 'hover:bg-white/25',
    footerIconBg: isDark ? 'bg-white/15' : 'bg-white/25'
  };

  const primaryItems = [
    { icon: FaHome, colorKey: 'iconBg', label: 'Home', path: '/' },
    { icon: FaGift, colorKey: 'iconBgSecondary', label: 'Redeem Code', path: '/redeemcode' },
    { icon: FiHelpCircle, colorKey: 'iconBgTertiary', label: 'Help & Support', path: '/support' },
    { icon: FiShield, colorKey: 'iconBg', label: 'Privacy & Policy', path: '/Privacypolicy' },
    { icon: FiShield, colorKey: 'iconBgSecondary', label: 'Terms & Condition', path: '/termsandcondition' },
  ];

  const quickActions = [
    { icon: FiFileText, bgKey: 'iconBg', label: 'News', onClick: () => router.push('/news') },
    { icon: FaHistory, bgKey: 'iconBgSecondary', label: 'Reports', onClick: () => router.push('/purchasehistory') },
    { icon: FaTrophy, bgKey: 'iconBgTertiary', label: 'Leaderboard', onClick: () => router.push('/leaderboard') },
  ];

  const handleNavigation = (item) => {
    if (!item) return;
    if (item.path === '/add-money') {
      openAddMoney();
    } else if (item.path) {
      router.push(item.path);
    }
    closeSidebar();
  };

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      logout();
      router.push('/');
    } else {
      router.push('/login');
    }
    closeSidebar();
  };

  // Handle close button click
  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeSidebar();
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeSidebar();
  };

  // Prevent scroll events on the backdrop
  const handleBackdropWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBackdropTouchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`fixed inset-0 z-[10000] overflow-hidden transition-opacity duration-300 h-screen ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      style={{ overscrollBehavior: 'none' }}
    >
      {/* Enhanced Backdrop with stronger blur */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-[9999] ${isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={handleBackdropClick}
        onWheel={handleBackdropWheel}
        onTouchMove={handleBackdropTouchMove}
        style={{ overscrollBehavior: 'none' }}
      />

      {/* Sidebar Container */}
      <div
        className={`fixed top-4 left-4 bottom-4 w-[250px] md:w-[340px] transform transition-transform duration-300 ease-in-out z-[10000] rounded-3xl flex flex-col overflow-hidden  ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Enhanced Glassmorphism Background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Main glass layer */}
          <div className={`h-full rounded-3xl ${themeClasses.sidebarBg} backdrop-blur-2xl border ${themeClasses.sidebarBorder} ${isDark
            ? 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]'
            : 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]'
            } transition-colors duration-300`} />

          {/* Additional glass reflection layer */}
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${isDark
            ? 'from-white/5 via-transparent to-white/10'
            : 'from-white/30 via-transparent to-white/20'
            } pointer-events-none`} />

          {/* Subtle inner glow */}
          <div className={`absolute inset-0 rounded-3xl ${isDark
            ? 'bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent'
            : 'bg-gradient-to-r from-emerald-400/10 via-transparent to-transparent'
            } pointer-events-none`} />
        </div>

        {/* Enhanced Close Button with glassmorphism */}
        <button
          onClick={handleCloseClick}
          aria-label="Close sidebar"
          className={`absolute top-6 right-6 z-50 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border ${isDark ? 'bg-white/10 border-white/20 text-white/70 hover:text-white hover:bg-white/20' : 'bg-white/20 border-white/30 text-slate-600 hover:text-slate-900 hover:bg-white/30'
            }`}
        >
          <FaTimes className="text-lg" />
        </button>

        {/* Header - Compact */}
        <div className="pt-3 pb-3 px-6 flex items-center gap-3 relative z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push('/');
              closeSidebar();
            }}
            aria-label="Go to home"
            className="flex items-center gap-3 group"
          >
            <div className="text-left">
              <p className={`text-xs ${themeClasses.textMuted}`}>
                {isLoggedIn ? 'Welcome Back' : 'Welcome'}
              </p>
              <p className={`text-lg font-bold tracking-tight ${themeClasses.text}`}>
                {isLoggedIn ? (user?.name || 'User') : 'Guest'}
              </p>
            </div>
          </button>
        </div>

        {/* Divider */}
        {/* <div className="px-6 relative z-10">
          <div className={`w-full h-px ${themeClasses.divider} mb-3 transition-colors duration-300`} />
        </div> */}

        {/* All Items in Single Navigation Section with Equal Spacing */}
        <div className="flex-1 flex flex-col relative z-10 px-4">
          <nav className="flex-1 flex flex-col justify-between py-4">
            {/* Regular Navigation Items */}
            {primaryItems.map((item) => {
              const ActiveIcon = item.icon;
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item)}
                  className={`group w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-all duration-200 hover:translate-x-1 backdrop-blur-sm border ${isActive
                    ? `${themeClasses.itemBgActive} border-white/30`
                    : `${themeClasses.itemBgHover} border-transparent hover:border-white/20`
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`relative inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br ${themeClasses[item.colorKey]} text-white ring-1 ${themeClasses.itemRing} group-hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.6)] transition-all duration-300 shadow-[0px_0px_8px_2px_rgba(0,_0,_0,_0.3)]`}>
                      <span className="absolute inset-0 rounded-lg bg-white/10 blur-[1px] opacity-60 mix-blend-overlay pointer-events-none" />
                      <span className="absolute -top-0.5 left-0.5 w-2/3 h-0.5 rounded-full bg-white/30 opacity-40 blur-[1px] pointer-events-none" />
                      <ActiveIcon className="text-xs drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
                    </span>
                    <span className={`text-xs ${themeClasses.textSecondary}`}>{item.label}</span>
                  </div>
                  <FiChevronRight className={`text-xs ${themeClasses.textSubtle} group-hover:${themeClasses.text} transition-colors duration-200`} />
                </button>
              );
            })}


            {/* Dark Mode Toggle as Navigation Item */}
            <div className={`flex items-center justify-between rounded-xl px-3 py-2 ${themeClasses.itemBg} ring-1 ${themeClasses.itemRing} backdrop-blur-sm border border-white/20 transition-colors duration-300`}>
              <div className="flex items-center gap-2.5">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br ${themeClasses.iconBgTertiary} text-white transition-colors duration-300`}>
                  <FiMoon className="text-xs" />
                </span>
                <span className={`text-xs ${themeClasses.textSecondary}`}>Dark Mode</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${themeClasses.toggleBg}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isDark ? 'translate-x-4' : 'translate-x-0.5'}`}></span>
              </button>
            </div>

            {/* Quick Actions as Navigation Item */}
            <div className="flex items-center justify-around gap-3 px-3 py-2">
              {quickActions.map((qa) => (
                <button key={qa.label} onClick={qa.onClick} className="flex flex-col items-center gap-1.5">
                  <div className={`relative w-8 h-8 rounded-xl bg-gradient-to-br ${themeClasses[qa.bgKey]} text-white grid place-items-center ring-1 ring-white/15 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.6)] hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.7)] transition-all duration-300 will-change-transform hover:-translate-y-0.5`}>
                    <span className="absolute inset-0 rounded-xl bg-white/10 opacity-50 blur-[1px] mix-blend-overlay pointer-events-none" />
                    <span className="absolute -top-0.5 left-0.5 w-2/3 h-0.5 rounded-full bg-white/30 opacity-50 blur-[1px] pointer-events-none" />
                    <qa.icon className="text-xs drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
                  </div>
                  <span className={`text-xs ${themeClasses.textSubtle}`}>{qa.label}</span>
                </button>
              ))}
            </div>



            {/* Account as Navigation Item */}
            <button
              onClick={() => handleNavigation({ path: '/myaccount' })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 hover:translate-x-1 backdrop-blur-sm border border-transparent hover:border-white/20 ${themeClasses.itemBgHover}`}
            >
              <div className="flex items-center gap-3">
                <span className={`relative inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br ${themeClasses.iconBg} text-white ring-1 ${themeClasses.itemRing} transition-colors duration-200`}>
                  <span className="absolute inset-0 rounded-lg bg-white/10 blur-[1px] opacity-60 mix-blend-overlay pointer-events-none" />
                  <span className="absolute -top-0.5 left-0.5 w-2/3 h-0.5 rounded-full bg-white/30 opacity-40 blur-[1px] pointer-events-none" />
                  <FiUser className="text-xs drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
                </span>
                <span className={`text-xs ${themeClasses.textSecondary}`}>Account</span>
              </div>
              <FiChevronRight className={`text-xs ${themeClasses.textSubtle} group-hover:${themeClasses.text} transition-colors duration-200`} />
            </button>

            {/* Settings as Navigation Item */}
            <button
              onClick={() => handleNavigation({ path: '/settings' })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 hover:translate-x-1 backdrop-blur-sm border border-transparent hover:border-white/20 ${themeClasses.itemBgHover}`}
            >
              <div className="flex items-center gap-3">
                <span className={`relative inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br ${themeClasses.iconBgSecondary} text-white ring-1 ${themeClasses.itemRing} transition-colors duration-200`}>
                  <span className="absolute inset-0 rounded-lg bg-white/10 blur-[1px] opacity-60 mix-blend-overlay pointer-events-none" />
                  <span className="absolute -top-0.5 left-0.5 w-2/3 h-0.5 rounded-full bg-white/30 opacity-40 blur-[1px] pointer-events-none" />
                  <FiSettings className="text-xs drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
                </span>
                <span className={`text-xs ${themeClasses.textSecondary}`}>Settings</span>
              </div>
              <FiChevronRight className={`text-xs ${themeClasses.textSubtle} group-hover:${themeClasses.text} transition-colors duration-200`} />
            </button>

            {/* Log In/Out as Navigation Item */}
            <button
              onClick={handleLoginLogout}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 hover:translate-x-1 backdrop-blur-sm border border-transparent hover:border-white/20 ${themeClasses.itemBgHover}`}
            >
              <div className="flex items-center gap-3">
                <span className={`relative inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br ${themeClasses.iconBgTertiary} text-white ring-1 ${themeClasses.itemRing} transition-colors duration-200`}>
                  <span className="absolute inset-0 rounded-lg bg-white/10 blur-[1px] opacity-60 mix-blend-overlay pointer-events-none" />
                  <span className="absolute -top-0.5 left-0.5 w-2/3 h-0.5 rounded-full bg-white/30 opacity-40 blur-[1px] pointer-events-none" />
                  <FiLogOut className={`text-xs drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] ${isDark ? 'text-rose-400' : 'text-rose-500'}`} />
                </span>
                <span className={`text-xs ${themeClasses.textSecondary}`}>
                  {isLoggedIn ? 'Log Out' : 'Log In'}
                </span>
              </div>
              <FiChevronRight className={`text-xs ${themeClasses.textSubtle} group-hover:${themeClasses.text} transition-colors duration-200`} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}