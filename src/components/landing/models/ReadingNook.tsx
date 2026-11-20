import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TREE_POSITION } from '../../../lib/roomLayout';

const FABRIC = '#6e2430';
const CUSHION = '#f3ead7';
const THROW = '#8f3a3a';
const WOOD = '#5c3b24';
const WOOD_TOP = '#8b5a32';

/**
 * Open floor left of the gifts, facing the tree so the nook reads in the
 * default camera with the train parked in front.
 */
const RECLINER_POSITION: [number, number, number] = [1.1, 0, -1.2];
/** Camera-side of the chair so the cocoa reads in the default view. */
const TABLE_POSITION: [number, number, number] = [1.55, 0, -1.0];
/** Footrest (+Z) points at the tree. */
const RECLINER_YAW = Math.atan2(
  TREE_POSITION[0] - RECLINER_POSITION[0],
  TREE_POSITION[2] - RECLINER_POSITION[2],
);

function SteamWisp({ phase, x }: { phase: number; x: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const cycle = (clock.elapsedTime * 0.35 + phase) % 1;
    mesh.current.position.y = 0.1 + cycle * 0.18;
    mesh.current.position.x = x + Math.sin(cycle * Math.PI * 2 + phase) * 0.01;
    mesh.current.scale.setScalar(0.75 + cycle * 0.8);
    const material = mesh.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.5 * (1 - cycle);
  });

  return (
    <mesh ref={mesh} position={[x, 0.09, 0]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#f7f1e8" transparent opacity={0.3} depthWrite={false} />
    </mesh>
  );
}

function CocoaMug() {
  return (
    <group position={[-0.05, 0.434, 0.02]}>
      <mesh castShadow position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.032, 0.028, 0.07, 14]} />
        <meshStandardMaterial color="#c41e2a" roughness={0.55} />
      </mesh>
      <mesh position={[0.038, 0.034, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.02, 0.006, 6, 12]} />
        <meshStandardMaterial color="#a31822" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.068, 0]}>
        <cylinderGeometry args={[0.026, 0.026, 0.008, 14]} />
        <meshStandardMaterial color="#4a2a1a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.073, 0]} scale={[1, 0.45, 1]}>
        <sphereGeometry args={[0.028, 12, 10]} />
        <meshStandardMaterial color="#f4efe2" roughness={0.85} />
      </mesh>
      <SteamWisp phase={0} x={-0.006} />
      <SteamWisp phase={0.45} x={0.008} />
    </group>
  );
}

function Cookie({ position }: { position: [number, number, number] }) {
  const chips: [number, number][] = [
    [0.008, 0.006],
    [-0.009, -0.004],
    [0.004, -0.01],
  ];
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.024, 0.024, 0.011, 12]} />
        <meshStandardMaterial color="#c48a4a" roughness={0.78} />
      </mesh>
      {chips.map(([x, z], index) => (
        <mesh key={index} position={[x, 0.007, z]} castShadow>
          <sphereGeometry args={[0.005, 6, 6]} />
          <meshStandardMaterial color="#3a2418" roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function SideTable() {
  const top = 0.42;
  const legs: [number, number][] = [
    [-0.13, -0.13],
    [0.13, -0.13],
    [-0.13, 0.13],
    [0.13, 0.13],
  ];
  return (
    <group position={TABLE_POSITION}>
      {legs.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, top / 2, z]} castShadow>
          <cylinderGeometry args={[0.015, 0.018, top, 8]} />
          <meshStandardMaterial color={WOOD} roughness={0.78} />
        </mesh>
      ))}
      <mesh position={[0, top, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.028, 20]} />
        <meshStandardMaterial color={WOOD_TOP} roughness={0.68} />
      </mesh>
      <mesh position={[0.07, top + 0.02, -0.015]} receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.012, 20]} />
        <meshStandardMaterial color="#f4efe2" roughness={0.5} />
      </mesh>
      <Cookie position={[0.05, top + 0.032, 0.008]} />
      <Cookie position={[0.088, top + 0.032, -0.028]} />
      <Cookie position={[0.078, top + 0.032, 0.02]} />
      <CocoaMug />
    </group>
  );
}

function Recliner() {
  return (
    <group position={RECLINER_POSITION} rotation={[0, RECLINER_YAW, 0]}>
      {[
        [-0.22, 0.1, -0.16],
        [0.22, 0.1, -0.16],
        [-0.22, 0.1, 0.16],
        [0.22, 0.1, 0.16],
      ].map((position) => (
        <mesh key={position.join(',')} position={position as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.2, 8]} />
          <meshStandardMaterial color={WOOD} roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 0.28, 0.02]} castShadow>
        <boxGeometry args={[0.62, 0.14, 0.52]} />
        <meshStandardMaterial color={FABRIC} roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.36, 0.04]} castShadow>
        <boxGeometry args={[0.5, 0.06, 0.4]} />
        <meshStandardMaterial color={CUSHION} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.62, -0.22]} rotation={[-0.32, 0, 0]} castShadow>
        <boxGeometry args={[0.62, 0.55, 0.1]} />
        <meshStandardMaterial color={FABRIC} roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.78, -0.16]} rotation={[-0.32, 0, 0]} castShadow>
        <boxGeometry args={[0.36, 0.16, 0.06]} />
        <meshStandardMaterial color={CUSHION} roughness={0.8} />
      </mesh>
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} position={[x, 0.42, 0.02]} castShadow>
          <boxGeometry args={[0.1, 0.22, 0.52]} />
          <meshStandardMaterial color={FABRIC} roughness={0.86} />
        </mesh>
      ))}
      <mesh position={[0, 0.22, 0.42]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.46, 0.08, 0.28]} />
        <meshStandardMaterial color={FABRIC} roughness={0.86} />
      </mesh>
      <mesh position={[0.36, 0.48, 0.06]} rotation={[0.5, 0.2, 0.7]} castShadow>
        <boxGeometry args={[0.18, 0.035, 0.34]} />
        <meshStandardMaterial color={THROW} roughness={0.92} />
      </mesh>
    </group>
  );
}

export function ReadingNook() {
  return (
    <group>
      <Recliner />
      <SideTable />
    </group>
  );
}
