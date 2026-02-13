'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useOrb } from './OrbContext';
import * as THREE from 'three';
import { Sparkles, Float } from '@react-three/drei';

export default function OrbScene() {
  const { errorCount, status } = useOrb();
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  // Sparkles type is tricky, removed explicit ref typing or use generic if needed
  // but we don't access sparklesRef.current so we can remove the ref or the any type

  // Refs for State (avoid re-renders)
  const targetColor = useRef(new THREE.Color('#00ffff'));
  const currentColor = useRef(new THREE.Color('#00ffff'));
  const targetSpeed = useRef(0.5);
  const currentSpeed = useRef(0.5);
  const targetIntensity = useRef(2.0);
  const currentIntensity = useRef(2.0);

  // Shockwave Pulse (One-time effect on status change)
  const pulseTime = useRef(0);
  const isPulsing = useRef(false);

  useEffect(() => {
    // Set targets based on status/errorCount
    if (status === 'stable') targetColor.current.set('#00ffff'); // Cyan
    else if (status === 'warning') targetColor.current.set('#ffaa00'); // Orange/Amber
    else targetColor.current.set('#ff0000'); // Red

    targetSpeed.current = 0.5 + (errorCount * 0.05);
    targetIntensity.current = 2.0 + (errorCount * 0.2);

    // Trigger Pulse
    isPulsing.current = true;
    pulseTime.current = 0; // Reset pulse timer

  }, [status, errorCount]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // 1. Lerp Values
    currentColor.current.lerp(targetColor.current, delta * 1.5); // Smooth color transition (2-3s approx)
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed.current, delta * 0.5);
    currentIntensity.current = THREE.MathUtils.lerp(currentIntensity.current, targetIntensity.current, delta * 1.0);

    // 2. Rotate Group
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * currentSpeed.current * 0.5;
      groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.2; // Gentle sway
    }

    // 3. Update Materials
    if (coreRef.current) {
        const material = coreRef.current.material as THREE.MeshStandardMaterial;
        material.color.copy(currentColor.current);
        material.emissive.copy(currentColor.current);
        material.emissiveIntensity = currentIntensity.current + Math.sin(time * 3) * 0.5; // Breathing

        // Pulse Logic (Shockwave scale)
        let pulseScale = 0;
        if (isPulsing.current) {
            pulseTime.current += delta;
            if (pulseTime.current < 1.0) {
                // Expand quickly then fade
                pulseScale = Math.sin(pulseTime.current * Math.PI) * 0.2;
            } else {
                isPulsing.current = false;
            }
        }

        const baseScale = 1 + Math.sin(time * 2) * 0.02;
        const finalScale = baseScale + pulseScale;
        coreRef.current.scale.set(finalScale, finalScale, finalScale);
    }

    if (shellRef.current) {
        const material = shellRef.current.material as THREE.MeshBasicMaterial;
        material.color.copy(currentColor.current);
        shellRef.current.rotation.y -= delta * 0.2;
    }

  });

  return (
    <group ref={groupRef} scale={2.8}> {/* 3x Larger Size */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          {/* Volumetric Core */}
          <mesh ref={coreRef}>
            <sphereGeometry args={[0.7, 64, 64]} />
            <meshStandardMaterial
              toneMapped={false}
              transparent
              opacity={0.9}
              roughness={0.4}
              metalness={0.8}
            />
          </mesh>

          {/* Outer Wireframe Shell */}
          <mesh ref={shellRef} scale={1.4}>
            <icosahedronGeometry args={[1, 2]} />
            <meshBasicMaterial
                wireframe
                transparent
                opacity={0.1}
                side={THREE.DoubleSide}
            />
          </mesh>

          {/* Orbiting Particles */}
          <Sparkles
            count={60}
            scale={4}
            size={3}
            speed={0.4}
            opacity={0.4}
            color="#ffffff"
          />
      </Float>

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" distance={10} decay={2} />
      <pointLight position={[-5, -5, -5]} intensity={1} color="#0000ff" distance={10} decay={2} />
    </group>
  );
}
