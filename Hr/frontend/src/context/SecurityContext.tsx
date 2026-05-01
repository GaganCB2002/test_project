import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface SecurityContextType {
  lastActivity: number;
  isSessionActive: boolean;
  refreshSession: () => void;
  terminateSession: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode, onLogout: () => void }> = ({ children, onLogout }) => {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isSessionActive, setIsSessionActive] = useState(true);
  const navigate = useNavigate();

  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

  const terminateSession = useCallback(() => {
    setIsSessionActive(false);
    onLogout();
    navigate('/login');
    console.warn('[SECURITY] Session terminated due to inactivity or protocol breach.');
  }, [onLogout, navigate]);

  const refreshSession = useCallback(() => {
    setLastActivity(Date.now());
    setIsSessionActive(true);
  }, []);

  useEffect(() => {
    const handleActivity = () => refreshSession();
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [refreshSession]);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        terminateSession();
      }
    }, 10000); // Check more frequently (every 10s) but with a stable effect

    return () => clearInterval(checkInterval);
  }, [lastActivity, terminateSession]);

  return (
    <SecurityContext.Provider value={{ lastActivity, isSessionActive, refreshSession, terminateSession }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
