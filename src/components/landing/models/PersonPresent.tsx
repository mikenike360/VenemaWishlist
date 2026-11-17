import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PresentPerson } from '../../../lib/profiles';

const giftColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
const ribbonColors = ['#FFD700', '#FF6B9D', '#C44569', '#FFA502', '#FF1493', '#FF69B4'];

function colorIndex(name: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

function makeNameTexture(name: string, highlighted: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 220;
  const context = canvas.getContext('2d');
  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.fillStyle = '#f6efe2';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = highlighted ? '#c9a227' : '#c4b49a';
  context.lineWidth = highlighted ? 16 : 8;
  context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
  context.fillStyle = '#d9cbb3';
  context.beginPath();
  context.arc(canvas.width / 2, 36, 12, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = '#3d2914';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  let size = 86;
  const font = (next: number) => `${next}px Georgia, "Palatino Linotype", Palatino, serif`;
  context.font = font(size);
  while (context.measureText(name).width > 460 && size > 32) {
    size -= 4;
    context.font = font(size);
  }
  context.fillText(name, canvas.width / 2, 132);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

interface PersonPresentProps {
  person: PresentPerson;
  position: [number, number, number];
  highlighted: boolean;
  onSelect: (person: PresentPerson) => void;
}

export const PersonPresent: React.FC<PersonPresentProps> = ({ person, position, highlighted, onSelect }) => {
  const groupRef = useRef<THREE.Group>(null);
  const tagRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  const giftColor = useMemo(() => giftColors[colorIndex(person.name, giftColors.length)], [person.name]);
  const ribbonColor = useMemo(() => ribbonColors[colorIndex(person.name + 'ribbon', ribbonColors.length)], [person.name]);
  const nameTexture = useMemo(() => makeNameTexture(person.name, highlighted), [person.name, highlighted]);

  useEffect(() => () => nameTexture.dispose(), [nameTexture]);

  useFrame(() => {
    if (groupRef.current) {
      const target = hovered || highlighted ? 1.18 : 1;
      const next = groupRef.current.scale.x + (target - groupRef.current.scale.x) * 0.15;
      groupRef.current.scale.setScalar(next);
    }
    tagRef.current?.lookAt(camera.position);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(person);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.5, 0.7]} />
        <meshStandardMaterial
          color={giftColor}
          emissive={highlighted ? '#FFD700' : '#000000'}
          emissiveIntensity={highlighted ? 0.45 : 0}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <boxGeometry args={[0.78, 0.12, 0.06]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.78, 0.12, 0.06]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.2} />
      </mesh>
      <group ref={tagRef} position={[0, 0.66, 0]}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <torusGeometry args={[0.035, 0.01, 8, 16]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.35} metalness={0.15} />
        </mesh>
        <mesh position={[0, -0.08, 0.18]} rotation={[-0.9, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.38, 6]} />
          <meshStandardMaterial color="#d7c4a3" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.3, 0.42]} rotation={[0.08, 0, -0.06]}>
          <planeGeometry args={[0.66, 0.3]} />
          <meshBasicMaterial map={nameTexture} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};
