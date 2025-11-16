import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SantaModelProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

const coatPalette = ['#C41E3A', '#B31237', '#D7263D'];
const trimPalette = ['#FFFFFF', '#FFF8E7', '#F5F5F5'];
const glovePalette = ['#E74C3C', '#FA7268', '#D84315'];
const bagPalette = ['#7D3C98', '#8E44AD', '#C97C5D', '#CA6F1E'];
const candyStripePalette = ['#FF1744', '#FF6F61', '#FF4081'];
const cheekPalette = ['#FFB3C1', '#FF9AA2', '#FFD5CD'];

const pickRandom = (colors: string[]) =>
  colors[Math.floor(Math.random() * colors.length)];

export const SantaModel: React.FC<SantaModelProps> = ({
  position,
  scale = 1,
  rotation = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const bagRef = useRef<THREE.Group>(null);
  const caneRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  const coatColor = useMemo(() => pickRandom(coatPalette), []);
  const trimColor = useMemo(() => pickRandom(trimPalette), []);
  const gloveColor = useMemo(() => pickRandom(glovePalette), []);
  const bagColor = useMemo(() => pickRandom(bagPalette), []);
  const caneStripeColor = useMemo(() => pickRandom(candyStripePalette), []);
  const cheekColor = useMemo(() => pickRandom(cheekPalette), []);

  useFrame((state, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y =
        rotation[1] + Math.sin(timeRef.current * 0.35) * 0.12;
    }
    if (bagRef.current) {
      bagRef.current.rotation.z = Math.sin(timeRef.current * 0.6) * 0.25;
    }
    if (caneRef.current) {
      caneRef.current.rotation.z = Math.sin(timeRef.current * 0.5) * 0.06;
    }
  });

  const buttonHeights = [0.9, 0.65, 0.4];
  const stripeHeights = [-0.25, -0.05, 0.15, 0.32];

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {/* Gift bag */}
      <group ref={bagRef} position={[-0.55 * scale, 0.65 * scale, -0.35 * scale]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.35 * scale, 28, 28]} />
          <meshStandardMaterial
            color={bagColor}
            roughness={0.45}
            metalness={0.08}
          />
        </mesh>
        <mesh position={[0, 0.35 * scale, 0]} castShadow>
          <coneGeometry args={[0.18 * scale, 0.25 * scale, 16]} />
          <meshStandardMaterial color={bagColor} roughness={0.4} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.32 * scale, 0]} castShadow>
          <torusGeometry args={[0.2 * scale, 0.03 * scale, 12, 28]} />
          <meshStandardMaterial
            color={trimColor}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
      </group>

      {/* Candy cane staff */}
      <group
        ref={caneRef}
        position={[0.6 * scale, 0.7 * scale, 0.1 * scale]}
        rotation={[0, Math.PI / 12, 0]}
      >
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.05 * scale, 0.05 * scale, 0.7 * scale, 20]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.35 * scale, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.2 * scale, 0.045 * scale, 16, 30, Math.PI * 1.1]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
        </mesh>
        {stripeHeights.map((offset, index) => (
          <mesh
            key={`candy-stripe-${index}`}
            position={[0, offset * scale, 0]}
            rotation={[0, 0, Math.PI / 4]}
            castShadow
          >
            <cylinderGeometry args={[0.051 * scale, 0.051 * scale, 0.07 * scale, 16]} />
            <meshStandardMaterial
              color={caneStripeColor}
              roughness={0.25}
              metalness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Boots */}
      {[-0.2, 0.2].map((x) => (
        <group key={`boot-${x}`} position={[x * scale, 0.06 * scale, 0.05 * scale]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.18 * scale, 0.14 * scale, 0.28 * scale]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.07 * scale, 0.14 * scale]} castShadow>
            <sphereGeometry args={[0.1 * scale, 16, 16]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.75} />
          </mesh>
          {/* Boot sole */}
          <mesh position={[0, -0.07 * scale, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.2 * scale, 0.02 * scale, 0.3 * scale]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Legs */}
      {[-0.15, 0.15].map((x) => (
        <mesh key={`leg-${x}`} position={[x * scale, 0.38 * scale, 0]} castShadow>
          <cylinderGeometry args={[0.11 * scale, 0.11 * scale, 0.5 * scale, 16]} />
          <meshStandardMaterial color={coatColor} roughness={0.55} metalness={0.05} />
        </mesh>
      ))}

      {/* Coat base */}
      <mesh position={[0, 0.9 * scale, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.48 * scale, 0.58 * scale, 1.3 * scale, 24]} />
        <meshStandardMaterial color={coatColor} roughness={0.5} metalness={0.08} />
      </mesh>

      {/* Coat skirt */}
      <mesh position={[0, 0.35 * scale, 0]} castShadow>
        <coneGeometry args={[0.75 * scale, 0.45 * scale, 24]} />
        <meshStandardMaterial color={coatColor} roughness={0.5} metalness={0.08} />
      </mesh>

      {/* Lapels */}
      {[-1, 1].map((dir) => (
        <mesh
          key={`lapel-${dir}`}
          position={[dir * 0.15 * scale, 1.05 * scale, 0.4 * scale]}
          rotation={[0, 0, dir * Math.PI / 6]}
          castShadow
        >
          <boxGeometry args={[0.4 * scale, 0.02 * scale, 0.18 * scale]} />
          <meshStandardMaterial color={trimColor} roughness={0.35} metalness={0.05} />
        </mesh>
      ))}

      {/* Collar */}
      <mesh position={[0, 1.15 * scale, 0]} castShadow>
        <torusGeometry args={[0.35 * scale, 0.08 * scale, 16, 32]} />
        <meshStandardMaterial
          color={trimColor}
          roughness={0.25}
          emissive={trimColor}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Belt */}
      <mesh position={[0, 0.6 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.49 * scale, 0.49 * scale, 0.14 * scale, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.65} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.6 * scale, 0.45 * scale]} castShadow>
        <boxGeometry args={[0.2 * scale, 0.14 * scale, 0.06 * scale]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.15}
          emissive="#FFD700"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Buttons */}
      {buttonHeights.map((height) => (
        <mesh key={`button-${height}`} position={[0, height * scale, 0.42 * scale]} castShadow>
          <cylinderGeometry args={[0.04 * scale, 0.04 * scale, 0.02 * scale, 16]} />
          <meshStandardMaterial color="#111111" metalness={0.4} roughness={0.4} />
        </mesh>
      ))}

      {/* Arms & mittens */}
      {[-1, 1].map((dir) => (
        <group
          key={`arm-${dir}`}
          position={[dir * 0.62 * scale, 1.05 * scale, 0]}
          rotation={[0, 0, dir * Math.PI / 4.5]}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.1 * scale, 0.1 * scale, 0.7 * scale, 16]} />
            <meshStandardMaterial color={coatColor} roughness={0.55} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.35 * scale, 0]} castShadow>
            <torusGeometry args={[0.13 * scale, 0.04 * scale, 12, 24]} />
            <meshStandardMaterial color={trimColor} roughness={0.3} />
          </mesh>
          {/* Hand - positioned at wrist, visible before mitten */}
          <mesh position={[0, 0.36 * scale, 0.08 * scale]} castShadow>
            <sphereGeometry args={[0.09 * scale, 16, 16]} />
            <meshStandardMaterial color="#FFDBAC" roughness={0.65} />
          </mesh>
          {/* Hand palm - extends from wrist */}
          <mesh position={[0, 0.39 * scale, 0.11 * scale]} castShadow>
            <boxGeometry args={[0.12 * scale, 0.08 * scale, 0.06 * scale]} />
            <meshStandardMaterial color="#FFDBAC" roughness={0.65} />
          </mesh>
          {/* Fingers - make them visible extending from mitten */}
          {[-0.04, 0, 0.04].map((xOffset, idx) => (
            <mesh
              key={`finger-${dir}-${idx}`}
              position={[xOffset * scale, 0.42 * scale, 0.15 * scale]}
              castShadow
            >
              <cylinderGeometry args={[0.015 * scale, 0.015 * scale, 0.08 * scale, 8]} />
              <meshStandardMaterial color="#FFDBAC" roughness={0.65} />
            </mesh>
          ))}
          {/* Mitten - positioned to cover hand but show fingers */}
          <mesh position={[0, 0.4 * scale, 0.12 * scale]} castShadow>
            <sphereGeometry args={[0.1 * scale, 16, 16]} />
            <meshStandardMaterial 
              color={gloveColor} 
              roughness={0.45} 
              metalness={0.05}
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>
      ))}

      {/* Head */}
      <mesh position={[0, 1.6 * scale, 0]} castShadow>
        <sphereGeometry args={[0.4 * scale, 32, 32]} />
        <meshStandardMaterial color="#FFDBAC" roughness={0.65} />
      </mesh>

      {/* Cheeks */}
      {[-0.19, 0.19].map((x) => (
        <mesh key={`cheek-${x}`} position={[x * scale, 1.55 * scale, 0.33 * scale]} castShadow>
          <sphereGeometry args={[0.08 * scale, 16, 16]} />
          <meshStandardMaterial
            color={cheekColor}
            emissive={cheekColor}
            emissiveIntensity={0.15}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Eyes */}
      {[-0.14, 0.14].map((x) => (
        <mesh key={`eye-${x}`} position={[x * scale, 1.72 * scale, 0.38 * scale]}>
          <sphereGeometry args={[0.05 * scale, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      ))}
      {[-0.11, 0.17].map((x, index) => (
        <mesh key={`eye-highlight-${index}`} position={[x * scale, 1.74 * scale, 0.4 * scale]}>
          <sphereGeometry args={[0.018 * scale, 12, 12]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}

      {/* Eyebrows */}
      {[-0.16, 0.16].map((x) => (
        <mesh key={`brow-${x}`} position={[x * scale, 1.82 * scale, 0.26 * scale]} castShadow>
          <boxGeometry args={[0.18 * scale, 0.025 * scale, 0.06 * scale]} />
          <meshStandardMaterial color="#5B2C2C" roughness={0.5} />
        </mesh>
      ))}

      {/* Nose */}
      <mesh position={[0, 1.65 * scale, 0.34 * scale]} castShadow>
        <sphereGeometry args={[0.05 * scale, 16, 16]} />
        <meshStandardMaterial color="#FFB380" roughness={0.5} />
      </mesh>

      {/* Mustache */}
      <mesh position={[0, 1.55 * scale, 0.35 * scale]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.22 * scale, 0.07 * scale, 12, 32]} />
        <meshStandardMaterial color={trimColor} roughness={0.35} />
      </mesh>

      {/* Beard */}
      <mesh position={[0, 1.4 * scale, 0.22 * scale]} castShadow>
        <coneGeometry args={[0.38 * scale, 0.55 * scale, 20]} />
        <meshStandardMaterial
          color={trimColor}
          roughness={0.35}
          emissive={trimColor}
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Hat */}
      <mesh position={[0, 1.9 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.58 * scale, 0.58 * scale, 0.1 * scale, 24]} />
        <meshStandardMaterial color={coatColor} roughness={0.5} metalness={0.05} />
      </mesh>
      <mesh position={[0, 2.1 * scale, 0]} castShadow>
        <coneGeometry args={[0.42 * scale, 0.55 * scale, 24]} />
        <meshStandardMaterial color={coatColor} roughness={0.5} metalness={0.05} />
      </mesh>
      <mesh position={[0, 2.0 * scale, 0]} castShadow>
        <torusGeometry args={[0.32 * scale, 0.06 * scale, 14, 32]} />
        <meshStandardMaterial
          color={trimColor}
          roughness={0.3}
          emissive={trimColor}
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[0, 2.3 * scale, 0]} castShadow>
        <sphereGeometry args={[0.13 * scale, 20, 20]} />
        <meshStandardMaterial
          color={trimColor}
          roughness={0.25}
          emissive={trimColor}
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
};
