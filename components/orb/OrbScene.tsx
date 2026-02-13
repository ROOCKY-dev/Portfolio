'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useOrb } from './OrbContext';
import * as THREE from 'three';
import { Trail } from '@react-three/drei';

type PlanetData = {
  orbitRadius: number;
  speed: number;
  axis: [number, number, number];
  id: number;
};

interface PlanetProps extends Omit<PlanetData, 'id'> {
    color: THREE.Color;
    baseSpeed: number;
}

export default function OrbScene() {
  const { errorCount, status } = useOrb();
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [planets, setPlanets] = useState<PlanetData[]>([]);

  // Colors based on status
  const targetColor = status === 'stable' ? new THREE.Color('#00ffff')
                    : status === 'warning' ? new THREE.Color('#ffaa00')
                    : new THREE.Color('#ff0000');

  const speed = 0.5 + (errorCount * 0.2);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed * 0.5;
      groupRef.current.rotation.x += delta * (speed * 0.2);
    }
    // Pulse core
    if (coreRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * (2 + errorCount * 0.5)) * 0.1;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  useEffect(() => {
      const planetCount = Math.min(3 + errorCount, 20);
      const timer = setTimeout(() => {
          const newPlanets = new Array(planetCount).fill(0).map((_, i) => ({
            orbitRadius: 1.4 + Math.random() * 0.6,
            speed: (Math.random() * 0.5 + 0.5) * (i % 2 === 0 ? 1 : -1),
            axis: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
            id: i
          }));
          setPlanets(newPlanets);
      }, 0);
      return () => clearTimeout(timer);
  }, [errorCount]);

  return (
    <group ref={groupRef}>
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color={targetColor}
          emissive={targetColor}
          emissiveIntensity={2 + errorCount * 0.2}
          toneMapped={false}
        />
      </mesh>

      {/* Wireframe Shell */}
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial color={targetColor} wireframe transparent opacity={0.2} />
      </mesh>

      {/* Planets with Trails */}
      {planets.map((p) => (
        <Planet
          key={p.id}
          {...p}
          baseSpeed={speed}
          color={targetColor}
        />
      ))}

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
}

function Planet({ orbitRadius, speed, axis, color, baseSpeed }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.rotation.z += delta * speed * baseSpeed;
    }
  });

  return (
    <group rotation={axis}>
      <group ref={groupRef}>
        <group position={[orbitRadius, 0, 0]}>
            <Trail width={1} length={6} color={color} attenuation={(t) => t * t}>
                <mesh>
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshBasicMaterial color={color} toneMapped={false} />
                </mesh>
            </Trail>
        </group>
      </group>
    </group>
  );
}
