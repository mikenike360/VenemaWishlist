import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ElfProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  noAnimation?: boolean;
  workingPose?: 'assembling' | 'wrapping' | 'default';
}

const elfHatColors = ['#C41E3A', '#B31237', '#D7263D', '#8B0000'];
const elfCoatColors = ['#228B22', '#32CD32', '#00AA00', '#006400'];
const elfSkinColors = ['#FFDBAC', '#F4C2A1', '#E6B89C'];

const pickRandom = (colors: string[]) =>
  colors[Math.floor(Math.random() * colors.length)];

export const Elf: React.FC<ElfProps> = ({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  noAnimation = false,
  workingPose = 'default',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  const hatColor = React.useMemo(() => pickRandom(elfHatColors), []);
  const coatColor = React.useMemo(() => pickRandom(elfCoatColors), []);
  const skinColor = React.useMemo(() => pickRandom(elfSkinColors), []);

  // Get arm rotations based on working pose
  const getArmRotations = (): { left: [number, number, number]; right: [number, number, number] } => {
    switch (workingPose) {
      case 'assembling':
        return {
          left: [Math.PI / 3, 0, -Math.PI / 4] as [number, number, number],
          right: [-Math.PI / 3, 0, Math.PI / 4] as [number, number, number],
        };
      case 'wrapping':
        return {
          left: [Math.PI / 4, 0, -Math.PI / 6] as [number, number, number],
          right: [-Math.PI / 4, 0, Math.PI / 6] as [number, number, number],
        };
      default:
        return {
          left: [0, 0, Math.PI / 8] as [number, number, number],
          right: [0, 0, -Math.PI / 8] as [number, number, number],
        };
    }
  };

  const armRotations = getArmRotations();

  useFrame((state, delta) => {
    if (groupRef.current && !noAnimation) {
      timeRef.current += delta;
      // Gentle working animation
      const workSpeed = workingPose !== 'default' ? 1.5 : 0.3;
      groupRef.current.rotation.y = rotation[1] + Math.sin(timeRef.current * workSpeed) * 0.03;
      
      // Animate arms for working poses
      if (leftArmRef.current && rightArmRef.current && workingPose !== 'default') {
        const armMovement = Math.sin(timeRef.current * 2) * 0.1;
        leftArmRef.current.rotation.x = armRotations.left[0] + armMovement;
        rightArmRef.current.rotation.x = armRotations.right[0] - armMovement;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {/* Boots */}
      {[-0.08, 0.08].map((x) => (
        <group key={`boot-${x}`} position={[x * scale, 0.03 * scale, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[0.08 * scale, 0.06 * scale, 0.12 * scale]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Legs */}
      {[-0.06, 0.06].map((x) => (
        <mesh key={`leg-${x}`} position={[x * scale, 0.2 * scale, 0]}>
          <cylinderGeometry args={[0.05 * scale, 0.05 * scale, 0.25 * scale, 12]} />
          <meshStandardMaterial color={coatColor} roughness={0.55} metalness={0.05} />
        </mesh>
      ))}

      {/* Body/Torso */}
      <mesh position={[0, 0.45 * scale, 0]} receiveShadow>
        <boxGeometry args={[0.2 * scale, 0.3 * scale, 0.15 * scale]} />
        <meshStandardMaterial color={coatColor} roughness={0.5} metalness={0.08} />
      </mesh>

      {/* Belt */}
      <mesh position={[0, 0.35 * scale, 0]}>
        <cylinderGeometry args={[0.11 * scale, 0.11 * scale, 0.06 * scale, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.65} metalness={0.2} />
      </mesh>

      {/* Left Arm */}
      <group
        ref={leftArmRef}
        position={[-0.1 * scale, 0.45 * scale, 0]}
        rotation={armRotations.left}
      >
        <mesh position={[0, -0.15 * scale, 0]}>
          <cylinderGeometry args={[0.04 * scale, 0.04 * scale, 0.3 * scale, 12]} />
          <meshStandardMaterial color={coatColor} roughness={0.55} metalness={0.05} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.3 * scale, 0]}>
          <sphereGeometry args={[0.04 * scale, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.65} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group
        ref={rightArmRef}
        position={[0.1 * scale, 0.45 * scale, 0]}
        rotation={armRotations.right}
      >
        <mesh position={[0, -0.15 * scale, 0]}>
          <cylinderGeometry args={[0.04 * scale, 0.04 * scale, 0.3 * scale, 12]} />
          <meshStandardMaterial color={coatColor} roughness={0.55} metalness={0.05} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.3 * scale, 0]}>
          <sphereGeometry args={[0.04 * scale, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.65} />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[0, 0.75 * scale, 0]}>
        <sphereGeometry args={[0.18 * scale, 20, 20]} />
        <meshStandardMaterial color={skinColor} roughness={0.65} />
      </mesh>

      {/* Ears */}
      {[-0.12, 0.12].map((x) => (
        <mesh key={`ear-${x}`} position={[x * scale, 0.75 * scale, 0.15 * scale]}>
          <sphereGeometry args={[0.05 * scale, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.65} />
        </mesh>
      ))}

      {/* Eyes */}
      {[-0.06, 0.06].map((x) => (
        <mesh key={`eye-${x}`} position={[x * scale, 0.78 * scale, 0.16 * scale]}>
          <sphereGeometry args={[0.02 * scale, 12, 12]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      ))}

      {/* Nose */}
      <mesh position={[0, 0.73 * scale, 0.17 * scale]}>
        <sphereGeometry args={[0.025 * scale, 12, 12]} />
        <meshStandardMaterial color="#FFB380" roughness={0.5} />
      </mesh>

      {/* Hat - Pointed elf hat */}
      <mesh position={[0, 0.9 * scale, 0]}>
        <cylinderGeometry args={[0.2 * scale, 0.2 * scale, 0.15 * scale, 16]} />
        <meshStandardMaterial color={hatColor} roughness={0.5} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.05 * scale, 0]}>
        <coneGeometry args={[0.15 * scale, 0.3 * scale, 16]} />
        <meshStandardMaterial color={hatColor} roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Hat pom-pom */}
      <mesh position={[0, 1.2 * scale, 0]}>
        <sphereGeometry args={[0.05 * scale, 12, 12]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.3}
          emissive="#FFFFFF"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
};

