import { useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { villageModels } from './FitModel';

/** On the floor in front of the recliner, toward the tree. */
const GROUP_POSITION: [number, number, number] = [1.55, 0, -1.7];
const CAR_HEIGHT = 0.11;
const BRIGHTEN = 1.35;
const LAPS_PER_SECOND = 0.045;
/** Arc spacing between cars (radians on the oval). */
const CAR_GAP = 0.72;
const RX = 0.42;
const RZ = 0.34;
const GAUGE = 0.026;
const RAIL_Y = 0.01;
/**
 * Quaternius trains are long on X. The nose points along -X in the GLB, so
 * align local -X with the ellipse tangent: R_y(θ)·(-1,0,0) = (-cos θ, 0, sin θ).
 * That gives θ = atan2(tz, -tx) ≡ atan2(-tz, tx) + π.
 */
const FORWARD_FROM_TANGENT = (tx: number, tz: number) => Math.atan2(-tz, tx) + Math.PI;

type CarSlot = {
  url: string;
  thetaOffset: number;
};

const CARS: CarSlot[] = [
  { url: villageModels.trainLoco, thetaOffset: 0 },
  { url: villageModels.trainWagon, thetaOffset: -CAR_GAP },
  { url: villageModels.trainCarriage, thetaOffset: -CAR_GAP * 2 },
];

function fittedClone(source: THREE.Object3D, height: number, brighten: number) {
  const root = source.clone(true);
  root.position.set(0, 0, 0);
  root.rotation.set(0, 0, 0);
  root.scale.set(1, 1, 1);
  root.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const factor = height / Math.max(size.y, 1e-4);
  root.scale.multiplyScalar(factor);
  root.updateMatrixWorld(true);

  const fitted = new THREE.Box3().setFromObject(root);
  const center = fitted.getCenter(new THREE.Vector3());
  root.position.x -= center.x;
  root.position.z -= center.z;
  root.position.y -= fitted.min.y;
  root.updateMatrixWorld(true);

  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.castShadow = true;
    child.receiveShadow = true;
    if (brighten <= 1) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    const nextMats = materials.map((material) => {
      const next = material.clone();
      if (next instanceof THREE.MeshStandardMaterial && !next.map) {
        next.color.multiplyScalar(brighten);
        next.emissive.copy(next.color);
        next.emissiveIntensity = 0.28;
      }
      return next;
    });
    child.material = nextMats.length === 1 ? nextMats[0] : nextMats;
  });

  return root;
}

function pointOnEllipse(theta: number, rx: number, rz: number) {
  const x = Math.cos(theta) * rx;
  const z = Math.sin(theta) * rz;
  const tx = -Math.sin(theta) * rx;
  const tz = Math.cos(theta) * rz;
  const len = Math.hypot(tx, tz) || 1;
  return { x, z, tx: tx / len, tz: tz / len };
}

function buildRails() {
  const rails: THREE.TubeGeometry[] = [];
  for (const side of [-1, 1] as const) {
    const pts: THREE.Vector3[] = [];
    const steps = 64;
    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      const { x, z, tx, tz } = pointOnEllipse(theta, RX, RZ);
      const nx = -tz;
      const nz = tx;
      pts.push(new THREE.Vector3(x + nx * GAUGE * side, RAIL_Y, z + nz * GAUGE * side));
    }
    const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.1);
    rails.push(new THREE.TubeGeometry(curve, 96, 0.006, 6, true));
  }

  const ties: { position: [number, number, number]; yaw: number }[] = [];
  const tieCount = 28;
  for (let i = 0; i < tieCount; i++) {
    const theta = (i / tieCount) * Math.PI * 2;
    const { x, z, tx, tz } = pointOnEllipse(theta, RX, RZ);
    ties.push({
      position: [x, 0.004, z],
      yaw: Math.atan2(tx, tz),
    });
  }

  return { rails, ties };
}

function TrainCar({ url, groupRef }: { url: string; groupRef: RefObject<THREE.Group | null> }) {
  const gltf = useGLTF(url);
  const object = useMemo(() => fittedClone(gltf.scene, CAR_HEIGHT, BRIGHTEN), [gltf.scene]);
  return (
    <group ref={groupRef}>
      <primitive object={object} />
    </group>
  );
}

export function ToyTrain() {
  const locoRef = useRef<THREE.Group>(null);
  const wagonRef = useRef<THREE.Group>(null);
  const carriageRef = useRef<THREE.Group>(null);
  const refs = [locoRef, wagonRef, carriageRef];
  const track = useMemo(() => buildRails(), []);

  useFrame(({ clock }) => {
    const spin = clock.elapsedTime * LAPS_PER_SECOND * Math.PI * 2;
    for (let i = 0; i < CARS.length; i++) {
      const group = refs[i].current;
      if (!group) continue;
      const theta = spin + CARS[i].thetaOffset;
      const { x, z, tx, tz } = pointOnEllipse(theta, RX, RZ);
      group.position.set(x, 0, z);
      group.rotation.y = FORWARD_FROM_TANGENT(tx, tz);
    }
  });

  return (
    <group position={GROUP_POSITION}>
      {track.ties.map((tie, index) => (
        <mesh key={`tie-${index}`} position={tie.position} rotation={[0, tie.yaw, 0]} receiveShadow>
          <boxGeometry args={[0.07, 0.008, 0.018]} />
          <meshStandardMaterial color="#5a3a22" roughness={0.9} />
        </mesh>
      ))}
      {track.rails.map((geometry, index) => (
        <mesh key={`rail-${index}`} geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial color="#5c5c5c" metalness={0.55} roughness={0.4} />
        </mesh>
      ))}
      <TrainCar url={CARS[0].url} groupRef={locoRef} />
      <TrainCar url={CARS[1].url} groupRef={wagonRef} />
      <TrainCar url={CARS[2].url} groupRef={carriageRef} />
    </group>
  );
}
