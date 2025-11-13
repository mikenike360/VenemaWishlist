import React from 'react';

interface FenceProps {
  position: [number, number, number];
  length?: number;
  rotation?: number;
}

export const Fence: React.FC<FenceProps> = ({ position, length = 3, rotation = 0 }) => {
  const posts = Math.floor(length);
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {Array.from({ length: posts + 1 }).map((_, i) => (
        <mesh key={`post-${i}`} position={[i - posts / 2, -0.2, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#654321" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, -0.05, 0]} castShadow>
        <boxGeometry args={[length, 0.1, 0.05]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>
    </group>
  );
};

