"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { getPublicBanners } from '../lib/api/banners';

const BannerContext = createContext();

export const useBanners = () => {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error('useBanners must be used within a BannerProvider');
  }
  return context;
};

export const BannerProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getPublicBanners();
        
        if (response.success && response.banners) {
          setBanners(response.banners);
        } else {
          setBanners([]);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
        setError(err.message);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Helper functions to get banners by type
  const getBannersByType = (type) => {
    return banners.filter(banner => banner.type === type);
  };

  const getPrimaryBanners = () => {
    return getBannersByType('primary banner').sort((a, b) => a.priority - b.priority);
  };

  const getSecondaryBanners = () => {
    return getBannersByType('secondary banner').sort((a, b) => a.priority - b.priority);
  };

  const getPopupBanners = () => {
    return getBannersByType('pop up').sort((a, b) => a.priority - b.priority);
  };

  const value = {
    banners,
    loading,
    error,
    getBannersByType,
    getPrimaryBanners,
    getSecondaryBanners,
    getPopupBanners,
  };

  return (
    <BannerContext.Provider value={value}>
      {children}
    </BannerContext.Provider>
  );
};
