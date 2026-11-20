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
const LIGHT_COUNT = 10;

export const ChristmasTree: React.FC<ChristmasTreeProps> = ({ position = TREE_POSITION }) => {
  const timeRef = useRef(0);
  const lightRefs = useRef<Array<THREE.PointLight | null>>([]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    lightRefs.current.forEach((light, index) => {
      if (!light) return;
      const twinkle = easing.easeOut(Math.sin(timeRef.current * 3 + index) * 0.5 + 0.5);
      light.intensity = 0.28 + twinkle * 0.35;
    });
  });

  return (
    <group position={position}>
      <FitModel
        key="christmas-tree-clear-15"
        url={villageModels.christmasTree}
        height={PINE_HEIGHT}
        brighten={1.55}
        hideGroundClutter
      />

      {Array.from({ length: LIGHT_COUNT }).map((_, index) => {
        const t = index / (LIGHT_COUNT - 1);
        const angle = index * 1.85;
        const radius = 0.42 * (1 - t * 0.72);
        const y = 0.35 + t * 1.75;
        const color = index % 2 === 0 ? '#FF3344' : '#33DD66';
        return (
          <group key={`light-${index}`} position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}>
            <mesh>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} roughness={0.25} />
            </mesh>
            <pointLight
              ref={(light) => {
                lightRefs.current[index] = light;
              }}
              color={color}
              intensity={0.4}
              distance={2}
              decay={2}
            />
          </group>
        );
      })}

      <pointLight position={[0, 1.9, 0]} color="#FFD2A8" intensity={0.75} distance={5} decay={2} />
    </group>
  );
};
