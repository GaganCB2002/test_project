import React, { createContext, useContext } from 'react';
import type { User, PlatformData, ActivityItem } from '../types';

interface GlobalState {
  user: User | null;
  platform: PlatformData | null;
  feed: ActivityItem[];
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<GlobalState | undefined>(undefined);

export function StoreProvider({ children, value }: { children: React.ReactNode, value: GlobalState }) {
  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
