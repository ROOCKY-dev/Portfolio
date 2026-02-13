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

  const status = errorCount < 5 ? 'stable' : errorCount < 10 ? 'warning' : 'critical';

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
