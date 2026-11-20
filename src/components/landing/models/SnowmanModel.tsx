import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHARACTER_YAW, FitModel, villageModels } from './FitModel';

interface SnowmanModelProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

export const SnowmanModel: React.FC<SnowmanModelProps> = ({
  position,
  scale = 1,
  rotation = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    groupRef.current.rotation.y = rotation[1] + Math.sin(timeRef.current * 0.35) * 0.03;
  });

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      <FitModel url={villageModels.snowman} height={1.6} yaw={CHARACTER_YAW} />
    </group>
  );
};
