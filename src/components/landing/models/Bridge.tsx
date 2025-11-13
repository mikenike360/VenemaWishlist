import React from 'react';

interface BridgeProps {
  position: [number, number, number];
}

export const Bridge: React.FC<BridgeProps> = ({ position }) => {
  return (
    <group position={position}>
      {/* Bridge deck */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.2, 1]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Bridge supports */}
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x, -0.4, 0]} castShadow>
          <boxGeometry args={[0.2, 0.4, 1]} />
          <meshStandardMaterial color="#654321" roughness={0.8} />
        </mesh>
      ))}

      {/* Railings */}
      <mesh position={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[3, 0.3, 0.1]} />
        <meshStandardMaterial color="#654321" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[3, 0.3, 0.1]} />
        <meshStandardMaterial color="#654321" roughness={0.7} />
      </mesh>
    </group>
  );
};

