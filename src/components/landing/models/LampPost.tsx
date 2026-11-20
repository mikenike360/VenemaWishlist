import React from 'react';
import { FitModel, villageModels } from './FitModel';

interface LampPostProps {
  position: [number, number, number];
}

export const LampPost: React.FC<LampPostProps> = ({ position }) => {
  // The streetlight head sticks out on local -X. Aim that head back toward the tree.
  const yaw = Math.atan2(-position[2], position[0]);

  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <FitModel url={villageModels.lamp} height={2.2} />
      <pointLight
        color="#FFD700"
        intensity={0.85}
        distance={10}
        decay={2}
        position={[-0.28, 2.02, 0]}
      />
    </group>
  );
};
