import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChurchProps {
  position: [number, number, number];
}

export const Church: React.FC<ChurchProps> = ({ position }) => {
  const churchRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (churchRef.current) {
      timeRef.current += delta;
    }
  });

  return (
    <group ref={churchRef} position={position}>
      {/* Foundation */}
      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.4, 4]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Main body */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 2, 3.5]} />
        <meshStandardMaterial color="#F5F5DC" roughness={0.7} metalness={0.0} />
      </mesh>

      {/* Steeple base */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[0.8, 1.5, 0.8]} />
        <meshStandardMaterial color="#F5F5DC" roughness={0.7} />
      </mesh>

      {/* Steeple top */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <coneGeometry args={[0.6, 1.2, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.6} />
      </mesh>

      {/* Snow on steeple */}
      <mesh position={[0, 3.9, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.65, 0.15, 8]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>

      {/* Cross */}
      <mesh position={[0, 4.8, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 4.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.1]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Stained glass windows with better glow */}
      {[-0.8, 0.8].map((x, i) => {
        const color = i === 0 ? '#FF6B6B' : '#4ECDC4';
        const intensity = 0.8 + Math.sin(timeRef.current * 1.5 + i) * 0.25;
        return (
          <group key={i}>
            {/* Window frame - border pieces */}
            {/* Top frame */}
            <mesh position={[x, 1.6, 1.74]} castShadow>
              <boxGeometry args={[0.1, 0.05, 0.7]} />
              <meshStandardMaterial color="#3D2817" roughness={0.8} />
            </mesh>
            {/* Bottom frame */}
            <mesh position={[x, 0.8, 1.74]} castShadow>
              <boxGeometry args={[0.1, 0.05, 0.7]} />
              <meshStandardMaterial color="#3D2817" roughness={0.8} />
            </mesh>
            {/* Left frame */}
            <mesh position={[x, 1.2, 2.05]} castShadow>
              <boxGeometry args={[0.1, 0.9, 0.05]} />
              <meshStandardMaterial color="#3D2817" roughness={0.8} />
            </mesh>
            {/* Right frame */}
            <mesh position={[x, 1.2, 1.43]} castShadow>
              <boxGeometry args={[0.1, 0.9, 0.05]} />
              <meshStandardMaterial color="#3D2817" roughness={0.8} />
            </mesh>
            {/* Window glass - recessed */}
            <mesh position={[x, 1.2, 1.73]} castShadow>
              <boxGeometry args={[0.08, 0.8, 0.6]} />
              <meshStandardMaterial 
                color={color} 
                emissive={color}
                emissiveIntensity={intensity}
                transparent
                opacity={0.85}
              />
            </mesh>
            {/* Window light glow */}
            <pointLight
              position={[x, 1.2, 1.73]}
              color={color}
              intensity={intensity * 0.6}
              distance={8}
              decay={2}
            />
          </group>
        );
      })}

      {/* Door */}
      <mesh position={[0, 0.5, 1.76]} castShadow>
        <boxGeometry args={[0.6, 1.2, 0.05]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>
    </group>
  );
};

