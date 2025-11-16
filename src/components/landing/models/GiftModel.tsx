import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GiftModelProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  noAnimation?: boolean;
}

// Array of gift box colors for variety
const giftColors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky blue
];

export const GiftModel: React.FC<GiftModelProps> = ({ 
  position, 
  scale = 1,
  rotation = [0, 0, 0],
  noAnimation = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  
  // Pick a random color for this gift instance
  const giftColor = React.useMemo(() => 
    giftColors[Math.floor(Math.random() * giftColors.length)], 
    []
  );
  
  // Ribbon colors - more vibrant and varied
  const ribbonColors = ['#FFD700', '#FF6B9D', '#C44569', '#FFA502', '#FF1493', '#FF69B4'];
  const ribbonColor = React.useMemo(() => 
    ribbonColors[Math.floor(Math.random() * ribbonColors.length)], 
    []
  );

  useFrame((state, delta) => {
    if (groupRef.current && !noAnimation) {
      timeRef.current += delta;
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current * 0.8) * 0.05;
      // Slight rotation
      groupRef.current.rotation.y = rotation[1] + Math.sin(timeRef.current * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {/* Simple gift box */}
      <mesh position={[0, 0.25 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5 * scale, 0.5 * scale, 0.5 * scale]} />
        <meshStandardMaterial 
          color={giftColor}
          roughness={0.5}
          metalness={0.0}
        />
      </mesh>
      
      {/* Simple horizontal ribbon - on top, laying flat */}
      <mesh position={[0, 0.5 * scale + 0.025 * scale, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <boxGeometry args={[0.6 * scale, 0.1 * scale, 0.05 * scale]} />
        <meshStandardMaterial 
          color={ribbonColor}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Simple vertical ribbon - on top, laying flat */}
      <mesh position={[0, 0.5 * scale + 0.025 * scale, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.6 * scale, 0.1 * scale, 0.05 * scale]} />
        <meshStandardMaterial 
          color={ribbonColor}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Simple bow center - on top */}
      <mesh position={[0, 0.5 * scale + 0.025 * scale, 0]} castShadow>
        <sphereGeometry args={[0.1 * scale, 16, 16]} />
        <meshStandardMaterial 
          color={ribbonColor}
          roughness={0.2}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};

