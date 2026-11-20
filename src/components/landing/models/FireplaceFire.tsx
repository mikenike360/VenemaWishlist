import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const EMBER_COUNT = 36;

function RisingEmbers() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(EMBER_COUNT * 3);
    for (let i = 0; i < EMBER_COUNT; i++) {
      data[i * 3] = (Math.random() - 0.5) * 0.32;
      data[i * 3 + 1] = Math.random() * 0.55;
      data[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
    }
    return data;
  }, []);
  const colors = useMemo(() => {
    const data = new Float32Array(EMBER_COUNT * 3);
    for (let i = 0; i < EMBER_COUNT; i++) {
      data[i * 3] = 1;
      data[i * 3 + 1] = 0.5;
      data[i * 3 + 2] = 0.12;
    }
    return data;
  }, []);
  const phases = useMemo(() => Float32Array.from({ length: EMBER_COUNT }, () => Math.random()), []);

  useFrame((_, delta) => {
    if (!points.current) return;
    const attr = points.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const colorAttr = points.current.geometry.getAttribute('color') as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      let y = attr.getY(i) + delta * (0.16 + phases[i] * 0.2);
      const x = attr.getX(i) + Math.sin(y * 14 + phases[i] * 8) * delta * 0.05;
      if (y > 0.58) {
        y = 0.02;
        attr.setX(i, (Math.random() - 0.5) * 0.32);
        attr.setZ(i, (Math.random() - 0.5) * 0.08);
      } else {
        attr.setX(i, x);
      }
      attr.setY(i, y);
      const fade = 1 - y / 0.58;
      colorAttr.setXYZ(i, 1, 0.28 + fade * 0.5, 0.05 * fade);
    }
    attr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  });

  return (
    <points ref={points} position={[0, 0.1, 0.06]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.026} vertexColors transparent opacity={0.9} depthWrite={false} toneMapped={false} />
    </points>
  );
}

interface FireplaceFireProps {
  position?: [number, number, number];
}

/**
 * Compact hearth glow for the solid Quaternius fireplace.
 * Embers + soft glow planes + warm flicker — readable without painting through the tree.
 */
export const FireplaceFire: React.FC<FireplaceFireProps> = ({ position = [0, 0.45, 0.48] }) => {
  const light = useRef<THREE.PointLight>(null);
  const bounce = useRef<THREE.PointLight>(null);
  const fill = useRef<THREE.PointLight>(null);
  const glowA = useRef<THREE.Mesh>(null);
  const glowB = useRef<THREE.Mesh>(null);
  const ember = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const flicker = 0.86 + Math.sin(t * 9.8) * 0.1 + Math.sin(t * 15.4) * 0.07;
    if (light.current) {
      light.current.intensity = 1.85 * flicker;
      light.current.position.x = Math.sin(t * 2.6) * 0.04;
    }
    if (bounce.current) {
      bounce.current.intensity = 0.95 * flicker;
      bounce.current.position.x = Math.sin(t * 2.1) * 0.06;
    }
    if (fill.current) {
      fill.current.intensity = 0.72 * flicker;
    }
    if (glowA.current) {
      glowA.current.scale.setScalar(0.95 + Math.sin(t * 7.2) * 0.08);
      const mat = glowA.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.55 + Math.sin(t * 6.5) * 0.12;
    }
    if (glowB.current) {
      glowB.current.scale.set(1 + Math.sin(t * 8.1 + 1) * 0.1, 1 + Math.sin(t * 5.4) * 0.14, 1);
      const mat = glowB.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(t * 9.2 + 0.5) * 0.1;
    }
    if (ember.current) {
      const mat = ember.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.75 + Math.sin(t * 11.3) * 0.12;
    }
  });

  return (
    <group position={position}>
      {/* Dark recess so the mantel reads as a hollow opening */}
      <mesh position={[0, 0.26, -0.05]}>
        <boxGeometry args={[0.88, 0.72, 0.1]} />
        <meshStandardMaterial color="#140e0c" roughness={0.96} />
      </mesh>

      {/* Logs */}
      <mesh position={[-0.1, 0.05, 0.02]} rotation={[0.18, 0.4, 0.1]} castShadow>
        <cylinderGeometry args={[0.04, 0.045, 0.34, 8]} />
        <meshStandardMaterial color="#4a2c18" roughness={0.9} />
      </mesh>
      <mesh position={[0.11, 0.055, 0]} rotation={[-0.1, -0.5, -0.14]} castShadow>
        <cylinderGeometry args={[0.035, 0.04, 0.3, 8]} />
        <meshStandardMaterial color="#3d2414" roughness={0.92} />
      </mesh>
      <mesh position={[0.0, 0.09, 0.03]} rotation={[0.05, 0.1, 0.32]} castShadow>
        <cylinderGeometry args={[0.03, 0.035, 0.24, 8]} />
        <meshStandardMaterial color="#5a3520" roughness={0.88} />
      </mesh>

      {/* Ember bed */}
      <mesh ref={ember} position={[0, 0.07, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 18]} />
        <meshBasicMaterial color="#ff5a18" transparent opacity={0.82} depthWrite={false} depthTest toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.09, 0.05]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color="#ffb040" transparent opacity={0.5} depthWrite={false} depthTest toneMapped={false} />
      </mesh>

      {/* Soft low glow — small so it stays in the hearth */}
      <mesh ref={glowA} position={[0, 0.2, 0.06]}>
        <planeGeometry args={[0.36, 0.32]} />
        <meshBasicMaterial color="#ff8a30" transparent opacity={0.55} depthWrite={false} depthTest toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={glowB} position={[0.02, 0.24, 0.07]} rotation={[0, 0.25, 0]}>
        <planeGeometry args={[0.28, 0.36]} />
        <meshBasicMaterial color="#ffcc66" transparent opacity={0.4} depthWrite={false} depthTest toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      <pointLight
        ref={light}
        color="#ff7a3c"
        intensity={1.85}
        distance={7}
        decay={2}
        position={[0, 0.3, 0.15]}
      />
      {/* Bounce into the room — warms rug, stockings, and tree trunk */}
      <pointLight
        ref={bounce}
        color="#ff8a45"
        intensity={0.95}
        distance={5.5}
        decay={2}
        position={[0, 0.55, 0.55]}
      />
      <pointLight
        ref={fill}
        color="#ffb060"
        intensity={0.72}
        distance={4.5}
        decay={2}
        position={[0, 0.25, 0.18]}
      />

      <RisingEmbers />
    </group>
  );
};
