import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from '../../../lib/materials';
import { TREE_POSITION } from '../../../lib/roomLayout';
import { FitModel, villageModels } from './FitModel';

interface ChristmasTreeProps {
  position?: [number, number, number];
}

const PINE_HEIGHT = 2.35;

/**
 * Bauble seats raycast onto the carved canopy surface (inset ~2.5cm).
 * Avoids the old cone formula that left spheres hanging between tiers.
 */
const ORNAMENTS: { position: [number, number, number]; color: string }[] = [
  { position: [0.321, 1.05, 0.065], color: '#E03040' },
  { position: [-0.229, 1.05, 0.26], color: '#2CB85A' },
  { position: [-0.095, 1.05, -0.284], color: '#E03040' },
  { position: [0.146, 1.28, 0.228], color: '#2CB85A' },
  { position: [-0.247, 1.28, 0.012], color: '#E03040' },
  { position: [0.093, 1.28, -0.18], color: '#2CB85A' },
  { position: [0.158, 1.48, 0.086], color: '#E03040' },
  { position: [-0.129, 1.48, -0.07], color: '#2CB85A' },
  { position: [0.029, 1.62, 0.168], color: '#E03040' },
  { position: [-0.014, 1.62, -0.079], color: '#2CB85A' },
  { position: [0.047, 1.78, 0.048], color: '#E03040' },
  { position: [-0.018, 1.78, -0.018], color: '#2CB85A' },
];

export const ChristmasTree: React.FC<ChristmasTreeProps> = ({ position = TREE_POSITION }) => {
  const timeRef = useRef(0);
  const lightRefs = useRef<Array<THREE.PointLight | null>>([]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    lightRefs.current.forEach((light, index) => {
      if (!light) return;
      const twinkle = easing.easeOut(Math.sin(timeRef.current * 3 + index) * 0.5 + 0.5);
      light.intensity = 0.18 + twinkle * 0.25;
    });
  });

  return (
    <group position={position}>
      <FitModel
        key="christmas-tree-clear-18"
        url={villageModels.christmasTree}
        height={PINE_HEIGHT}
        brighten={1.55}
        hideGroundClutter
      />

      {ORNAMENTS.map((ornament, index) => (
        <group key={`ornament-${index}`} position={ornament.position}>
          <mesh>
            <sphereGeometry args={[0.032, 10, 10]} />
            <meshStandardMaterial
              color={ornament.color}
              emissive={ornament.color}
              emissiveIntensity={0.35}
              roughness={0.45}
            />
          </mesh>
          {/* Soft twinkle — short range so the glow doesn’t read as a detached orb */}
          <pointLight
            ref={(light) => {
              lightRefs.current[index] = light;
            }}
            color={ornament.color}
            intensity={0.2}
            distance={0.7}
            decay={2}
          />
        </group>
      ))}

      <pointLight position={[0, 1.9, 0]} color="#FFD2A8" intensity={0.75} distance={5} decay={2} />
    </group>
  );
};
