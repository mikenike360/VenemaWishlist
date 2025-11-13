import React from 'react';

interface BenchProps {
  position: [number, number, number];
  rotation?: number;
}

export const Bench: React.FC<BenchProps> = ({ position, rotation = 0 }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.1, 0.4]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Back */}
      <mesh position={[0, -0.1, -0.2]} castShadow>
        <boxGeometry args={[1.2, 0.4, 0.1]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Legs */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, -0.4, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#654321" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

