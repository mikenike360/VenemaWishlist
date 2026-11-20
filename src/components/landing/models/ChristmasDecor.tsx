import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from '../../../lib/materials';
import { FitModel, villageModels } from './FitModel';

function TwinkleBulb({
  position,
  color,
  size,
  phase,
  roughness = 0.35,
}: {
  position: [number, number, number];
  color: string;
  size: number;
  phase: number;
  roughness?: number;
}) {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!material.current) return;
    const twinkle = easing.easeOut(Math.sin(clock.elapsedTime * 3 + phase) * 0.5 + 0.5);
    material.current.emissiveIntensity = 0.25 + twinkle * 0.95;
  });

  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial
        ref={material}
        color={color}
        emissive={color}
        emissiveIntensity={0.7}
        roughness={roughness}
      />
    </mesh>
  );
}

function Stocking({
  position,
  color,
  cuff = '#f5f0e6',
}: {
  position: [number, number, number];
  color: string;
  cuff?: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.14, 0.06, 0.08]} />
        <meshStandardMaterial color={cuff} roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.16, 0]} castShadow>
        <boxGeometry args={[0.12, 0.28, 0.07]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0.07, -0.28, 0]} castShadow>
        <boxGeometry args={[0.14, 0.1, 0.07]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Wreath({ position }: { position: [number, number, number] }) {
  const berries = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return [Math.cos(a) * 0.28, Math.sin(a) * 0.28, 0.04] as [number, number, number];
    });
  }, []);

  return (
    <group position={position}>
      <mesh castShadow>
        <torusGeometry args={[0.28, 0.07, 10, 28]} />
        <meshStandardMaterial color="#1f6b3a" roughness={0.75} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.28, 0.045, 8, 24]} />
        <meshStandardMaterial color="#2f8f4c" roughness={0.7} />
      </mesh>
      {berries.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#c41e2a" roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, -0.34, 0.02]} castShadow>
        <boxGeometry args={[0.12, 0.14, 0.04]} />
        <meshStandardMaterial color="#c9a227" roughness={0.5} />
      </mesh>
    </group>
  );
}

function MantelGarland({ width = 1.8 }: { width?: number }) {
  const path = useMemo(() => {
    const count = 18;
    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1);
      const x = -width / 2 + t * width;
      // Clear scallops between stocking anchors
      const sag = Math.sin(t * Math.PI * 3) * -0.09 - Math.sin(t * Math.PI) * 0.02;
      return { x, y: sag, t };
    });
  }, [width]);

  const bulbs = useMemo(
    () =>
      path
        .filter((_, i) => i % 2 === 0)
        .map((p, i) => ({
          x: p.x,
          y: p.y - 0.04,
          color: i % 3 === 0 ? '#ff3344' : i % 3 === 1 ? '#ffd24a' : '#3ecf6a',
        })),
    [path],
  );

  const berries = useMemo(
    () =>
      [3, 9, 14].map((idx) => {
        const p = path[idx];
        return [p.x, p.y - 0.02, 0.06] as [number, number, number];
      }),
    [path],
  );

  return (
    <group>
      {/* Overlapping foliage blobs along a draped path */}
      {path.map((p, i) => (
        <group key={i} position={[p.x, p.y, 0.02]}>
          <mesh castShadow>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial color="#1a5c34" roughness={0.85} />
          </mesh>
          <mesh castShadow position={[0.02, -0.02, 0.025]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#2a7a45" roughness={0.8} />
          </mesh>
        </group>
      ))}
      {berries.map((pos, i) => (
        <mesh key={`berry-${i}`} position={pos} castShadow>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#c41e2a" roughness={0.4} />
        </mesh>
      ))}
      {bulbs.map((bulb, i) => (
        <TwinkleBulb
          key={`bulb-${i}`}
          position={[bulb.x, bulb.y, 0.08]}
          color={bulb.color}
          size={0.026}
          phase={i * 0.7}
        />
      ))}
    </group>
  );
}

function Candle({ position, height = 0.22 }: { position: [number, number, number]; height?: number }) {
  const flame = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!flame.current) return;
    const t = clock.elapsedTime;
    flame.current.scale.setScalar(0.9 + Math.sin(t * 14 + position[0] * 8) * 0.12);
  });

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.035, height, 10]} />
        <meshStandardMaterial color="#f4efe2" roughness={0.7} />
      </mesh>
      <mesh ref={flame} position={[0, height + 0.04, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ffb347" emissive="#ff8a1a" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[0, height + 0.05, 0]} color="#ffb060" intensity={0.25} distance={1.4} decay={2} />
    </group>
  );
}

function WallLights({ z = -3.9 }: { z?: number }) {
  const colors = ['#ff3344', '#ffd24a', '#3ecf6a', '#4aa3ff', '#ff66aa'];
  const lights = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => {
        const t = i / 10;
        return {
          x: -2.6 + t * 5.2,
          y: 2.55 + Math.sin(t * Math.PI * 4) * 0.08,
          color: colors[i % colors.length],
        };
      }),
    [],
  );

  return (
    <group>
      {lights.map((bulb, i) => (
        <TwinkleBulb
          key={i}
          position={[bulb.x, bulb.y, z]}
          color={bulb.color}
          size={0.04}
          phase={i * 0.55}
          roughness={0.3}
        />
      ))}
    </group>
  );
}

export const ChristmasDecor: React.FC = () => {
  return (
    <group>
      {/* Mantel shelf — stockings hang from the front edge, not into the hearth */}
      <group position={[0, 1.78, -3.18]}>
        <MantelGarland width={1.85} />
        <Stocking position={[-0.6, -0.02, 0.18]} color="#c41e2a" />
        <Stocking position={[-0.12, -0.02, 0.18]} color="#1f6b3a" cuff="#f0e6c8" />
        <Stocking position={[0.38, -0.02, 0.18]} color="#c41e2a" />
        <Candle position={[-0.9, 0.02, 0.04]} />
        <Candle position={[0.78, 0.02, 0.04]} height={0.18} />
        <Candle position={[0.98, 0.02, 0.04]} height={0.26} />
      </group>

      <Wreath position={[0, 2.42, -3.88]} />
      <WallLights />

      <group position={[1.55, 0, -3.15]} rotation={[0, -0.3, 0]}>
        <FitModel url={villageModels.gifts} height={0.35} fit="width" brighten={1.35} />
      </group>
      <group position={[-1.65, 0, -3.2]} rotation={[0, 0.45, 0]}>
        <FitModel url={villageModels.gifts} height={0.3} fit="width" brighten={1.35} />
      </group>
    </group>
  );
};
