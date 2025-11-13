import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CabinProps {
  position: [number, number, number];
}

export const Cabin: React.FC<CabinProps> = ({ position }) => {
  const cabinRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (cabinRef.current) {
      timeRef.current += delta;
    }
  });

  return (
    <group ref={cabinRef} position={position}>
      {/* Base foundation */}
      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.4, 3]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Main cabin body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 2, 2.5]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
      
      {/* Wood planks texture effect */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`plank-${i}`} position={[-1.25, 0.5 + (i - 1.5) * 0.5, 1.26]} castShadow>
          <boxGeometry args={[2.5, 0.1, 0.05]} />
          <meshStandardMaterial color="#654321" roughness={0.8} />
        </mesh>
      ))}

      {/* Roof - improved pyramid shape */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[1.8, 1.2, 4]} />
        <meshStandardMaterial 
          color="#654321" 
          roughness={0.6}
          metalness={0.0}
        />
      </mesh>

      {/* Snow on roof - better positioned */}
      <mesh position={[0, 2.25, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.85, 0.2, 4]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>

      {/* Chimney */}
      <mesh position={[0.8, 2.5, 0.8]} castShadow>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Smoke with better physics */}
      {Array.from({ length: 6 }).map((_, i) => {
        const offsetX = Math.sin(timeRef.current * 0.3 + i * 0.5) * 0.15;
        const offsetZ = Math.cos(timeRef.current * 0.2 + i * 0.3) * 0.1;
        const scale = 1 + i * 0.15;
        return (
          <mesh key={`smoke-${i}`} position={[0.8 + offsetX, 3.2 + i * 0.25, 0.8 + offsetZ]} castShadow={false}>
            <sphereGeometry args={[(0.12 - i * 0.015) * scale, 12, 12]} />
            <meshStandardMaterial 
              color="#E8E8E8" 
              transparent 
              opacity={0.35 - i * 0.05}
              emissive="#E8E8E8"
              emissiveIntensity={0.25}
            />
          </mesh>
        );
      })}

      {/* Door */}
      <mesh position={[0, 0.5, 1.26]} castShadow>
        <boxGeometry args={[0.6, 1.2, 0.05]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Door handle */}
      <mesh position={[-0.25, 0.5, 1.3]} castShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windows */}
      {/* Left window */}
      {/* Window frame - border pieces */}
      {/* Top frame */}
      <mesh position={[-1.26, 1.32, 1.24]} castShadow>
        <boxGeometry args={[0.1, 0.05, 0.7]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Bottom frame */}
      <mesh position={[-1.26, 0.68, 1.24]} castShadow>
        <boxGeometry args={[0.1, 0.05, 0.7]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Left frame */}
      <mesh position={[-1.26, 1, 1.58]} castShadow>
        <boxGeometry args={[0.1, 0.7, 0.05]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Right frame */}
      <mesh position={[-1.26, 1, 0.9]} castShadow>
        <boxGeometry args={[0.1, 0.7, 0.05]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Window glass - recessed */}
      <mesh position={[-1.26, 1, 1.23]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.6]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          emissive="#FFD700"
          emissiveIntensity={0.7 + Math.sin(timeRef.current * 1.5) * 0.25 + Math.sin(timeRef.current * 3.5) * 0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Window light */}
      <pointLight
        position={[-1.26, 1, 1.23]}
        color="#FFD700"
        intensity={0.6 + Math.sin(timeRef.current * 1.5) * 0.2}
        distance={6}
        decay={2}
      />

      {/* Right window */}
      {/* Window frame - border pieces */}
      {/* Top frame */}
      <mesh position={[1.26, 1.32, 1.24]} castShadow>
        <boxGeometry args={[0.1, 0.05, 0.7]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Bottom frame */}
      <mesh position={[1.26, 0.68, 1.24]} castShadow>
        <boxGeometry args={[0.1, 0.05, 0.7]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Left frame */}
      <mesh position={[1.26, 1, 1.58]} castShadow>
        <boxGeometry args={[0.1, 0.7, 0.05]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Right frame */}
      <mesh position={[1.26, 1, 0.9]} castShadow>
        <boxGeometry args={[0.1, 0.7, 0.05]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Window glass - recessed */}
      <mesh position={[1.26, 1, 1.23]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.6]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          emissive="#FFD700"
          emissiveIntensity={0.7 + Math.sin(timeRef.current * 1.5 + 1.2) * 0.25 + Math.sin(timeRef.current * 3.5 + 0.5) * 0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Window light */}
      <pointLight
        position={[1.26, 1, 1.23]}
        color="#FFD700"
        intensity={0.6 + Math.sin(timeRef.current * 1.5 + 1.2) * 0.2}
        distance={6}
        decay={2}
      />

      {/* Front window */}
      {/* Window frame - border pieces */}
      {/* Top frame */}
      <mesh position={[0, 1.32, 1.24]} castShadow>
        <boxGeometry args={[0.7, 0.05, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Bottom frame */}
      <mesh position={[0, 0.68, 1.24]} castShadow>
        <boxGeometry args={[0.7, 0.05, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Left frame */}
      <mesh position={[-0.325, 1, 1.24]} castShadow>
        <boxGeometry args={[0.05, 0.7, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Right frame */}
      <mesh position={[0.325, 1, 1.24]} castShadow>
        <boxGeometry args={[0.05, 0.7, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Window glass - recessed */}
      <mesh position={[0, 1, 1.23]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.08]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          emissive="#FFD700"
          emissiveIntensity={0.7 + Math.sin(timeRef.current * 1.5 + 2.4) * 0.25 + Math.sin(timeRef.current * 3.5 + 1) * 0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Window light */}
      <pointLight
        position={[0, 1, 1.23]}
        color="#FFD700"
        intensity={0.6 + Math.sin(timeRef.current * 1.5 + 2.4) * 0.2}
        distance={6}
        decay={2}
      />
    </group>
  );
};

