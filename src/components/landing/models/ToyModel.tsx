import React from 'react';
import { FitModel, villageModels } from './FitModel';

interface ToyModelProps {
  position: [number, number, number];
  toyType?: 'car' | 'train';
  scale?: number;
  rotation?: [number, number, number];
  noAnimation?: boolean;
}

export const ToyModel: React.FC<ToyModelProps> = ({
  position,
  scale = 1,
  rotation = [0, 0, 0],
}) => {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <FitModel url={villageModels.car} height={0.45} />
    </group>
  );
};
