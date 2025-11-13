import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HouseProps {
  position: [number, number, number];
  rotation?: number;
}

export const House: React.FC<HouseProps> = ({ position, rotation = 0 }) => {
  const houseRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (houseRef.current) {
      timeRef.current += delta;
    }
  });

  return (
    <group ref={houseRef} position={position} rotation={[0, rotation, 0]}>
      {/* Foundation */}
      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.4, 2]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Main body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.5, 1.8]} />
        <meshStandardMaterial color="#DEB887" roughness={0.7} metalness={0.0} />
      </mesh>

      {/* Roof - improved pyramid shape */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <coneGeometry args={[1.5, 0.8, 4]} />
        <meshStandardMaterial color="#8B4513" roughness={0.6} />
      </mesh>

      {/* Snow on roof - better positioned */}
      <mesh position={[0, 1.65, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.55, 0.15, 4]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>

      {/* Chimney */}
      <mesh position={[0.5, 2, 0.5]} castShadow>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Smoke with better physics */}
      {Array.from({ length: 4 }).map((_, i) => {
        const offsetX = Math.sin(timeRef.current * 0.4 + i * 0.6) * 0.12;
        const offsetZ = Math.cos(timeRef.current * 0.3 + i * 0.4) * 0.08;
        const scale = 1 + i * 0.2;
        return (
          <mesh key={`smoke-${i}`} position={[0.5 + offsetX, 2.5 + i * 0.18, 0.5 + offsetZ]} castShadow={false}>
            <sphereGeometry args={[(0.1 - i * 0.015) * scale, 10, 10]} />
            <meshStandardMaterial 
              color="#E8E8E8" 
              transparent 
              opacity={0.3 - i * 0.06}
              emissive="#E8E8E8"
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}

      {/* Window */}
      {/* Window frame - border pieces */}
      {/* Top frame */}
      <mesh position={[0, 1.02, 0.89]} castShadow>
        <boxGeometry args={[0.6, 0.05, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Bottom frame */}
      <mesh position={[0, 0.58, 0.89]} castShadow>
        <boxGeometry args={[0.6, 0.05, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Left frame */}
      <mesh position={[0, 0.8, 1.18]} castShadow>
        <boxGeometry args={[0.05, 0.6, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Right frame */}
      <mesh position={[0, 0.8, 0.6]} castShadow>
        <boxGeometry args={[0.05, 0.6, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Window glass - recessed */}
      <mesh position={[0, 0.8, 0.88]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.08]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          emissive="#FFD700"
          emissiveIntensity={0.6 + Math.sin(timeRef.current * 1.8) * 0.25 + Math.sin(timeRef.current * 4) * 0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Window light */}
      <pointLight
        position={[0, 0.8, 0.88]}
        color="#FFD700"
        intensity={0.5 + Math.sin(timeRef.current * 1.8) * 0.2}
        distance={5}
        decay={2}
      />
      

      {/* Door */}
      <mesh position={[0, 0.3, 0.91]} castShadow>
        <boxGeometry args={[0.4, 0.7, 0.05]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>
    </group>
  );
};

