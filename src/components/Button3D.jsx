"use client"
import React from 'react';
import { Plus, Award, Gift, FileText } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const Button3D = () => {
  const { openAddMoney } = useModal();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  
  // Vibration function
  const triggerVibration = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50); // Vibrate for 50ms
    }
  };
  
  const handleAddMoneyClick = () => {
    console.log('Add Money button clicked in Button3D');
    triggerVibration();
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    openAddMoney();
  };

  const handleButtonClick = (action) => {
    triggerVibration();
    action();
  };

  return (
    <div className="flex items-center justify-center mt-6">
      <div className="flex flex-row justify-center gap-2 sm:gap-4 md:gap-6 px-2 w-full max-w-sm sm:max-w-md md:max-w-lg">
        {[
          { label: "Add Money", icon: <Plus size={18} strokeWidth={2.5} />, onClick: handleAddMoneyClick, color: "emerald" },
          { label: "Leaderboard", icon: <Award size={18} strokeWidth={2.5} />, onClick: () => handleButtonClick(() => router.push("/leaderboard")), color: "amber" },
          { label: "Report", icon: <FileText size={18} strokeWidth={2.5} />, onClick: () => handleButtonClick(() => router.push("/purchasehistory")), color: "blue" },
          { label: "Redeem Code", icon: <Gift size={18} strokeWidth={2.5} />, onClick: () => handleButtonClick(() => router.push("/redeemcode")), color: "purple" },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center group flex-1 min-w-0" onClick={item.onClick}>
            <div className="relative transform transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1">
              {/* Enhanced shadow system - smaller */}
              <div className="absolute top-3 left-1 w-12 h-12 rounded-xl bg-black/50 blur-lg transform rotate-1 scale-90"></div>
              
              {/* Outer glow - smaller */}
              <div className={`absolute -inset-1 rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-all duration-300 ${
                item.color === 'emerald' ? 'bg-emerald-400/40' :
                item.color === 'amber' ? 'bg-amber-400/40' : 
                item.color === 'purple' ? 'bg-purple-400/40' : 'bg-blue-400/40'
              }`}></div>
              
              {/* Main button - smaller */}
              <button
                className="relative w-12 h-12 rounded-xl transform transition-all duration-150 ease-out
                           
                           shadow-[0_4px_0px_rgba(0,0,0,0.2),0_8px_10px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
                           hover:shadow-[0_2px_0px_rgba(0,0,0,0.8),0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]
                           active:translate-y-1 active:shadow-[0_1px_0px_rgba(0,0,0,0.9),0_2px_6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)]
                           flex items-center justify-center 
                           border border-slate-500/30 hover:border-slate-400/40
                           overflow-hidden"
              >
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60"></div>
                
                {/* Top shine - smaller */}
                <div className="absolute inset-x-1 top-1 h-2 rounded-t-lg bg-gradient-to-b from-white/20 to-transparent"></div>
                
                {/* Side highlights - smaller */}
                <div className="absolute left-1 inset-y-1 w-1.5 rounded-l-lg bg-gradient-to-r from-white/10 to-transparent"></div>
                
                {/* Icon container with enhanced glow */}
                <div className="relative z-10 flex items-center justify-center">
                  <span className="transition-all duration-200 transform group-hover:scale-110 text-white group-hover:text-white/90 filter drop-shadow-sm">
                    {item.icon}
                  </span>
                  
                  {/* Icon glow effect - smaller */}
                  <div className={`absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300 ${
                    item.color === 'emerald' ? 'bg-emerald-400/30' :
                    item.color === 'amber' ? 'bg-amber-400/30' : 
                    item.color === 'purple' ? 'bg-purple-400/30' : 'bg-blue-400/30'
                  }`}></div>
                </div>
                
                {/* Bottom edge definition - smaller */}
                <div className="absolute bottom-0 left-1 right-1 h-0.5 rounded-b-lg bg-gradient-to-b from-transparent to-black/40"></div>
                
                {/* Subtle side panels for 3D effect - smaller */}
                <div className="absolute -right-0.5 top-0.5 bottom-1 w-0.5 bg-slate-800/80 rounded-r transform skew-y-1"></div>
                <div className="absolute -bottom-0.5 left-0.5 right-1 h-0.5 bg-slate-800/80 rounded-b transform skew-x-1"></div>
                
                {/* Interactive ripple effect */}
                <div className={`absolute inset-0 rounded-xl opacity-0 group-active:opacity-30 transition-opacity duration-150 ${
                  item.color === 'emerald' ? 'bg-emerald-400/20' :
                  item.color === 'amber' ? 'bg-amber-400/20' : 
                  item.color === 'purple' ? 'bg-purple-400/20' : 'bg-blue-400/20'
                }`}></div>
              </button>
              
              {/* Floating sparkle particles - smaller */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-0.5 h-0.5 rounded-full animate-bounce ${
                      item.color === 'emerald' ? 'bg-emerald-300' :
                      item.color === 'amber' ? 'bg-amber-300' : 
                      item.color === 'purple' ? 'bg-purple-300' : 'bg-blue-300'
                    }`}
                    style={{
                      top: `${25 + i * 35}%`,
                      left: `${20 + i * 40}%`,
                      animationDelay: `${i * 300}ms`,
                      animationDuration: '1.5s'
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Refined label - smaller text with responsive sizing */}
            <span className={`mt-2 text-xs sm:text-xs font-semibold tracking-wide transition-all duration-200 text-center leading-tight ${
              item.color === 'emerald' ? 'text-white group-hover:text-emerald-300' :
              item.color === 'amber' ? 'text-white group-hover:text-amber-300' : 
              item.color === 'purple' ? 'text-white group-hover:text-purple-300' :
              'text-white group-hover:text-blue-300'
            } relative`}>
              <span className="block whitespace-nowrap overflow-hidden text-ellipsis">
                {item.label}
              </span>
              {/* Subtle text shadow */}
              <span className="absolute inset-0 text-gray-700 transform translate-x-0.3 translate-y-0.3 -z-10">
                {item.label}
              </span>
            </span>
          </div>
        ))}
      </div>
      
      {/* Refined ambient lighting - smaller */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-emerald-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-purple-500/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-amber-500/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-500/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '6s'}}></div>
      </div>
    </div>
  );
};

export default Button3D;