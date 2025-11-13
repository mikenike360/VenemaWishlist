import React from 'react';

interface PathProps {
  start: [number, number, number];
  end: [number, number, number];
  width?: number;
}

export const Path: React.FC<PathProps> = ({ start, end, width = 1 }) => {
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[2] + end[2]) / 2;
  const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[2] - start[2], 2));
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, angle]} 
      position={[midX, -0.4, midZ]} 
      receiveShadow
    >
      <planeGeometry args={[length, width]} />
      <meshStandardMaterial 
        color="#E0E0E0" 
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  );
};

