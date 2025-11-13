import React from 'react';

interface SnowmanProps {
  position: [number, number, number];
}

export const Snowman: React.FC<SnowmanProps> = ({ position }) => {
  // Adjust position so bottom sphere sits on ground (ground is at y=-0.5, sphere radius is 0.5)
  // Bottom sphere center should be at y=0 (ground level), so group y = 0 - 0.5 = -0.5
  const adjustedPosition: [number, number, number] = [position[0], -0.5, position[2]];

  return (
    <group position={adjustedPosition}>
      {/* Bottom sphere */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.08}
          metalness={0.0}
          emissive="#FFFFFF"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Middle sphere */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.08}
          metalness={0.0}
          emissive="#FFFFFF"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.08}
          metalness={0.0}
          emissive="#FFFFFF"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 1.95, 0.25]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1, 1.95, 0.25]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Smile (buttons) */}
      {[-0.08, 0, 0.08].map((x, i) => (
        <mesh key={i} position={[x, 1.85, 0.28]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      ))}
      {/* Nose */}
      <mesh position={[0, 1.9, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.05, 0.15, 8]} />
        <meshStandardMaterial 
          color="#FF8C00" 
          emissive="#FF8C00"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Hat */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.2, 32]} />
        <meshStandardMaterial 
          color="#000000" 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 2.35, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.3, 0.1, 32]} />
        <meshStandardMaterial 
          color="#000000" 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Hat band */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <torusGeometry args={[0.35, 0.02, 8, 32]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>
    </group>
  );
};

