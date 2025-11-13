import React from 'react';
import * as THREE from 'three';

interface PresentProps {
  position: [number, number, number];
  color: string;
}

export const Present: React.FC<PresentProps> = ({ position, color }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.5, 2, 2, 2]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.35}
          metalness={0.15}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Ribbon */}
      <mesh position={[0, 0.2, 0.26]} castShadow>
        <boxGeometry args={[0.6, 0.12, 0.06]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700"
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, 0.2, 0.26]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.6, 0.12, 0.06]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700"
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
      {/* Bow */}
      <mesh position={[0, 0.5, 0.26]} castShadow>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial 
          color="#FF0000" 
          emissive="#FF0000"
          emissiveIntensity={0.3}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

