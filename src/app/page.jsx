"use client";

import HeroSlider from "@/components/HeroSlider";
import Footer from "@/components/Footer";
import GamesMarquee from "@/components/GamesMarquee";
import ProductGrid from "@/components/ProductGrid";
import "../app/global.css";
import { FaPlus, FaGift, FaAward } from "react-icons/fa";
import { useRouter } from "next/navigation";
// Removed import games from "@/data/games.js"; - now using API
import Bottomslider from "@/components/Bottomslider";
import Bottomproductcard from "@/components/Bottomproductcard";
import { useModal } from "@/context/ModalContext";
import { useState, useRef, useEffect } from "react";
import Button3D from "@/components/Button3D";
import PopupModal from "@/components/PopupModal";

// ✅ Parallax WaveTopSection
const WaveTopSection = ({ children, className = "" }) => {
  return (
    <div className={`relative w-full h-[500px] ${className}`}>
      {/* Fixed background */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-r from-emerald-400 to-emerald-500 z-0">
        {/* Section Content */}
        <div className="relative z-10">{children}</div>

        {/* Static Wave at bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none text-white dark:text-gray-900">
          <svg
            className="relative block w-full h-16 md:h-20 lg:h-24"
            viewBox="0 0 1440 150"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 Q720,150 1440,0 L1440,150 L0,150 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};


export default function HomePage() {
  const router = useRouter();
  const { openAddMoney } = useModal();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const productSectionRef = useRef(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Wave Top Section containing Hero content */}
      <WaveTopSection>
        {/* Hero content */}
        <div className="pt-24 pb-8">
          <HeroSlider />

          {/* Action buttons */}
       <Button3D/>


        </div>
      </WaveTopSection>

      {/* Main content */}
      <main className="flex-1 relative z-10 bg-white dark:bg-gray-900">
        <div className="flex flex-col min-h-full">

          {/* Products Section */}
          <div className="container mx-auto max-w-7xl pt-8">
            <ProductGrid
              title="Our Products"
              fetchFromApi={true}
              isFullScreen={isFullScreen}
              productSectionRef={productSectionRef}
            />
          </div>

          {/* Bottom Slider Section */}
          <div className="w-full bg-gray-50 dark:bg-gray-900 mt-8">
            <Bottomslider />
          </div>
          <div className="w-full bg-gray-50 dark:bg-gray-900">
            <Bottomproductcard />
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <Footer />
      </div>

      {/* Popup Modal */}
      <PopupModal />

      {/* Button shine effect styles */}
      <style jsx global>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-25deg);
            opacity: 0.5;
          }
          50% {
            opacity: 0.9;
            filter: brightness(1.2);
          }
          100% {
            transform: translateX(300%) skewX(-25deg);
            opacity: 0.5;
          }
        }

        .button-container {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
          -webkit-tap-highlight-color: transparent;
        }

        .button-shine {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          opacity: 0.7;
          pointer-events: none;
          filter: blur(6px);
          animation: shine 3s infinite;
          animation-timing-function: ease-in-out;
        }

        @media (hover: none) and (pointer: coarse) {
          .button-container:active .button-shine {
            animation: shine 1.5s infinite;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

