import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShopProps {
  position: [number, number, number];
}

export const Shop: React.FC<ShopProps> = ({ position }) => {
  const shopRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (shopRef.current) {
      timeRef.current += delta;
    }
  });

  return (
    <group ref={shopRef} position={position}>
      {/* Foundation */}
      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.4, 2.5]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Main body */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1.5, 2]} />
        <meshStandardMaterial color="#D2691E" roughness={0.7} metalness={0.0} />
      </mesh>

      {/* Awning - improved shape */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.15, 0.8]} />
        <meshStandardMaterial color="#8B0000" roughness={0.6} />
      </mesh>
      {/* Awning support posts */}
      <mesh position={[-1, 1.2, 0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>
      <mesh position={[1, 1.2, 0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>

      {/* Display window */}
      {/* Window frame - border pieces */}
      {/* Top frame */}
      <mesh position={[0, 1.22, 0.99]} castShadow>
        <boxGeometry args={[1.6, 0.05, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Bottom frame */}
      <mesh position={[0, 0.38, 0.99]} castShadow>
        <boxGeometry args={[1.6, 0.05, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Left frame */}
      <mesh position={[-0.775, 0.8, 0.99]} castShadow>
        <boxGeometry args={[0.05, 0.9, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Right frame */}
      <mesh position={[0.775, 0.8, 0.99]} castShadow>
        <boxGeometry args={[0.05, 0.9, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Window glass - recessed */}
      <mesh position={[0, 0.8, 0.98]} castShadow>
        <boxGeometry args={[1.5, 0.8, 0.08]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          emissive="#FFD700"
          emissiveIntensity={0.7 + Math.sin(timeRef.current * 2.5) * 0.25 + Math.sin(timeRef.current * 5) * 0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Window glow effect */}
      <pointLight
        position={[0, 0.8, 0.98]}
        color="#FFD700"
        intensity={0.8 + Math.sin(timeRef.current * 2.5) * 0.2}
        distance={6}
        decay={2}
      />

      {/* Door */}
      <mesh position={[0, 0.3, 1.01]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.05]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>

      {/* Sign */}
      <mesh position={[0, 1.8, 0.5]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.2, 0.1]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

