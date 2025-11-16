"use client";

import Footer from "@/components/Footer";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaTelegram } from "react-icons/fa";
import { useState, useEffect } from "react";

const socialLinks = [
  {
    name: "Facebook Page",
    url: "https://www.facebook.com/topupmania.fb",
    icon: FaFacebook,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500",
    hoverColor: "hover:bg-blue-600"
  },
  {
    name: "Instagram Page", 
    url: "https://www.instagram.com/topupmania_?igsh=MTdsYzBhNGg5MnE4bQ==",
    icon: FaInstagram,
    color: "from-pink-500 via-purple-500 to-orange-500",
    bgColor: "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500",
    hoverColor: "hover:from-pink-600 hover:via-purple-600 hover:to-orange-600"
  },
  {
    name: "WhatsApp Channel",
    url: "https://whatsapp.com/channel/0029VapeuCHHbFV1MPDEnR26", 
    icon: FaWhatsapp,
    color: "from-whatsapp-500 to-whatsapp-600",
    bgColor: "bg-whatsapp",
    hoverColor: "hover:bg-whatsapp-600"
  },
  {
    name: "YouTube Channel",
    url: "https://youtube.com/@topupmania?si=bLXuzFfbbJcSmvnX",
    icon: FaYoutube, 
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-500",
    hoverColor: "hover:bg-red-600"
  },
  {
    name: "Telegram Channel",
    url: "https://t.me/Topupmaniacs",
    icon: FaTelegram, 
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500",
    hoverColor: "hover:bg-blue-600"
  },
];

export default function FollowUsPage() {
  const [isDark, setIsDark] = useState(false);

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
    <div className={`min-h-screen transition-colors duration-300 relative ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-gray-100' 
        : 'bg-gradient-to-br from-gray-50 via-white to-emerald-50 text-gray-900'
    }`}>

      <main className="relative z-10">
        {/* Modern Hero Banner */}
        <section className={`relative w-full rounded-b-3xl min-h-[280px] md:min-h-[280px] overflow-hidden mt-16 ${
          isDark 
            ? 'bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900' 
            : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600'
        }`}>
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(170, 66, 74, 0.8) 0%, transparent 50%),
              linear-gradient(135deg, rgba(100, 13, 20, 0.6) 0%, transparent 70%),
              linear-gradient(225deg, rgba(170, 66, 74, 0.35) 0%, transparent 50%),
              url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23AA424A' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")
            `,
            animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }} />
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center py-12">
            <div className={`inline-block px-4 py-2 mb-4 text-sm font-medium rounded-full backdrop-blur-sm border ${
              isDark 
                ? 'text-emerald-100 bg-emerald-800/50 border-emerald-700/50' 
                : 'text-emerald-50 bg-emerald-700/50 border-emerald-600/50'
            }`}>
              Join Our Community
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
              Stay Connected
            </h1>
            <p className="max-w-2xl mx-auto text-base md:text-xl text-emerald-100/90">
              Follow us on social media for the latest updates, gaming content, and exclusive offers!
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.slice(0, 3).map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full border flex items-center justify-center text-emerald-100 hover:scale-110 transition-all duration-300 ${
                      isDark 
                        ? 'bg-emerald-800/50 border-emerald-700/50 hover:bg-emerald-700/70' 
                        : 'bg-emerald-700/50 border-emerald-600/50 hover:bg-emerald-600/70'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Decorative elements */}
          {/* <div className={`absolute bottom-1 left-0 right-0 h-12 bg-gradient-to-t ${
            isDark 
              ? 'from-gray-900 via-gray-900/90 to-transparent' 
              : 'from-gray-50 via-gray-50/90 to-transparent'
          }`}></div> */}
        </section>

        {/* Main Content Card */}
        <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10 pb-24">
          <div className={`rounded-2xl shadow-2xl backdrop-blur-sm p-6 md:p-8 mb-8 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50' 
              : 'bg-gradient-to-br from-gray-100/20 to-gray-300 border border-gray-200'
          }`}>
            {/* Social Media Section */}
            <div className="mt-8">
          <div className="text-center mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
              isDark 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500'
            }`}>
              Our Social Channels
            </h2>
            <p className={`max-w-2xl mx-auto  text-sm ${
              isDark ? 'text-emerald-100/80' : 'text-emerald-700/80'
            }`}>
              Connect with us across platforms to never miss an update, event, or exclusive content.
            </p>
          </div>

          {/* Social Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-5xl mx-auto">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative overflow-hidden rounded-2xl backdrop-blur-sm p-4 py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-emerald-500/50 ${social.hoverColor} ${
                    isDark 
                      ? 'bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700/50 hover:shadow-emerald-900/20' 
                      : 'bg-gradient-to-br from-white/70 to-gray-50/70 border border-gray-200/100 hover:shadow-emerald-500/20'
                  }`}
                >
                  {/* Background gradient effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r ${social.color}`} />
                  
                  <div className="relative z-10 flex items-center space-x-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full ${social.bgColor} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-emerald-500/20 flex-shrink-0 aspect-square`}>
  <Icon className="w-6 h-6 text-white flex-shrink-0" />
</div>
                    
                    {/* Text */}
                    <div className="flex-1">
                      <h3 className={`font-bold mb-1 transition-colors text-sm ${
                        isDark 
                          ? 'text-white group-hover:text-emerald-300' 
                          : 'text-gray-900 group-hover:text-emerald-600'
                      }`}>
                        {social.name}
                      </h3>
                      <p className={`text-xs transition-colors ${
                        isDark 
                          ? 'text-emerald-100/70 group-hover:text-emerald-100' 
                          : 'text-emerald-700/70 group-hover:text-emerald-600'
                      }`}>
                        {social.url.replace('https://', '')}
                      </p>
                    </div>
                    
                    {/* Arrow indicator */}
                    <div className={`transition-colors ${
                      isDark ? 'text-gray-500 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r ${social.color}`} />
                </Link>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className={`rounded-2xl p-3 ${
              isDark 
                ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30' 
                : 'bg-gradient-to-r from-purple-600/50 to-blue-600/50 border border-purple-400/30'
            }`}>
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Level Up?
              </h3>
              <p className={`mb-6  mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-100'
              }`}>
                Join thousands of gamers who are already part of our community. Get exclusive content, 
                early access to features, and connect with fellow gaming enthusiasts!
              </p>
              <div className="flex flex-wrap justify-around gap-3 gap-y-5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-6 py-3 rounded-full ${social.bgColor} text-white font-semibold hover:scale-105 transition-transform duration-200 flex items-center space-x-2 shadow-lg`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>Follow</span>
                    </Link>
                  );
                })}
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
