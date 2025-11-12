"use client";
import "../app/global.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaNewspaper,
  FaHouse,
  FaGear,
  FaUsers,
  FaHeadset
} from "react-icons/fa6";
import { getTheme, setTheme, subscribeToThemeChanges } from '@/lib/utils/theme';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  {
    href: "/support",
    label: "Support",
    icon: FaHeadset,
    aria: "NeedSupport",
  },
  {
    href: "/followus",
    label: "Follow",
    icon: FaUsers,
    aria: "Contact Us",
  },
  {
    href: "/",
    label: "Home",
    icon: FaHouse,
    aria: "Home",
  },
  {
    href: "/news",
    label: "News",
    icon: FaNewspaper,
    aria: "News",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: FaGear,
    aria: "Settings",
  },
];

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
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

  const isDark = currentTheme === 'dark';

  const handleSettingsClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    router.push('/settings');
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <>
      {/* Backdrop blur overlay */}
      <div className={`static -mb-12 bottom-0 left-0 right-0 h-20 ${isDark ? 'bg-gradient-to-b from-primary-900 via-primary-800 to-gray-900' : 'bg-gradient-to-b from-primary-50 via-white to-primary-100'} pointer-events-none z-[4]`} />
      
      <nav
        className={`fixed bottom-0 left-0 right-0 mx-auto max-w-md z-[9999] h-20 rounded-t-3xl px-2 border shadow-2xl ${isDark ? 'bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 border-primary-700/70' : 'bg-gradient-to-br from-primary-50 via-white to-primary-100 border-primary-100/60'}`}
        role="navigation"
        aria-label="Bottom Navigation"
      >
        <ul className="flex items-center justify-between h-full px-3 py-2">
          {navItems.map((item, index) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            
            const renderNavItem = () => {
              const commonProps = {
                'aria-label': item.aria,
                className: `relative flex flex-col items-center justify-center w-14 h-16 transition-all duration-500 ease-out focus:outline-none group ${
                  isActive 
                    ? "text-[color:var(--text-primary)]" 
                    : `${isDark ? 'text-gray-300' : 'text-gray-700'} hover:text-[color:var(--text-primary)]`
                }`
              };

              const content = (
                <>
                  {/* Active indicator */}
                  {isActive && (
                    <>
                      {/* Floating glowing card */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-95"
                        style={{
                          background: 'radial-gradient(120% 120% at 50% 20%, var(--accent) 0%, rgba(170,66,74,0.85) 35%, rgba(100,13,20,0.4) 70%, transparent 100%)',
                          filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.25))',
                          transform: 'translateY(-6px)',
                          animation: 'floaty 3s ease-in-out infinite',
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-2xl blur-md opacity-70"
                        style={{
                          background: 'radial-gradient(100% 100% at 50% 50%, var(--accent) 0%, rgba(170,66,74,0.5) 60%, transparent 100%)',
                          transform: 'translateY(-6px)',
                          animation: 'floaty 3s ease-in-out infinite',
                        }}
                      />
                    </>
                  )}
                  
                  {/* Icon container */}
                  <div className={`relative z-10 p-1 rounded-xl transition-all duration-500 mb-1 ${
                    isActive 
                      ? 'scale-110 bg-white/10' 
                      : `hover:scale-105 ${isDark ? 'hover:bg-white/5' : 'hover:bg-primary-100/60'}`
                  }`}>
                    <Icon
                      className={`w-4 h-4 transition-all duration-500 ${
                        isActive 
                          ? 'text-white drop-shadow-lg' 
                          : `group-hover:scale-110 ${isDark ? 'text-primary-100' : 'text-primary-600'}`
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  
                  {/* Label with modern typography */}
                  <span className={`relative z-10 text-[8px] font-bold tracking-wide uppercase transition-all duration-500 ${
                    isActive 
                      ? 'text-white opacity-100 transform scale-105' 
                      : `${isDark ? 'text-primary-100/80' : 'text-primary-600/80'} opacity-80 group-hover:opacity-100`
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Hover effect */}
                  {!isActive && (
                    <div className={`absolute inset-0 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-primary-100/40'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  )}
                </>
              );

              if (item.href === '/settings') {
                return (
                  <button onClick={handleSettingsClick} {...commonProps}>
                    {content}
                  </button>
                );
              } else {
                return (
                  <Link href={item.href} {...commonProps}>
                    {content}
                  </Link>
                );
              }
            };

            return (
              <li key={item.href} className="relative">
                {renderNavItem()}
              </li>
            );
          })}
        </ul>
        
        {/* Decorative elements */}
        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-gradient-to-r from-transparent ${isDark ? 'via-white/30' : 'via-primary-300/40'} to-transparent rounded-full`} />
        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-12 h-1 bg-gradient-to-r from-transparent ${isDark ? 'via-white/20' : 'via-primary-300/30'} to-transparent rounded-full`} />
      </nav>
    </>
  );
}