import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FitModel, villageModels } from './FitModel';
import { FireplaceFire } from './FireplaceFire';
import { ChristmasDecor } from './ChristmasDecor';
import { ReadingNook } from './ReadingNook';
import { ToyTrain } from './ToyTrain';
import { TREE_POSITION } from '../../../lib/roomLayout';

const WALL = '#e8d5bc';
const TRIM = '#5a3d28';
const FLOOR = '#6e4528';
const CEILING = '#e8d9c8';

const ROOM = 8;
const HALF = ROOM / 2;
const WALL_H = 3.2;
const WALL_T = 0.12;

/** Side walls stop before the open stage so orbit does not hit them. */
const SIDE_Z_MIN = -HALF;
const SIDE_Z_MAX = 1.2;
const SIDE_DEPTH = SIDE_Z_MAX - SIDE_Z_MIN;
const SIDE_Z_CENTER = (SIDE_Z_MIN + SIDE_Z_MAX) / 2;

const WINDOW_W = 1.9;
const WINDOW_H = 1.55;
const WINDOW_CENTER_Y = 1.55;
const WINDOW_CENTER_Z = -0.6;

function WallPanel({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={WALL} roughness={0.92} />
    </mesh>
  );
}

/** Thick disc rug under the corner tree — sized to clear the walls. */
function RoomRug({ position }: { position: [number, number, number] }) {
  const r = 1.1;
  return (
    <group position={position}>
      <mesh receiveShadow>
        <cylinderGeometry args={[r, r, 0.05, 64]} />
        <meshStandardMaterial color="#4a1f22" roughness={0.92} />
      </mesh>
      <mesh receiveShadow position={[0, 0.028, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[r * 0.89, r * 0.99, 64]} />
        <meshStandardMaterial color="#d4a017" roughness={0.78} />
      </mesh>
      <mesh receiveShadow position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[r * 0.36, r * 0.42, 64]} />
        <meshStandardMaterial color="#c9a227" roughness={0.8} />
      </mesh>
    </group>
  );
}

