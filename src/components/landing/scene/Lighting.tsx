import React from 'react';

export const Lighting: React.FC = () => {
  return (
    <>
      <color attach="background" args={['#120e0c']} />
      <ambientLight intensity={0.25} color="#ffd8b0" />

      {/* Soft key from the open wall — keep it gentle so local lights own the mood */}
      <directionalLight
        position={[0, 3.4, 6]}
        intensity={0.45}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-2}
        shadow-bias={-0.0002}
        color="#fff1dd"
      />

      {/* Dim ceiling fill */}
      <pointLight position={[0, 3.0, 0]} color="#ffe6c4" intensity={0.35} distance={10} decay={2} />

      {/* Cool rim through the window */}
      <pointLight position={[3.6, 1.6, 0]} color="#9eb6ff" intensity={0.35} distance={7} decay={2} />
    </>
  );
};
