'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Activity = 'coding' | 'browsing' | 'email' | 'discord' | 'chill' | 'offline' | 'custom';
export type Status = 'stable' | 'warning' | 'critical';

export type OrbState = {
  errorCount: number;
  setErrorCount: (count: number) => void;
  status: Status;
  activity: Activity;
  setActivity: (activity: Activity) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  customSpeed: number;
  setCustomSpeed: (speed: number) => void;
};

export const OrbContext = createContext<OrbState | undefined>(undefined);

export const OrbProvider = ({ children }: { children: ReactNode }) => {
  const [errorCount, setErrorCount] = useState(0);
  const [activity, setActivity] = useState<Activity>('coding');
  const [customColor, setCustomColor] = useState('#ffffff');
  const [customSpeed, setCustomSpeed] = useState(1.0);

  // Status logic remains based on errorCount as per original request,
  // but could be influenced by activity if needed later.
  // 0-20: Stable
  // 21-60: Warning
  // 61+: Critical
  const status: Status = errorCount <= 20 ? 'stable' : errorCount <= 60 ? 'warning' : 'critical';

  return (
    <OrbContext.Provider value={{
      errorCount,
      setErrorCount,
      status,
      activity,
      setActivity,
      customColor,
      setCustomColor,
      customSpeed,
      setCustomSpeed
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