function WindowSnow() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 60;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Local window space: X along wall, Y up, Z toward exterior (negative)
      data[i * 3] = -WINDOW_W * 0.42 + Math.random() * WINDOW_W * 0.84;
      data[i * 3 + 1] = 0.15 + Math.random() * (WINDOW_H - 0.3);
      data[i * 3 + 2] = -0.05 - Math.random() * 0.3;
    }
    return data;
  }, []);

  useFrame((_, delta) => {
    if (!points.current) return;
    const attr = points.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      let y = attr.getY(i) - delta * (0.28 + (i % 5) * 0.06);
      if (y < 0.12) y = WINDOW_H - 0.12;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#dfe8ff" size={0.035} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

/**
 * Built-in night window for the right wall.
 * Local space after yaw: X along wall, Y up, +Z into the room, -Z exterior.
 */
function RoomWindow() {
  const frame = '#efe6d8';
  const mullion = '#e4d9c8';
  const curtain = '#3d4d78';
  const fw = 0.08;
  const midY = WINDOW_H / 2;
  const stars = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        x: -0.7 + (i % 7) * 0.22 + (i % 2) * 0.05,
        y: midY - 0.45 + Math.floor(i / 7) * 0.55 + (i % 3) * 0.08,
        s: 0.012 + (i % 3) * 0.006,
      })),
    [midY],
  );

  return (
    // Sit on the interior face of the wall so trim seals the opening.
    <group position={[HALF - WALL_T / 2 - 0.02, WINDOW_CENTER_Y - WINDOW_H / 2, WINDOW_CENTER_Z]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Night sky fills the wall opening */}
      <mesh position={[0, midY, -0.08]}>
        <planeGeometry args={[WINDOW_W + 0.08, WINDOW_H + 0.08]} />
        <meshBasicMaterial color="#0c1428" />
      </mesh>
      <mesh position={[0.45, midY + 0.35, -0.07]}>
        <circleGeometry args={[0.11, 16]} />
        <meshBasicMaterial color="#e8eef8" />
      </mesh>
      <mesh position={[0.45, midY + 0.35, -0.065]}>
        <circleGeometry args={[0.16, 16]} />
        <meshBasicMaterial color="#9eb6ff" transparent opacity={0.22} />
      </mesh>
      {stars.map((star, i) => (
        <mesh key={i} position={[star.x, star.y, -0.07]}>
          <circleGeometry args={[star.s, 6]} />
          <meshBasicMaterial color="#f5f8ff" />
        </mesh>
      ))}

      {/* Glass sheen */}
      <mesh position={[0, midY, 0.01]}>
        <planeGeometry args={[WINDOW_W - fw * 1.5, WINDOW_H - fw * 1.5]} />
        <meshStandardMaterial
          color="#243552"
          roughness={0.12}
          metalness={0.4}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Interior casing overlaps the wall edge so no dark gap shows */}
      <mesh position={[0, WINDOW_H / 2 + 0.06, 0.04]} castShadow>
        <boxGeometry args={[WINDOW_W + 0.28, 0.12, 0.05]} />
        <meshStandardMaterial color={frame} roughness={0.78} />
      </mesh>
      <mesh position={[0, -0.02, 0.05]} castShadow>
        <boxGeometry args={[WINDOW_W + 0.28, 0.12, 0.08]} />
        <meshStandardMaterial color={frame} roughness={0.78} />
      </mesh>
      <mesh position={[-(WINDOW_W / 2 + 0.08), midY, 0.04]} castShadow>
        <boxGeometry args={[0.12, WINDOW_H + 0.2, 0.05]} />
        <meshStandardMaterial color={frame} roughness={0.78} />
      </mesh>
      <mesh position={[WINDOW_W / 2 + 0.08, midY, 0.04]} castShadow>
        <boxGeometry args={[0.12, WINDOW_H + 0.2, 0.05]} />
        <meshStandardMaterial color={frame} roughness={0.78} />
      </mesh>

      {/* Inner sash */}
      <mesh position={[0, WINDOW_H - fw / 2, 0.02]} castShadow>
        <boxGeometry args={[WINDOW_W - 0.02, fw, 0.06]} />
        <meshStandardMaterial color={mullion} roughness={0.72} />
      </mesh>
      <mesh position={[0, fw / 2 + 0.04, 0.02]} castShadow>
        <boxGeometry args={[WINDOW_W - 0.02, fw, 0.06]} />
        <meshStandardMaterial color={mullion} roughness={0.72} />
      </mesh>
      <mesh position={[-WINDOW_W / 2 + fw / 2 + 0.01, midY, 0.02]} castShadow>
        <boxGeometry args={[fw, WINDOW_H - 0.04, 0.06]} />
        <meshStandardMaterial color={mullion} roughness={0.72} />
      </mesh>
      <mesh position={[WINDOW_W / 2 - fw / 2 - 0.01, midY, 0.02]} castShadow>
        <boxGeometry args={[fw, WINDOW_H - 0.04, 0.06]} />
        <meshStandardMaterial color={mullion} roughness={0.72} />
      </mesh>

      {/* Cross mullions */}
      <mesh position={[0, midY, 0.025]} castShadow>
        <boxGeometry args={[fw * 0.65, WINDOW_H - fw * 2.2, 0.05]} />
        <meshStandardMaterial color={mullion} roughness={0.7} />
      </mesh>
      <mesh position={[0, midY, 0.025]} castShadow>
        <boxGeometry args={[WINDOW_W - fw * 2.2, fw * 0.65, 0.05]} />
        <meshStandardMaterial color={mullion} roughness={0.7} />
      </mesh>

      {/* Sill */}
      <mesh position={[0, 0.05, 0.12]} castShadow>
        <boxGeometry args={[WINDOW_W + 0.22, 0.05, 0.16]} />
        <meshStandardMaterial color={frame} roughness={0.74} />
      </mesh>

      {/* Curtains pulled to the sides */}
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * (WINDOW_W / 2 - 0.1), midY + 0.02, 0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.18, WINDOW_H - 0.08, 0.04]} />
            <meshStandardMaterial color={curtain} roughness={0.9} />
          </mesh>
          <mesh castShadow position={[side * -0.05, -0.04, 0.03]}>
            <boxGeometry args={[0.09, WINDOW_H - 0.18, 0.035]} />
            <meshStandardMaterial color="#4a5d8a" roughness={0.88} />
          </mesh>
          <mesh position={[0, WINDOW_H / 2 - 0.1, 0.01]}>
            <boxGeometry args={[0.22, 0.04, 0.05]} />
            <meshStandardMaterial color="#c9a227" roughness={0.65} />
          </mesh>
        </group>
      ))}

      <pointLight position={[0, midY * 0.85, 0.4]} color="#9eb6ff" intensity={0.3} distance={2.8} decay={2} />

      <WindowSnow />
    </group>
  );
}

