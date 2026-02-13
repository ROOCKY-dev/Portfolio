'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type OrbState = {
  errorCount: number;
  setErrorCount: (count: number) => void;
  status: 'stable' | 'warning' | 'critical';
};

export const OrbContext = createContext<OrbState | undefined>(undefined);

export const OrbProvider = ({ children }: { children: ReactNode }) => {
  const [errorCount, setErrorCount] = useState(0);

  // Updated Ranges based on Minion Moods:
  // 0-20: Stable (Calm)
  // 21-60: Warning (Working)
  // 61+: Critical (Panic)
  const status = errorCount <= 20 ? 'stable' : errorCount <= 60 ? 'warning' : 'critical';

  return (
    <OrbContext.Provider value={{
      errorCount,
      setErrorCount,
      status: status
    }}>
      {children}
    </OrbContext.Provider>
  );
};

export const useOrb = () => {
  const context = useContext(OrbContext);
  if (!context) {
    throw new Error('useOrb must be used within OrbProvider');
  }
  return context;
};
