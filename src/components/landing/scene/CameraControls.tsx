import React from 'react';
import { OrbitControls } from '@react-three/drei';

export const CameraControls: React.FC = () => {
  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      enableRotate={true}
      minDistance={8}
      maxDistance={50}
      minPolarAngle={Math.PI / 12}
      maxPolarAngle={Math.PI / 1.8}
      autoRotate={false}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.8}
      panSpeed={0.8}
      zoomSpeed={1.2}
    />
  );
};

