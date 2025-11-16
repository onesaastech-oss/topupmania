"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaGift, FaCheckCircle } from "react-icons/fa";
import Footer from "@/components/Footer";

export default function RedeemCodePage() {
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate redeem logic
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
    setCode("");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-gray-100' 
        : 'bg-gradient-to-br from-gray-50 via-white to-emerald-50 text-gray-900'
    }`}>
      
      {/* Banner Section */}
      <section className={`relative w-full rounded-b-3xl min-h-[280px] md:min-h-[280px] overflow-hidden mt-16 flex items-center justify-center ${
        isDark 
          ? 'bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900' 
          : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600'
      }`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, #AA424A 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}></div>
        <div className="text-center">
          <div className="flex flex-col items-center space-y-4">
            <FaGift className="text-white text-4xl sm:text-5xl" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Redeem Code</h1>
            <p className="text-emerald-100">Enter your code below to claim your rewards</p>
          </div>
        </div>
      
      </section>
      <main className="relative z-10 -mt-16 pb-24 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <div className={`backdrop-blur-sm shadow-2xl rounded-2xl p-8 md:p-10 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
        }`}>
          

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`} htmlFor="redeem-code">
                Enter Voucher Code
              </label>
              <div className="relative text-sm">
                <input
                  id="redeem-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your voucher code"
                  className={`w-full rounded-lg px-2 py-4 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => navigator.clipboard.readText().then(text => setCode(text))}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded transition-colors ${
                    isDark 
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Paste
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl text-white font-semibold text-lg shadow-md transition-all duration-300 bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900  hover:from-green-600 hover:to-teal-500 hover:shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5 cursor-pointer active:scale-95"
            >
              Redeem Code
            </button>
          </form>

          {success && (
            <div className={`mt-6 p-4 rounded-lg flex items-center justify-center space-x-2 animate-fade-in ${
              isDark 
                ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                : 'bg-green-100 border border-green-300 text-green-600'
            }`}>
              <FaCheckCircle className="text-xl" />
              <span>Code redeemed successfully! Your rewards have been added to your account.</span>
            </div>
          )}

          <div className={`mt-8 pt-6 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h3 className={`font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>How to redeem:</h3>
            <ul className={`space-y-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 bg-green-500 rounded-full text-center text-sm mr-2 flex-shrink-0">1</span>
                <span>Enter your voucher code in the field above</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 bg-green-500 rounded-full text-center text-sm mr-2 flex-shrink-0">2</span>
                <span>Click "Redeem Code" to validate</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 bg-green-500 rounded-full text-center text-sm mr-2 flex-shrink-0">3</span>
                <span>Your rewards will be added to your account instantly</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
