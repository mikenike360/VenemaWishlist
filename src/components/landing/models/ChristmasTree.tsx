import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { easing } from '../../../lib/materials';

interface ChristmasTreeProps {
  position?: [number, number, number];
  scale?: number;
}

export const ChristmasTree: React.FC<ChristmasTreeProps> = ({ position = [0, 0, 0], scale = 1 }) => {
  const treeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const timeRef = useRef(0);
  const navigate = useNavigate();

  useFrame((state, delta) => {
    if (treeRef.current) {
      timeRef.current += delta;
      // Smooth scale transition on hover
      const targetScale = hovered ? scale * 1.1 : scale;
      const currentScale = treeRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;
      treeRef.current.scale.setScalar(newScale);
    }
  });

  const treeScale = scale;

  const handleClick = () => {
    navigate('/wishlist');
  };

  return (
    <group 
      ref={treeRef} 
      position={position}
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Tree trunk */}
      <mesh position={[0, -1 * treeScale, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2 * treeScale, 0.2 * treeScale, 0.5 * treeScale, 24]} />
        <meshStandardMaterial 
          color="#654321" 
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Tree layers with better geometry and wind effect */}
      {[0, 0.5, 1, 1.5].map((y, i) => {
        const windOffset = Math.sin(timeRef.current * 0.5 + y) * 0.02;
        return (
          <mesh key={i} position={[windOffset, y * treeScale, 0]} castShadow>
            <coneGeometry args={[(1.5 - i * 0.3) * treeScale, 1 * treeScale, 24, 1]} />
            <meshStandardMaterial 
              color="#1a7a1a" 
              roughness={0.75}
              metalness={0.05}
              emissive="#0a3a0a"
              emissiveIntensity={0.15}
            />
          </mesh>
        );
      })}

      {/* Star on top with pulsing effect */}
      <mesh position={[0, 2.2 * treeScale, 0]} castShadow>
        <coneGeometry args={[0.1 * treeScale, 0.3 * treeScale, 8]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700" 
          emissiveIntensity={0.9 + Math.sin(timeRef.current * 2) * 0.3}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      {/* Star glow effect */}
      <mesh position={[0, 2.2 * treeScale, 0]} scale={1.5}>
        <coneGeometry args={[0.1 * treeScale, 0.3 * treeScale, 8]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700"
          emissiveIntensity={0.3 + Math.sin(timeRef.current * 2) * 0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Ornaments with better materials */}
      {[
        [0.5, 0.5, 0.5],
        [-0.5, 0.5, 0.5],
        [0.5, 1, 0.5],
        [-0.5, 1, 0.5],
        [0, 1.5, 0.5],
        [0.3, 0.3, 0.4],
        [-0.3, 0.8, 0.4],
      ].map((pos, i) => {
        const color = i % 3 === 0 ? '#FF3333' : i % 3 === 1 ? '#3333FF' : '#FFD700';
        const emissive = i % 3 === 0 ? '#FF0000' : i % 3 === 1 ? '#0000FF' : '#FFD700';
        const sparkle = Math.sin(timeRef.current * 2 + i) * 0.3 + 0.7;
        return (
          <group key={i} position={[pos[0] * treeScale, pos[1] * treeScale, pos[2] * treeScale]}>
            <mesh castShadow>
              <sphereGeometry args={[0.08 * treeScale, 20, 20]} />
              <meshStandardMaterial 
                color={color} 
                emissive={emissive}
                emissiveIntensity={0.6 * sparkle}
                metalness={0.4}
                roughness={0.15}
              />
            </mesh>
            {/* Ornament glow */}
            <mesh scale={1.5} castShadow={false}>
              <sphereGeometry args={[0.08 * treeScale, 12, 12]} />
              <meshStandardMaterial 
                color={emissive}
                emissive={emissive}
                emissiveIntensity={0.15 * sparkle}
                transparent
                opacity={0.3 * sparkle}
              />
            </mesh>
          </group>
        );
      })}

      {/* Christmas lights with twinkling effect - positioned on tree branches */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        // Calculate which tree layer this light is on (0-3)
        const layerIndex = Math.floor((i / 12) * 4);
        const layerProgress = ((i / 12) * 4) % 1;
        // Tree layers get smaller: [1.5, 1.2, 0.9, 0.6] * treeScale
        const layerRadii = [1.5, 1.2, 0.9, 0.6];
        const baseRadius = layerRadii[Math.min(layerIndex, 3)] * treeScale;
        // Interpolate radius within layer for smoother transition
        const nextRadius = layerIndex < 3 ? layerRadii[layerIndex + 1] * treeScale : baseRadius;
        const radius = baseRadius * (1 - layerProgress) + nextRadius * layerProgress;
        // Position lights on the surface of the cone, not floating
        const height = -0.5 + (i / 12) * 2.5;
        const twinkle = easing.easeOut(Math.sin(timeRef.current * 3 + i) * 0.5 + 0.5);
        const lightColor = i % 2 === 0 ? '#FF0000' : '#00FF00';
        // Adjust radius to be slightly inside the tree surface
        const adjustedRadius = radius * 0.85;
        return (
          <group key={`light-${i}`} position={[Math.cos(angle) * adjustedRadius, height * treeScale, Math.sin(angle) * adjustedRadius]}>
            <mesh>
              <sphereGeometry args={[0.06 * treeScale, 16, 16]} />
              <meshStandardMaterial 
                color={lightColor} 
                emissive={lightColor}
                emissiveIntensity={0.9 + twinkle * 0.5}
                metalness={0.2}
                roughness={0.1}
              />
            </mesh>
            {/* Light glow halo */}
            <mesh scale={1.8}>
              <sphereGeometry args={[0.06 * treeScale, 8, 8]} />
              <meshStandardMaterial 
                color={lightColor}
                emissive={lightColor}
                emissiveIntensity={0.2 * twinkle}
                transparent
                opacity={0.3 * twinkle}
              />
            </mesh>
            {/* Light */}
            <pointLight
              color={lightColor}
              intensity={0.6 + twinkle * 0.4}
              distance={3}
              decay={2}
            />
          </group>
        );
      })}
    </group>
  );
};

