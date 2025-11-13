import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TreeProps {
  position: [number, number, number];
  scale?: number;
}

export const Tree: React.FC<TreeProps> = ({ position, scale = 1 }) => {
  const treeRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (treeRef.current) {
      timeRef.current += delta;
      // Subtle swaying in the wind
      treeRef.current.rotation.z = Math.sin(timeRef.current * 0.5) * 0.02;
    }
  });

  return (
    <group ref={treeRef} position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15 * scale, 0.2 * scale, 1 * scale, 8]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>

      {/* Foliage layers - conical shapes */}
      {/* Bottom layer */}
      <mesh position={[0, 1.2 * scale, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.8 * scale, 1.2 * scale, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.7} />
      </mesh>
      
      {/* Middle layer */}
      <mesh position={[0, 1.8 * scale, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.6 * scale, 1 * scale, 8]} />
        <meshStandardMaterial color="#2d7a2d" roughness={0.7} />
      </mesh>
      
      {/* Top layer */}
      <mesh position={[0, 2.4 * scale, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.4 * scale, 0.8 * scale, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.7} />
      </mesh>

      {/* Snow on branches */}
      <mesh position={[0, 1.5 * scale, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.75 * scale, 0.2 * scale, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.0} />
      </mesh>
      <mesh position={[0, 2.1 * scale, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.55 * scale, 0.15 * scale, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.0} />
      </mesh>
    </group>
  );
};

