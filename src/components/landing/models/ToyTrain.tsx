import { useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { TREE_POSITION } from '../../../lib/roomLayout';
import { villageModels } from './FitModel';

/**
 * Tight loop around the trunk, inside the gift ring.
 * Y sits on top of the tree rug (cylinder center 0.025, height 0.05).
 */
const GROUP_POSITION: [number, number, number] = [
  TREE_POSITION[0],
  0.058,
  TREE_POSITION[2],
];
const CAR_HEIGHT = 0.06;
const BRIGHTEN = 1.35;
const LAPS_PER_SECOND = 0.055;
/** Circle radius — outside the trunk, inside the gift horseshoe. */
const RX = 0.38;
const RZ = 0.38;
const GAUGE = 0.022;
const RAIL_Y = 0.02;
const RAIL_TUBE = 0.007;
const TIE_SIZE: [number, number, number] = [0.056, 0.006, 0.016];
/** Dark wood ring under the rails. */
const BED_INNER = RX - 0.065;
const BED_OUTER = RX + 0.065;
const BED_Y = 0.004;
/** Cars sit just above the rail tubes. */
const CAR_Y = 0.028;
/**
 * Fitted X lengths at CAR_HEIGHT. Space centers by half+half + a small coupler
 * so cars sit close without overlapping.
 */
const CAR_LENGTHS = [0.135, 0.164, 0.164] as const;
const COUPLER_GAP = 0.02;
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

function buildCarSlots(): CarSlot[] {
  const urls = [villageModels.trainLoco, villageModels.trainWagon, villageModels.trainCarriage];
  const offsets = [0];
  for (let i = 1; i < urls.length; i++) {
    const arc = CAR_LENGTHS[i - 1] / 2 + CAR_LENGTHS[i] / 2 + COUPLER_GAP;
    offsets.push(offsets[i - 1] - arc / RX);
  }
  return urls.map((url, i) => ({ url, thetaOffset: offsets[i] }));
}

const CARS = buildCarSlots();

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
    rails.push(new THREE.TubeGeometry(curve, 96, RAIL_TUBE, 6, true));
  }

  const ties: { position: [number, number, number]; yaw: number }[] = [];
  const tieCount = 28;
  for (let i = 0; i < tieCount; i++) {
    const theta = (i / tieCount) * Math.PI * 2;
    const { x, z, tx, tz } = pointOnEllipse(theta, RX, RZ);
    ties.push({
      position: [x, 0.003, z],
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
  const track = useMemo(() => buildRails(), [RX, RZ, GAUGE, RAIL_TUBE]);

  useFrame(({ clock }) => {
    const spin = clock.elapsedTime * LAPS_PER_SECOND * Math.PI * 2;
    for (let i = 0; i < CARS.length; i++) {
      const group = refs[i].current;
      if (!group) continue;
      const theta = spin + CARS[i].thetaOffset;
      const { x, z, tx, tz } = pointOnEllipse(theta, RX, RZ);
      group.position.set(x, CAR_Y, z);
      group.rotation.y = FORWARD_FROM_TANGENT(tx, tz);
    }
  });

  return (
    <group position={GROUP_POSITION}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BED_Y, 0]}>
        <ringGeometry args={[BED_INNER, BED_OUTER, 64]} />
        <meshBasicMaterial
          color="#3a2418"
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {track.ties.map((tie, index) => (
        <mesh key={`tie-${index}`} position={tie.position} rotation={[0, tie.yaw, 0]}>
          <boxGeometry args={TIE_SIZE} />
          <meshBasicMaterial color="#5c3a22" />
        </mesh>
      ))}
      {track.rails.map((geometry, index) => (
        <mesh key={`rail-${index}`} geometry={geometry}>
          <meshBasicMaterial color="#8a8070" />
        </mesh>
      ))}
      <TrainCar url={CARS[0].url} groupRef={locoRef} />
      <TrainCar url={CARS[1].url} groupRef={wagonRef} />
      <TrainCar url={CARS[2].url} groupRef={carriageRef} />
    </group>
  );
}
