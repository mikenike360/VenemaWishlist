import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from '../../../lib/materials';

interface LampPostProps {
  position: [number, number, number];
}

export const LampPost: React.FC<LampPostProps> = ({ position }) => {
  const lampRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (lampRef.current) {
      timeRef.current += delta;
    }
  });

  const twinkle = easing.easeOut(Math.sin(timeRef.current * 3) * 0.3 + 0.7);

  return (
    <group ref={lampRef} position={position}>
      {/* Pole */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 12]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Lamp housing */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700"
          emissiveIntensity={twinkle}
          metalness={0.6}
          roughness={0.15}
        />
      </mesh>
      
      {/* Lamp glow halo */}
      <mesh position={[0, 2.2, 0]} scale={2}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial 
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.2 * twinkle}
          transparent
          opacity={0.2 * twinkle}
        />
      </mesh>

      {/* Light */}
      <pointLight
        color="#FFD700"
        intensity={0.9 * twinkle}
        distance={10}
        decay={2}
        position={[0, 2.2, 0]}
      />
      
      {/* Sparkle particles around light */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + timeRef.current;
        const radius = 0.3;
        const sparkle = Math.sin(timeRef.current * 5 + i) * 0.5 + 0.5;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, 2.2 + Math.sin(timeRef.current * 2 + i) * 0.1, Math.sin(angle) * radius]} castShadow={false}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial 
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={sparkle}
              transparent
              opacity={sparkle * 0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
};

