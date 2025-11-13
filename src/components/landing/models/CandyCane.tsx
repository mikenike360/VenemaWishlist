import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CandyCaneProps {
  position: [number, number, number];
  rotation?: number;
}

export const CandyCane: React.FC<CandyCaneProps> = ({ position, rotation = 0 }) => {
  const caneRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (caneRef.current) {
      timeRef.current += delta;
      // Subtle swaying
      caneRef.current.rotation.z = Math.sin(timeRef.current * 0.8) * 0.05;
    }
  });

  return (
    <group ref={caneRef} position={position} rotation={[0, rotation, 0]}>
      {/* Main stick - red and white striped */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
      
      {/* Red stripes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`stripe-${i}`} position={[0, 0.2 + i * 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.031, 0.031, 0.08, 8]} />
          <meshStandardMaterial color="#FF0000" roughness={0.6} />
        </mesh>
      ))}
      
      {/* Hook at top */}
      <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
      
      {/* Red stripe on hook */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.031, 0.031, 0.15, 8]} />
        <meshStandardMaterial color="#FF0000" roughness={0.6} />
      </mesh>
      
      {/* Bottom tip touching ground */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
    </group>
  );
};

