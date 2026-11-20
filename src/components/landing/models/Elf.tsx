import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHARACTER_YAW, FitModel, villageModels } from './FitModel';

interface ElfProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  noAnimation?: boolean;
  workingPose?: 'assembling' | 'wrapping' | 'sign' | 'default';
  sign?: string;
}

function makeSignTexture(message: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 384;
  const context = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  if (!context) return texture;

  context.fillStyle = '#f6efe2';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#6b3a2a';
  context.lineWidth = 22;
  context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  const lines = message.split('\n');
  context.fillStyle = '#1b3a2f';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const font = (next: number) => `${next}px Georgia, "Palatino Linotype", Palatino, serif`;
  let size = 72;
  context.font = font(size);
  while (lines.some((line) => context.measureText(line).width > 680) && size > 36) {
    size -= 4;
    context.font = font(size);
  }
  const start = canvas.height / 2 - ((lines.length - 1) * size * 0.62) / 2;
  lines.forEach((line, index) => {
    context.fillText(line, canvas.width / 2, start + index * size * 1.15);
  });

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

export const Elf: React.FC<ElfProps> = ({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  noAnimation = false,
  workingPose = 'default',
  sign,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const signTexture = React.useMemo(() => (sign ? makeSignTexture(sign) : null), [sign]);

  React.useEffect(() => () => signTexture?.dispose(), [signTexture]);

  useFrame((_, delta) => {
    if (!groupRef.current || noAnimation) return;
    timeRef.current += delta;
    const workSpeed = workingPose === 'default' ? 0.3 : 1.2;
    groupRef.current.rotation.y = rotation[1] + Math.sin(timeRef.current * workSpeed) * 0.03;
  });

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      <FitModel url={villageModels.gnome} height={1.6} yaw={CHARACTER_YAW} />
      {signTexture && (
        <group position={[0, 0.62, 0.52]} rotation={[-0.08, 0, 0]}>
          <mesh position={[0, 0, -0.02]} castShadow>
            <boxGeometry args={[1.05, 0.42, 0.04]} />
            <meshStandardMaterial color="#6b3a2a" roughness={0.82} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.92, 0.32]} />
            <meshBasicMaterial map={signTexture} toneMapped={false} />
          </mesh>
        </group>
      )}
    </group>
  );
};
