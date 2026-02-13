'use client';

import { Canvas } from '@react-three/fiber';
import OrbScene from './OrbScene';
import { OrbContext, OrbState } from './OrbContext';
import { useContext } from 'react';

// Simple bridge component to pass context into R3F
const ContextBridge = ({ children, value }: { children: React.ReactNode, value: OrbState }) => (
  <OrbContext.Provider value={value}>
    {children}
  </OrbContext.Provider>
);

export default function StatusOrb() {
  const orbState = useContext(OrbContext);

  // If context is missing, we render nothing or handle gracefully.
  // But we expect it to be wrapped.
  if (!orbState) return null;

  return (
    <div className="w-full h-full min-h-[48px] min-w-[48px]">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ContextBridge value={orbState}>
            <OrbScene />
        </ContextBridge>
      </Canvas>
    </div>
  );
}
