import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from '../../../lib/materials';
import { peoplePositions, getNextPersonId } from '../utils/positionTracking';
import { getCollisionObjects, calculateCollisionAvoidance } from '../utils/collision';

interface PersonProps {
  position: [number, number, number];
  speed?: number;
  pathType?: 'straight' | 'circular' | 'backforth' | 'figure8' | 'spiral' | 'waypoints' | 'wander';
  pathStart?: [number, number];
  pathEnd?: [number, number];
  pathRadius?: number;
  bodyColor?: string;
  pantsColor?: string;
  hatColor?: string;
  hatType?: 'beanie' | 'cap' | 'none';
  scale?: number;
  hasScarf?: boolean;
  scarfColor?: string;
  skinTone?: string;
}

export const Person: React.FC<PersonProps> = ({
  position,
  speed = 1,
  pathType = 'straight',
  pathStart,
  pathEnd,
  pathRadius = 3,
  bodyColor = '#4169E1',
  pantsColor = '#2F4F4F',
  hatColor = '#8B0000',
  hatType = 'beanie',
  scale = 1,
  hasScarf = false,
  scarfColor = '#FF0000',
  skinTone = '#FFDBAC'
}) => {
  const personRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const personId = useRef(getNextPersonId()).current;

  useFrame((state, delta) => {
    if (personRef.current && leftLegRef.current && rightLegRef.current && leftArmRef.current && rightArmRef.current && leftForearmRef.current && rightForearmRef.current && bodyRef.current && headRef.current) {
      timeRef.current += delta * speed;
      
      let newX = position[0];
      let newZ = position[2];
      let rotationY = 0;
      
      if (pathType === 'straight' && pathStart && pathEnd) {
        const t = (Math.sin(timeRef.current * 0.5) + 1) / 2;
        newX = pathStart[0] + (pathEnd[0] - pathStart[0]) * t;
        newZ = pathStart[1] + (pathEnd[1] - pathStart[1]) * t;
        rotationY = Math.atan2(pathEnd[1] - pathStart[1], pathEnd[0] - pathStart[0]);
      } else if (pathType === 'backforth' && pathStart && pathEnd) {
        const t = Math.abs(Math.sin(timeRef.current * 0.5));
        newX = pathStart[0] + (pathEnd[0] - pathStart[0]) * t;
        newZ = pathStart[1] + (pathEnd[1] - pathStart[1]) * t;
        const direction = Math.sin(timeRef.current * 0.5) > 0 ? 1 : -1;
        rotationY = Math.atan2(
          (pathEnd[1] - pathStart[1]) * direction,
          (pathEnd[0] - pathStart[0]) * direction
        );
      } else if (pathType === 'figure8') {
        const t = timeRef.current;
        newX = position[0] + Math.sin(t) * pathRadius;
        newZ = position[2] + Math.sin(t * 2) * pathRadius * 0.5;
        rotationY = Math.atan2(Math.cos(t * 2) * pathRadius * 0.5, Math.cos(t) * pathRadius) + Math.PI / 2;
      } else if (pathType === 'spiral') {
        const t = timeRef.current;
        const spiralRadius = pathRadius * (0.3 + (Math.sin(t * 0.3) + 1) * 0.35);
        newX = position[0] + Math.cos(t) * spiralRadius;
        newZ = position[2] + Math.sin(t) * spiralRadius;
        rotationY = t + Math.PI / 2;
      } else if (pathType === 'wander') {
        const wanderAngle = Math.sin(timeRef.current * 0.1) * Math.PI * 2;
        const wanderRadius = pathRadius * 0.5;
        newX = position[0] + Math.cos(wanderAngle) * wanderRadius + Math.sin(timeRef.current * 0.3) * 0.5;
        newZ = position[2] + Math.sin(wanderAngle) * wanderRadius + Math.cos(timeRef.current * 0.3) * 0.5;
        rotationY = wanderAngle + Math.PI / 2;
      } else {
        const angle = timeRef.current;
        newX = position[0] + Math.cos(angle) * pathRadius;
        newZ = position[2] + Math.sin(angle) * pathRadius;
        rotationY = angle + Math.PI / 2;
      }
      
      const avoidRadius = 1.2;
      const minPersonSeparation = 1.0;
      const collisionObjects = getCollisionObjects();
      
      const { steerX, steerZ } = calculateCollisionAvoidance(newX, newZ, avoidRadius, collisionObjects);
      let finalSteerX = steerX;
      let finalSteerZ = steerZ;
      
      const otherPeople = Array.from(peoplePositions.entries());
      for (const [id, otherPos] of otherPeople) {
        if (id === personId) continue;
        const dist = Math.sqrt(Math.pow(newX - otherPos.x, 2) + Math.pow(newZ - otherPos.z, 2));
        if (dist < minPersonSeparation) {
          const angle = Math.atan2(newZ - otherPos.z, newX - otherPos.x);
          const pushStrength = (minPersonSeparation - dist) / minPersonSeparation;
          finalSteerX += Math.cos(angle) * pushStrength * 0.4;
          finalSteerZ += Math.sin(angle) * pushStrength * 0.4;
        }
      }
      
      newX += finalSteerX;
      newZ += finalSteerZ;
      
      peoplePositions.set(personId, { x: newX, z: newZ });
      
      personRef.current.position.x = newX;
      personRef.current.position.z = newZ;
      personRef.current.rotation.y = rotationY;
      
      const walkCycle = Math.sin(timeRef.current * 4);
      const easedCycle = easing.easeOut((walkCycle + 1) / 2) * 2 - 1;
      leftLegRef.current.rotation.x = easedCycle * 0.4;
      rightLegRef.current.rotation.x = -easedCycle * 0.4;
      
      // Natural arm swing - arms swing opposite to legs
      const armSwingAmount = easedCycle * 0.8;
      
      // Left arm: swings forward when right leg forward
      leftArmRef.current.rotation.z = Math.PI / 3 + armSwingAmount * 0.4;
      leftArmRef.current.rotation.x = -armSwingAmount * 0.2;
      
      // Right arm: swings forward when left leg forward  
      rightArmRef.current.rotation.z = -Math.PI / 3 - armSwingAmount * 0.4;
      rightArmRef.current.rotation.x = armSwingAmount * 0.2;
      
      // Forearms follow upper arms with slight delay
      leftForearmRef.current.rotation.z = -Math.PI / 4 - armSwingAmount * 0.3;
      rightForearmRef.current.rotation.z = Math.PI / 4 + armSwingAmount * 0.3;
      
      bodyRef.current.rotation.z = Math.sin(timeRef.current * 4) * 0.05;
      bodyRef.current.position.y = Math.abs(easedCycle) * 0.02;
      
      if (headRef.current) {
        headRef.current.position.y = Math.abs(easedCycle) * 0.01;
      }
    }
  });

  const adjustedY = -0.5 + 0.6 * scale;

  return (
    <group ref={personRef} position={[position[0], adjustedY, position[2]]} scale={scale}>
      <group ref={bodyRef}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.2, 0.5, 12]} />
          <meshStandardMaterial color={bodyColor} roughness={0.65} />
        </mesh>
        
        <mesh position={[0, 0.2, 0.1]} castShadow>
          <boxGeometry args={[0.24, 0.08, 0.05]} />
          <meshStandardMaterial color={bodyColor} roughness={0.7} />
        </mesh>
        
        {hasScarf && (
          <>
            <mesh position={[0, 0.1, 0.1]} castShadow>
              <torusGeometry args={[0.2, 0.03, 8, 16]} />
              <meshStandardMaterial color={scarfColor} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.05, 0.12]} rotation={[0.3, 0, 0]} castShadow>
              <boxGeometry args={[0.15, 0.2, 0.05]} />
              <meshStandardMaterial color={scarfColor} roughness={0.7} />
            </mesh>
          </>
        )}
      </group>

      <group ref={headRef} position={[0, 0.35, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial color={skinTone} roughness={0.6} />
        </mesh>
        
        <mesh position={[-0.05, 0.03, 0.14]} castShadow={false}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.05, 0.03, 0.14]} castShadow={false}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0, -0.01, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow={false}>
          <torusGeometry args={[0.03, 0.005, 4, 8]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
      </group>
      
      <mesh position={[0, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.45, -0.05]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.32, 0.1, 0.08]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.22, 0.2, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.12, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.24, 10]} />
          <meshStandardMaterial color={bodyColor} roughness={0.65} />
        </mesh>
        {/* Forearm group - rotates at elbow */}
        <group ref={leftForearmRef} position={[0, -0.24, 0]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.2, 10]} />
            <meshStandardMaterial color={bodyColor} roughness={0.65} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color={skinTone} roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.22, 0.2, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.12, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.24, 10]} />
          <meshStandardMaterial color={bodyColor} roughness={0.65} />
        </mesh>
        {/* Forearm group - rotates at elbow */}
        <group ref={rightForearmRef} position={[0, -0.24, 0]}>
          <mesh position={[0, -0.1, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.2, 10]} />
            <meshStandardMaterial color={bodyColor} roughness={0.65} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color={skinTone} roughness={0.7} />
          </mesh>
        </group>
      </group>

      <group ref={leftLegRef} position={[-0.1, -0.25, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.45, 10]} />
          <meshStandardMaterial color={pantsColor} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.225, 0]} castShadow>
          <boxGeometry args={[0.1, 0.08, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.1, -0.25, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.45, 10]} />
          <meshStandardMaterial color={pantsColor} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.225, 0]} castShadow>
          <boxGeometry args={[0.1, 0.08, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
      </group>

      {hatType === 'beanie' && (
        <>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.19, 0.19, 0.14, 12]} />
            <meshStandardMaterial color={hatColor} roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.6, 0]} castShadow>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
        </>
      )}
      {hatType === 'cap' && (
        <>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
            <meshStandardMaterial color={hatColor} roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.2, 0.03, 8, 16]} />
            <meshStandardMaterial color={hatColor} roughness={0.65} />
          </mesh>
        </>
      )}
      
      {Math.abs(Math.sin(timeRef.current * 4)) > 0.3 && (
        <mesh position={[0, 0.5, 0.2]} castShadow={false}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial 
            color="#E8E8E8" 
            transparent 
            opacity={0.4}
            emissive="#E8E8E8"
            emissiveIntensity={0.1}
          />
        </mesh>
      )}
    </group>
  );
};

