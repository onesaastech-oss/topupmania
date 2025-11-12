"use client";

import { useState, useEffect } from "react";
import { useBanners } from "../context/BannerContext";

export default function PopupModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [banner, setBanner] = useState(null);
  const { getPopupBanners, loading: bannersLoading } = useBanners();

  useEffect(() => {
    const checkAndShowPopup = () => {
      // Check if popup was shown in the last 24 hours
      const lastShown = localStorage.getItem('popupLastShown');
      const now = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (lastShown && (now - parseInt(lastShown)) < twentyFourHours) {
        return; // Don't show popup if shown within 24 hours
      }

      // Get popup banners from context
      const popupBanners = getPopupBanners();
      if (popupBanners.length > 0) {
        // Use the first popup banner (already sorted by priority)
        const popupBanner = popupBanners[0];
        setBanner(popupBanner);
        setIsVisible(true);
        
        // Mark as shown with current timestamp
        localStorage.setItem('popupLastShown', now.toString());
      }
    };

    // Only check when banners are loaded
    if (!bannersLoading) {
      checkAndShowPopup();
    }
  }, [getPopupBanners, bannersLoading]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleBannerClick = () => {
    if (banner?.url) {
      window.open(banner.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (bannersLoading || !isVisible || !banner) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal */}
        <div 
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-600 rounded-full p-2 transition-colors duration-200 shadow-lg"
            aria-label="Close popup"
          >
            <svg 
              className="w-5 h-5 text-gray-600 dark:text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>

          {/* Banner Image */}
          <div 
            className="relative cursor-pointer group"
            onClick={handleBannerClick}
          >
            <img
              src={banner.image}
              alt={banner.title || 'Popup Banner'}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            
            {/* Hover overlay - only show if banner has title */}
            {banner.title && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
            )}
            
            {/* Banner Title */}
            {banner.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white text-lg font-semibold">
                  {banner.title}
                </h3>
              </div>
            )}

            {/* Click indicator */}
            {banner.url && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-white/90 dark:bg-gray-700/90 rounded-full p-3 shadow-lg">
                  <svg 
                    className="w-6 h-6 text-gray-600 dark:text-gray-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Footer with close option */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                This popup won't show again for 1 minutes
              </p> */}
              <button
                onClick={handleClose}
                className="px-4 py-3 w-full bg-emerald-500 dark:bg-gray-600 hover:bg-gray-300  dark:hover:bg-gray-500 text-gray-200 dark:text-gray-200 rounded-2xl text-sm font-medium transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
