import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface IcePondProps {
  position: [number, number, number];
  radius?: number;
}

export const IcePond: React.FC<IcePondProps> = ({ position, radius = 4 }) => {
  const pondRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (pondRef.current) {
      timeRef.current += delta;
    }
  });

  return (
    <group ref={pondRef} position={position}>
      {/* Base snow layer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]} receiveShadow>
        <circleGeometry args={[radius + 0.2, 32]} />
        <meshStandardMaterial 
          color="#F0F8FF" 
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
      
      {/* Ice surface with better appearance */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial 
          color="#B8E6E6" 
          roughness={0.1}
          metalness={0.4}
          transparent
          opacity={0.95}
          emissive="#D0F0F0"
          emissiveIntensity={0.15 + Math.sin(timeRef.current * 0.5) * 0.05}
        />
      </mesh>
      
      {/* Subtle ice texture/patterns */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const length = radius * 0.3;
        return (
          <mesh key={`pattern-${i}`} rotation={[-Math.PI / 2, 0, angle]} position={[0, -0.29, 0]} castShadow={false}>
            <planeGeometry args={[length, 0.015]} />
            <meshStandardMaterial 
              color="#A0D0D0" 
              transparent
              opacity={0.2}
            />
          </mesh>
        );
      })}

      {/* Border fence - improved */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={i} position={[x, -0.2, z]} rotation={[0, -angle, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 0.35, 0.06]} />
              <meshStandardMaterial color="#654321" roughness={0.8} />
            </mesh>
            {/* Top of post */}
            <mesh position={[0, 0.175, 0]} castShadow>
              <boxGeometry args={[0.08, 0.05, 0.08]} />
              <meshStandardMaterial color="#5C4033" roughness={0.7} />
            </mesh>
          </group>
        );
      })}
      
      {/* Top rail - improved */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} castShadow>
        <torusGeometry args={[radius, 0.04, 8, 48]} />
        <meshStandardMaterial color="#654321" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Bottom rail */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]} castShadow>
        <torusGeometry args={[radius, 0.03, 6, 48]} />
        <meshStandardMaterial color="#5C4033" roughness={0.8} />
      </mesh>
    </group>
  );
};

