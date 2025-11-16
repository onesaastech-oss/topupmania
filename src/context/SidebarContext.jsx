"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => {
    console.log('Opening sidebar');
    setIsOpen(true);
  };
  
  const closeSidebar = () => {
    console.log('Closing sidebar');
    setIsOpen(false);
  };
  
  const toggleSidebar = () => {
    console.log('Toggling sidebar. Current state:', isOpen);
    setIsOpen(prev => !prev);
  };

  // Body scroll lock effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isOpen) {
        // Prevent body scroll when sidebar is open
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none'; // Prevent touch scrolling on mobile
      } else {
        // Restore body scroll when sidebar is closed
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      }
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      }
    };
  }, [isOpen]);

  // Close sidebar when route changes
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  useEffect(() => {
    closeSidebar();
  }, [pathname]);

  return (
    <SidebarContext.Provider 
      value={{ 
        isOpen, 
        openSidebar, 
        closeSidebar, 
        toggleSidebar 
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
