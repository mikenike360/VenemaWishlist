import React from 'react';

export const SnowyGround: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[80, 80, 100, 100]} />
      <meshStandardMaterial 
        color="#F0F8FF" 
        roughness={0.95}
        metalness={0.0}
        emissive="#E8F4F8"
        emissiveIntensity={0.05}
      />
    </mesh>
  );
};

