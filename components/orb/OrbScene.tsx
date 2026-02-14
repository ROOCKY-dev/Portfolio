'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useOrb } from './OrbContext';
import * as THREE from 'three';
import { Sparkles, Float } from '@react-three/drei';

export default function OrbScene() {
  const { errorCount, status } = useOrb();
  const groupRef = useRef<THREE.Group>(null);

  // Refs for core and rings
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
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

    targetSpeed.current = 0.5 + (errorCount * 0.05); // Faster base speed
    targetIntensity.current = 2.0 + (errorCount * 0.2);

    // Trigger Pulse
    if (status !== 'stable') {
        isPulsing.current = true;
        pulseTime.current = 0; // Reset pulse timer
    }

  }, [status, errorCount]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // 1. Lerp Values
    currentColor.current.lerp(targetColor.current, delta * 2.0);
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed.current, delta * 0.5);
    currentIntensity.current = THREE.MathUtils.lerp(currentIntensity.current, targetIntensity.current, delta * 0.8);

    // 2. Rotate Group (General drift)
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
    }

    // 3. Update Core
    if (coreRef.current) {
        const material = coreRef.current.material as THREE.MeshStandardMaterial;
        material.color.copy(currentColor.current);
        material.emissive.copy(currentColor.current);
        material.emissiveIntensity = currentIntensity.current + Math.sin(time * 3) * 0.5; // Breathing

        // Base Scale Pulse
        const baseScale = 1 + Math.sin(time * 2) * 0.05;
        coreRef.current.scale.set(baseScale, baseScale, baseScale);
    }

    // 4. Update Rings (Atom Effect)
    const ringSpeed = currentSpeed.current * 2.0;

    if (ring1Ref.current) {
        const material = ring1Ref.current.material as THREE.MeshBasicMaterial;
        material.color.copy(currentColor.current);
        ring1Ref.current.rotation.x += delta * ringSpeed;
        ring1Ref.current.rotation.y += delta * ringSpeed * 0.5;
    }
    if (ring2Ref.current) {
        const material = ring2Ref.current.material as THREE.MeshBasicMaterial;
        material.color.copy(currentColor.current);
        ring2Ref.current.rotation.y += delta * ringSpeed;
        ring2Ref.current.rotation.z += delta * ringSpeed * 0.5;
    }
    if (ring3Ref.current) {
        const material = ring3Ref.current.material as THREE.MeshBasicMaterial;
        material.color.copy(currentColor.current);
        ring3Ref.current.rotation.z += delta * ringSpeed;
        ring3Ref.current.rotation.x += delta * ringSpeed * 0.5;
    }


    // 5. Update Shockwave
    if (shockwaveRef.current) {
        if (isPulsing.current) {
            pulseTime.current += delta * 2.0; // Speed of expansion

            if (pulseTime.current < 2.0) {
                const scale = 1 + (pulseTime.current * 3); // Expand
                shockwaveRef.current.scale.set(scale, scale, scale);

                const material = shockwaveRef.current.material as THREE.MeshBasicMaterial;
                material.color.copy(currentColor.current);
                // Fade out: 1 -> 0
                material.opacity = Math.max(0, 0.5 - (pulseTime.current * 0.25));
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
    <group ref={groupRef} scale={0.6}> {/* Adjust scale to fit well in header box */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          {/* Glowing Core */}
          <mesh ref={coreRef}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
              toneMapped={false}
              transparent
              opacity={0.9}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>

          {/* Atom Rings */}
          {/* Ring 1 - Horizontalish */}
          <group rotation={[Math.PI / 3, 0, 0]}>
            <mesh ref={ring1Ref}>
                <torusGeometry args={[3, 0.02, 16, 100]} />
                <meshBasicMaterial transparent opacity={0.6} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
          </group>

          {/* Ring 2 - Verticalish */}
          <group rotation={[0, Math.PI / 3, 0]}>
             <mesh ref={ring2Ref}>
                <torusGeometry args={[3, 0.02, 16, 100]} />
                <meshBasicMaterial transparent opacity={0.6} side={THREE.DoubleSide} toneMapped={false} />
             </mesh>
          </group>

          {/* Ring 3 - Diagonal */}
          <group rotation={[0, 0, Math.PI / 3]}>
             <mesh ref={ring3Ref}>
                <torusGeometry args={[3, 0.02, 16, 100]} />
                <meshBasicMaterial transparent opacity={0.6} side={THREE.DoubleSide} toneMapped={false} />
             </mesh>
          </group>


           {/* Shockwave Ring (Pulse Effect) */}
           <mesh ref={shockwaveRef} visible={false}>
              <ringGeometry args={[1.2, 1.4, 64]} />
              <meshBasicMaterial
                transparent
                opacity={0}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                toneMapped={false}
              />
           </mesh>

          {/* Orbiting Particles */}
          <Sparkles
            count={80}
            scale={8}
            size={4}
            speed={0.4}
            opacity={0.5}
            color="#ffffff"
          />
      </Float>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" distance={20} />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#0000ff" distance={20} />
    </group>
  );
}
