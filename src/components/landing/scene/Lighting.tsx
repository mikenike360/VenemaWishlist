import React from 'react';
import { Stars } from '@react-three/drei';

export const Lighting: React.FC = () => {
  return (
    <>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.55} color="#5a6578" />
      
      {/* Main directional light (moonlight) with warmer tone */}
      <directionalLight 
        position={[10, 15, 5]} 
        intensity={0.9} 
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
        shadow-radius={8}
        color="#FFF8E1"
      />
      
      {/* Colored accent lights */}
      <pointLight 
        position={[5, 8, 5]} 
        intensity={1.2} 
        color="#FFD700" 
        distance={15}
        decay={2}
        castShadow
      />
      <pointLight 
        position={[-5, 8, -5]} 
        intensity={1.0} 
        color="#FF6B6B" 
        distance={15}
        decay={2}
      />
      <pointLight 
        position={[0, 10, -5]} 
        intensity={0.8} 
        color="#4ECDC4" 
        distance={15}
        decay={2}
      />
      
      {/* Additional warm lights for atmosphere */}
      <pointLight 
        position={[-3, 6, 3]} 
        intensity={0.6} 
        color="#FFA500" 
        distance={12}
        decay={2}
      />
      <pointLight 
        position={[3, 6, 3]} 
        intensity={0.6} 
        color="#FF69B4" 
        distance={12}
        decay={2}
      />
      
      {/* Fog for depth with better color */}
      <fog attach="fog" args={['#2a2a3e', 18, 55]} />
      
      {/* Sky with moon */}
      <Stars radius={100} depth={50} count={10000} factor={4} saturation={0.6} fade speed={0.5} />
      
      {/* Moon */}
      <mesh position={[15, 20, -15]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial 
          color="#FFF8E1" 
          emissive="#FFF8E1"
          emissiveIntensity={0.3}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      {/* Moon glow */}
      <pointLight
        position={[15, 20, -15]}
        color="#FFF8E1"
        intensity={0.5}
        distance={40}
        decay={2}
      />
    </>
  );
};

