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
  const shockwaveRef = useRef<THREE.Mesh>(null);

  // Refs for State (avoid re-renders)
  const targetColor = useRef(new THREE.Color('#00ffff'));
  const currentColor = useRef(new THREE.Color('#00ffff'));
  const targetSpeed = useRef(0.5);
  const currentSpeed = useRef(0.5);
  const targetIntensity = useRef(3.0);
  const currentIntensity = useRef(3.0);

  // Shockwave Pulse Logic
  const pulseTime = useRef(0);
  const isPulsing = useRef(false);

  useEffect(() => {
    // Set targets based on status/errorCount
    if (status === 'stable') targetColor.current.set('#00ffff'); // Cyan
    else if (status === 'warning') targetColor.current.set('#ffaa00'); // Orange/Amber
    else targetColor.current.set('#ff0000'); // Red

    targetSpeed.current = 0.2 + (errorCount * 0.02); // Slower base speed
    targetIntensity.current = 3.0 + (errorCount * 0.1);

    // Trigger Pulse
    isPulsing.current = true;
    pulseTime.current = 0; // Reset pulse timer

  }, [status, errorCount]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // 1. Lerp Values - Slower transitions (2-3s)
    // Lerp factor of 0.8 * delta provides a smooth, slow drift
    currentColor.current.lerp(targetColor.current, delta * 0.8);
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed.current, delta * 0.5);
    currentIntensity.current = THREE.MathUtils.lerp(currentIntensity.current, targetIntensity.current, delta * 0.8);

    // 2. Rotate Group
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * currentSpeed.current * 0.2; // Slower rotation
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1; // Very gentle sway
    }

    // 3. Update Core
    if (coreRef.current) {
        const material = coreRef.current.material as THREE.MeshStandardMaterial;
        material.color.copy(currentColor.current);
        material.emissive.copy(currentColor.current);
        material.emissiveIntensity = currentIntensity.current + Math.sin(time * 2) * 0.3; // Breathing

        // Base Scale
        const baseScale = 1 + Math.sin(time * 1.5) * 0.02;
        coreRef.current.scale.set(baseScale, baseScale, baseScale);
    }

    // 4. Update Shell
    if (shellRef.current) {
        const material = shellRef.current.material as THREE.MeshBasicMaterial;
        material.color.copy(currentColor.current);
        shellRef.current.rotation.y -= delta * 0.1;
        shellRef.current.rotation.z += delta * 0.05;
    }

    // 5. Update Shockwave
    if (shockwaveRef.current) {
        if (isPulsing.current) {
            pulseTime.current += delta * 1.5; // Speed of expansion

            if (pulseTime.current < 2.0) {
                const scale = 1 + (pulseTime.current * 2); // Expand to 3x radius
                shockwaveRef.current.scale.set(scale, scale, scale);

                const material = shockwaveRef.current.material as THREE.MeshBasicMaterial;
                material.color.copy(currentColor.current);
                // Fade out: 1 -> 0
                material.opacity = Math.max(0, 1 - (pulseTime.current / 2));
                shockwaveRef.current.visible = true;
            } else {
                isPulsing.current = false;
                shockwaveRef.current.visible = false;
            }
        } else {
            shockwaveRef.current.visible = false;
        }
    }
  });

  return (
    <group ref={groupRef} scale={1.0}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          {/* Volumetric Core */}
          <mesh ref={coreRef}>
            <sphereGeometry args={[0.8, 64, 64]} /> {/* High poly core */}
            <meshStandardMaterial
              toneMapped={false}
              transparent
              opacity={0.9}
              roughness={0.3}
              metalness={0.9}
            />
          </mesh>

          {/* Outer Wireframe Shell */}
          <mesh ref={shellRef} scale={1.3}>
            <icosahedronGeometry args={[1, 4]} /> {/* High detail shell */}
            <meshBasicMaterial
                wireframe
                transparent
                opacity={0.15}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
            />
          </mesh>

           {/* Shockwave Ring (Pulse Effect) */}
           <mesh ref={shockwaveRef} visible={false}>
              {/* Use a ring geometry that faces the camera or rotates with group */}
              <ringGeometry args={[0.9, 1.0, 64]} />
              <meshBasicMaterial
                transparent
                opacity={0}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
           </mesh>

          {/* Orbiting Particles */}
          <Sparkles
            count={120}
            scale={6}
            size={6}
            speed={0.2}
            opacity={0.6}
            color="#ffffff"
          />
      </Float>

      {/* Cinematic Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={4} color="#ffffff" distance={20} decay={2} />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#0000ff" distance={20} decay={2} />
    </group>
  );
}
