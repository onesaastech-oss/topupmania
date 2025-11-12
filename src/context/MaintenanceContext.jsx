'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getMaintenanceStatus } from '@/lib/api/maintenance';

const MaintenanceContext = createContext();

export function MaintenanceProvider({ children }) {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const checkMaintenanceStatus = async () => {
    try {
      setIsLoading(true);
      const result = await getMaintenanceStatus();
      
      if (result.success) {
        setIsMaintenance(result.isMaintenance);
        setMaintenanceMessage(result.data?.message || 'Website is under maintenance');
        setLastChecked(new Date());
      } else {
        // If we can't check maintenance status, assume no maintenance
        setIsMaintenance(false);
        setMaintenanceMessage('');
      }
    } catch (error) {
      console.error('Error checking maintenance status:', error);
      setIsMaintenance(false);
      setMaintenanceMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  // Check maintenance status on mount
  useEffect(() => {
    checkMaintenanceStatus();
    
    // Check every 5 minutes
    const interval = setInterval(checkMaintenanceStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const value = {
    isMaintenance,
    maintenanceMessage,
    isLoading,
    lastChecked,
    checkMaintenanceStatus
  };

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
}
