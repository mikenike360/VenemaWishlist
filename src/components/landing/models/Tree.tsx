import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FitModel, villageModels } from './FitModel';

interface TreeProps {
  position: [number, number, number];
  scale?: number;
}

export const Tree: React.FC<TreeProps> = ({ position, scale = 1 }) => {
  const treeRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!treeRef.current) return;
    timeRef.current += delta;
    treeRef.current.rotation.z = Math.sin(timeRef.current * 0.5) * 0.02;
  });

  return (
    <group ref={treeRef} position={position} scale={scale}>
      <FitModel url={villageModels.pine} height={4} />
    </group>
  );
};