export const LivingRoom: React.FC = () => {
  const rightBelowH = WINDOW_CENTER_Y - WINDOW_H / 2;
  const rightAboveH = WALL_H - (WINDOW_CENTER_Y + WINDOW_H / 2);
  const frontPanelDepth = SIDE_Z_MAX - (WINDOW_CENTER_Z + WINDOW_W / 2);
  const backPanelDepth = WINDOW_CENTER_Z - WINDOW_W / 2 - SIDE_Z_MIN;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM, ROOM]} />
        <meshStandardMaterial color={FLOOR} roughness={0.88} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WALL_H, 0]} receiveShadow>
        <planeGeometry args={[ROOM, ROOM]} />
        <meshStandardMaterial color={CEILING} roughness={0.95} />
      </mesh>

      {/* Left wall — back half only */}
      <WallPanel position={[-HALF, WALL_H / 2, SIDE_Z_CENTER]} size={[WALL_T, WALL_H, SIDE_DEPTH]} />
      {/* Back wall */}
      <WallPanel position={[0, WALL_H / 2, -HALF]} size={[ROOM, WALL_H, WALL_T]} />

      {/* Right wall with window — back half only */}
      <WallPanel
        position={[HALF, rightBelowH / 2, SIDE_Z_CENTER]}
        size={[WALL_T, rightBelowH, SIDE_DEPTH]}
      />
      <WallPanel
        position={[HALF, WINDOW_CENTER_Y + WINDOW_H / 2 + rightAboveH / 2, SIDE_Z_CENTER]}
        size={[WALL_T, rightAboveH, SIDE_DEPTH]}
      />
      <WallPanel
        position={[HALF, WINDOW_CENTER_Y, WINDOW_CENTER_Z - WINDOW_W / 2 - backPanelDepth / 2]}
        size={[WALL_T, WINDOW_H, Math.max(backPanelDepth, 0.05)]}
      />
      <WallPanel
        position={[HALF, WINDOW_CENTER_Y, WINDOW_CENTER_Z + WINDOW_W / 2 + frontPanelDepth / 2]}
        size={[WALL_T, WINDOW_H, Math.max(frontPanelDepth, 0.05)]}
      />

      <mesh position={[0, 0.06, -HALF + 0.02]} castShadow>
        <boxGeometry args={[ROOM - 0.2, 0.12, 0.06]} />
        <meshStandardMaterial color={TRIM} roughness={0.7} />
      </mesh>
      <mesh position={[-HALF + 0.02, 0.06, SIDE_Z_CENTER]} castShadow>
        <boxGeometry args={[0.06, 0.12, SIDE_DEPTH - 0.2]} />
        <meshStandardMaterial color={TRIM} roughness={0.7} />
      </mesh>
      <mesh position={[HALF - 0.02, 0.06, SIDE_Z_CENTER]} castShadow>
        <boxGeometry args={[0.06, 0.12, SIDE_DEPTH - 0.2]} />
        <meshStandardMaterial color={TRIM} roughness={0.7} />
      </mesh>

      <RoomRug position={[TREE_POSITION[0], 0.025, TREE_POSITION[2]]} />

      <group position={[0, 0, -3.55]}>
        <FitModel url={villageModels.fireplace} height={2.05} brighten={1.5} />
        <FireplaceFire position={[0, 0.45, 0.48]} />
      </group>

      <group position={[-3.55, 0, -1.1]} rotation={[0, Math.PI / 2, 0]}>
        <FitModel url={villageModels.couch} height={0.95} brighten={1.4} />
      </group>

      <group position={[-3.2, 0, 0.9]}>
        <FitModel url={villageModels.floorLamp} height={2.05} brighten={1.5} />
        <pointLight position={[0, 1.7, 0]} color="#ffe2b0" intensity={1.15} distance={5.5} decay={2} />
      </group>

      <RoomWindow />

      <ChristmasDecor />
      <ToyTrain />
      <ReadingNook />
    </group>
  );
};
