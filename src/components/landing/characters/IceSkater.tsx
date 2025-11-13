import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { skaterPositions, getNextSkaterId } from '../utils/positionTracking';

interface IceSkaterProps {
  position: [number, number, number];
  radius?: number;
  speed?: number;
  startAngle?: number;
  pathType?: 'circular' | 'figure8' | 'spiral' | 'infinity' | 'laps' | 'zigzag';
  bodyColor?: string;
  pantsColor?: string;
  skinTone?: string;
  scale?: number;
}

export const IceSkater: React.FC<IceSkaterProps> = ({
  position,
  radius = 2,
  speed = 0.5,
  startAngle = 0,
  pathType = 'circular',
  bodyColor = '#FF1493',
  pantsColor = '#000080',
  skinTone = '#FFDBAC',
  scale = 1
}) => {
  const skaterRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const skaterId = useRef(getNextSkaterId()).current;

  useFrame((state, delta) => {
    if (skaterRef.current && bodyRef.current && leftArmRef.current && rightArmRef.current) {
      timeRef.current += delta * speed;
      
      let newX = position[0];
      let newZ = position[2];
      let rotationY = 0;
      let leanAmount = 0;
      
      if (pathType === 'figure8') {
        const t = startAngle + timeRef.current;
        newX = position[0] + Math.sin(t) * radius;
        newZ = position[2] + Math.sin(t * 2) * radius * 0.5;
        rotationY = Math.atan2(Math.cos(t * 2) * radius * 0.5, Math.cos(t) * radius) + Math.PI / 2;
        leanAmount = Math.sin(t * 2) * 0.15;
      } else if (pathType === 'spiral') {
        const t = startAngle + timeRef.current;
        const spiralRadius = radius * (0.3 + (Math.sin(t * 0.3) + 1) * 0.35);
        newX = position[0] + Math.cos(t) * spiralRadius;
        newZ = position[2] + Math.sin(t) * spiralRadius;
        rotationY = t + Math.PI / 2;
        leanAmount = Math.sin(t * 2) * 0.12;
      } else if (pathType === 'infinity') {
        const t = startAngle + timeRef.current;
        newX = position[0] + Math.sin(t) * radius;
        newZ = position[2] + Math.sin(t * 2) * radius * 0.6;
        rotationY = Math.atan2(Math.cos(t * 2) * radius * 0.6, Math.cos(t) * radius) + Math.PI / 2;
        leanAmount = Math.sin(t * 2) * 0.18;
      } else if (pathType === 'laps') {
        const t = startAngle + timeRef.current;
        const lapRadius = radius * (0.4 + (Math.floor(t / Math.PI) % 3) * 0.3);
        newX = position[0] + Math.cos(t) * lapRadius;
        newZ = position[2] + Math.sin(t) * lapRadius;
        rotationY = t + Math.PI / 2;
        leanAmount = Math.sin(t * 2) * 0.1;
      } else if (pathType === 'zigzag') {
        const t = startAngle + timeRef.current;
        const zigzagX = Math.sin(t * 2) * radius * 0.8;
        const zigzagZ = (Math.sin(t) + 1) / 2 * radius * 1.2 - radius * 0.6;
        newX = position[0] + zigzagX;
        newZ = position[2] + zigzagZ;
        rotationY = Math.atan2(Math.cos(t) * radius * 1.2, Math.cos(t * 2) * radius * 0.8) + Math.PI / 2;
        leanAmount = Math.sin(t * 4) * 0.12;
      } else {
        const angle = startAngle + timeRef.current;
        newX = position[0] + Math.cos(angle) * radius;
        newZ = position[2] + Math.sin(angle) * radius;
        rotationY = angle + Math.PI / 2;
        leanAmount = Math.sin(timeRef.current * 2) * 0.1;
      }
      
      const minSkaterSeparation = 0.9;
      let steerX = 0;
      let steerZ = 0;
      
      const distFromCenter = Math.sqrt(Math.pow(newX - position[0], 2) + Math.pow(newZ - position[2], 2));
      if (distFromCenter > 3.5) {
        const angle = Math.atan2(newZ - position[2], newX - position[0]);
        const pushStrength = (distFromCenter - 3.5) / 0.5;
        steerX -= Math.cos(angle) * pushStrength * 0.5;
        steerZ -= Math.sin(angle) * pushStrength * 0.5;
      }
      
      const otherSkaters = Array.from(skaterPositions.entries());
      for (const [id, otherPos] of otherSkaters) {
        if (id === skaterId) continue;
        const dist = Math.sqrt(Math.pow(newX - otherPos.x, 2) + Math.pow(newZ - otherPos.z, 2));
        if (dist < minSkaterSeparation) {
          const angle = Math.atan2(newZ - otherPos.z, newX - otherPos.x);
          const pushStrength = (minSkaterSeparation - dist) / minSkaterSeparation;
          steerX += Math.cos(angle) * pushStrength * 0.5;
          steerZ += Math.sin(angle) * pushStrength * 0.5;
        }
      }
      
      newX += steerX;
      newZ += steerZ;
      
      skaterPositions.set(skaterId, { x: newX, z: newZ });
      
      skaterRef.current.position.x = newX;
      skaterRef.current.position.z = newZ;
      skaterRef.current.rotation.y = rotationY;
      
      bodyRef.current.rotation.z = leanAmount;
      
      const armPhase = Math.sin(timeRef.current * 2.5) * 0.4;
      leftArmRef.current.rotation.z = Math.PI / 4 + armPhase * 0.3;
      leftArmRef.current.rotation.x = armPhase * 0.2;
      rightArmRef.current.rotation.z = -Math.PI / 4 - armPhase * 0.3;
      rightArmRef.current.rotation.x = -armPhase * 0.2;
    }
  });

  const iceLevel = -0.3;
  const skateOffset = -0.48;
  const adjustedY = iceLevel - skateOffset * scale;

  return (
    <group ref={skaterRef} position={[position[0], adjustedY, position[2]]} scale={scale}>
      <mesh position={[0, 0.6, 0]} castShadow={false}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color={skinTone} roughness={0.6} />
      </mesh>
      
      <mesh position={[-0.05, 0.63, 0.14]} castShadow={false}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.05, 0.63, 0.14]} castShadow={false}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, 0.59, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow={false}>
        <torusGeometry args={[0.03, 0.005, 4, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      
      <mesh position={[0, 0.72, 0]} castShadow={false}>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.75, -0.05]} rotation={[0.2, 0, 0]} castShadow={false}>
        <boxGeometry args={[0.32, 0.1, 0.08]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>

      <group ref={bodyRef}>
        <mesh position={[0, 0.2, 0]} castShadow={false}>
          <cylinderGeometry args={[0.18, 0.22, 0.55, 12]} />
          <meshStandardMaterial color={bodyColor} roughness={0.65} />
        </mesh>

        <group ref={leftArmRef} position={[-0.15, 0.25, 0]}>
          <mesh position={[-0.15, 0, 0.1]} rotation={[0, 0, Math.PI / 4]} castShadow={false}>
            <cylinderGeometry args={[0.055, 0.055, 0.25, 10]} />
            <meshStandardMaterial color={bodyColor} roughness={0.65} />
          </mesh>
          <mesh position={[-0.25, -0.1, 0.15]} rotation={[0, 0, Math.PI / 3]} castShadow={false}>
            <cylinderGeometry args={[0.05, 0.05, 0.22, 10]} />
            <meshStandardMaterial color={bodyColor} roughness={0.65} />
          </mesh>
          <mesh position={[-0.35, -0.15, 0.18]} castShadow={false}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#FFB6C1" roughness={0.7} />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[0.15, 0.25, 0]}>
          <mesh position={[0.15, 0, -0.1]} rotation={[0, 0, -Math.PI / 4]} castShadow={false}>
            <cylinderGeometry args={[0.055, 0.055, 0.25, 10]} />
            <meshStandardMaterial color={bodyColor} roughness={0.65} />
          </mesh>
          <mesh position={[0.25, -0.1, -0.15]} rotation={[0, 0, -Math.PI / 3]} castShadow={false}>
            <cylinderGeometry args={[0.05, 0.05, 0.22, 10]} />
            <meshStandardMaterial color={bodyColor} roughness={0.65} />
          </mesh>
          <mesh position={[0.35, -0.15, -0.18]} castShadow={false}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#FFB6C1" roughness={0.7} />
          </mesh>
        </group>
      </group>

      <mesh position={[-0.12, -0.25, 0.15]} rotation={[Math.PI / 8, 0, 0]} castShadow={false}>
        <cylinderGeometry args={[0.065, 0.065, 0.45, 10]} />
        <meshStandardMaterial color={pantsColor} roughness={0.65} />
      </mesh>
      <mesh position={[0.12, -0.25, -0.15]} rotation={[-Math.PI / 8, 0, 0]} castShadow={false}>
        <cylinderGeometry args={[0.065, 0.065, 0.45, 10]} />
        <meshStandardMaterial color={pantsColor} roughness={0.65} />
      </mesh>
      
      <group position={[-0.12, -0.48, 0.2]} rotation={[Math.PI / 8, 0, 0]}>
        <mesh position={[0, 0.1, 0]} castShadow={false}>
          <boxGeometry args={[0.1, 0.18, 0.13]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.85} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.01, 0]} castShadow={false}>
          <boxGeometry args={[0.11, 0.02, 0.14]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.19, 0]} castShadow={false}>
          <boxGeometry args={[0.11, 0.05, 0.14]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.13, 0.07]} castShadow={false}>
          <boxGeometry args={[0.09, 0.1, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
        </mesh>
        {[-0.03, 0, 0.03].map((x, i) => (
          <mesh key={i} position={[x, 0.13, 0.08]} castShadow={false}>
            <torusGeometry args={[0.008, 0.003, 8, 16]} />
            <meshStandardMaterial color="#000000" roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, -0.05, 0.07]} rotation={[0, 0, 0]} castShadow={false}>
          <boxGeometry args={[0.05, 0.008, 0.2]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.98} roughness={0.05} emissive="#FFFFFF" emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[0, -0.01, 0.07]} castShadow={false}>
          <boxGeometry args={[0.07, 0.03, 0.08]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.05, 0.17]} castShadow={false}>
          <boxGeometry args={[0.04, 0.012, 0.02]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.05, -0.03]} castShadow={false}>
          <boxGeometry args={[0.04, 0.012, 0.02]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
      
      <group position={[0.12, -0.48, -0.2]} rotation={[-Math.PI / 8, 0, 0]}>
        <mesh position={[0, 0.1, 0]} castShadow={false}>
          <boxGeometry args={[0.1, 0.18, 0.13]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.85} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.01, 0]} castShadow={false}>
          <boxGeometry args={[0.11, 0.02, 0.14]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.19, 0]} castShadow={false}>
          <boxGeometry args={[0.11, 0.05, 0.14]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.13, 0.07]} castShadow={false}>
          <boxGeometry args={[0.09, 0.1, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
        </mesh>
        {[-0.03, 0, 0.03].map((x, i) => (
          <mesh key={i} position={[x, 0.13, 0.08]} castShadow={false}>
            <torusGeometry args={[0.008, 0.003, 8, 16]} />
            <meshStandardMaterial color="#000000" roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, -0.05, 0.07]} rotation={[0, 0, 0]} castShadow={false}>
          <boxGeometry args={[0.05, 0.008, 0.2]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.98} roughness={0.05} emissive="#FFFFFF" emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[0, -0.01, 0.07]} castShadow={false}>
          <boxGeometry args={[0.07, 0.03, 0.08]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.05, 0.17]} castShadow={false}>
          <boxGeometry args={[0.04, 0.012, 0.02]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.05, -0.03]} castShadow={false}>
          <boxGeometry args={[0.04, 0.012, 0.02]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

