import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SnowmanModelProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

const pickRandom = (colors: string[]) =>
  colors[Math.floor(Math.random() * colors.length)];

const scarfPalette = ['#FF4B5C', '#FF9A3C', '#5DADEC', '#8BC34A'];
const scarfStripedAccents = ['#FFD166', '#FFE156', '#F4F1BB', '#FFFFFF'];
const hatBandColors = ['#FFD700', '#4FC3F7', '#90CAF9', '#F06292'];
const noseColors = ['#FF8C00', '#FFA351', '#FF9F45'];
const buttonColors = ['#1F1F1F', '#2E2E2E', '#3C3C3C'];
const earmuffColors = ['#FF6F91', '#AD1457', '#26C6DA', '#7E57C2'];

export const SnowmanModel: React.FC<SnowmanModelProps> = ({
  position,
  scale = 1,
  rotation = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const hatRef = useRef<THREE.Group>(null);
  const scarfRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  const scarfColor = useMemo(() => pickRandom(scarfPalette), []);
  const scarfStripeColor = useMemo(() => pickRandom(scarfStripedAccents), []);
  const hatBandColor = useMemo(() => pickRandom(hatBandColors), []);
  const noseColor = useMemo(() => pickRandom(noseColors), []);
  const buttonColor = useMemo(() => pickRandom(buttonColors), []);
  const earmuffColor = useMemo(() => pickRandom(earmuffColors), []);

  const baseRadius = 0.45;
  const midRadius = 0.36;
  const headRadius = 0.28;
  const bodySpacing = 0.06;

  // Calculate positions so spheres touch each other (no gaps between layers)
  // Base sphere: center at baseRadius, so bottom is at 0
  const baseCenterY = baseRadius;
  // Middle sphere: sits on top of base sphere, center = base top + midRadius
  const midCenterY = baseRadius + baseRadius + midRadius;
  // Head sphere: sits on top of middle sphere, center = mid top + headRadius
  const headCenterY = midCenterY + midRadius + headRadius;
  const hatBaseY = headCenterY + headRadius * 0.75;
  const eyeY = headCenterY + 0.06;
  const smileBaseY = headCenterY - 0.05;
  const noseY = headCenterY;
  const buttonHeights = [
    midCenterY + midRadius * 0.25,
    midCenterY,
    midCenterY - midRadius * 0.25,
  ];
  const buttonDepth = (midRadius + 0.04) * scale;
  const scarfY = (midCenterY + midRadius * 0.2) * scale;
  const armCenterY = (midCenterY + midRadius * 0.05) * scale;

  useFrame((state, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y =
        rotation[1] + Math.sin(timeRef.current * 0.25) * 0.08;
    }
    if (hatRef.current) {
      hatRef.current.rotation.z = Math.sin(timeRef.current * 0.4) * 0.08;
    }
    if (scarfRef.current) {
      scarfRef.current.rotation.z = Math.sin(timeRef.current * 0.9) * 0.05;
    }
  });

  const smileOffsets = [-0.08, -0.04, 0, 0.04, 0.08];

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {/* Bottom body */}
      <mesh position={[0, baseCenterY * scale, 0]} castShadow receiveShadow>
        <sphereGeometry args={[baseRadius * scale, 40, 40]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.05}
          metalness={0.0}
          emissive="#FFFFFF"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Middle body */}
      <mesh position={[0, midCenterY * scale, 0]} castShadow>
        <sphereGeometry args={[midRadius * scale, 40, 40]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.05}
          metalness={0.0}
          emissive="#FFFFFF"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, headCenterY * scale, 0]} castShadow>
        <sphereGeometry args={[headRadius * scale, 40, 40]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.05}
          metalness={0.0}
          emissive="#FFFFFF"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Hat */}
      <group ref={hatRef} position={[0, hatBaseY * scale, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.32 * scale, 0.32 * scale, 0.08 * scale, 20]} />
          <meshStandardMaterial color="#1A1A1A" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.12 * scale, 0]} castShadow>
          <cylinderGeometry args={[0.2 * scale, 0.2 * scale, 0.2 * scale, 20]} />
          <meshStandardMaterial color="#1A1A1A" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.05 * scale, 0]} castShadow>
          <torusGeometry args={[0.24 * scale, 0.03 * scale, 10, 28]} />
          <meshStandardMaterial
            color={hatBandColor}
            roughness={0.35}
            emissive={hatBandColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Earmuffs */}
      <mesh position={[0, headCenterY * scale, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.28 * scale, 0.015 * scale, 8, 24]} />
        <meshStandardMaterial color={earmuffColor} roughness={0.4} />
      </mesh>
      {[-1, 1].map((dir) => (
        <mesh
          key={`earmuff-${dir}`}
          position={[dir * 0.28 * scale, headCenterY * scale, 0]}
          castShadow
        >
          <sphereGeometry args={[0.07 * scale, 16, 16]} />
          <meshStandardMaterial
            color={earmuffColor}
            emissive={earmuffColor}
            emissiveIntensity={0.15}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Eyes */}
      {[-0.09, 0.09].map((x) => (
        <mesh key={`eye-${x}`} position={[x * scale, eyeY * scale, 0.22 * scale]}>
          <sphereGeometry args={[0.035 * scale, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      ))}
      {[-0.06, 0.12].map((x, index) => (
        <mesh key={`eye-highlight-${index}`} position={[x * scale, (eyeY + 0.02) * scale, 0.24 * scale]}>
          <sphereGeometry args={[0.01 * scale, 10, 10]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}

      {/* Smile */}
      {smileOffsets.map((offset, index) => (
        <mesh
          key={`smile-${index}`}
          position={[offset * scale, (smileBaseY - Math.abs(offset) * 0.15) * scale, 0.25 * scale]}
        >
          <sphereGeometry args={[0.015 * scale, 10, 10]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      ))}

      {/* Nose */}
      <mesh
        position={[0, noseY * scale, 0.27 * scale]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <coneGeometry args={[0.03 * scale, 0.14 * scale, 12]} />
        <meshStandardMaterial
          color={noseColor}
          emissive={noseColor}
          emissiveIntensity={0.15}
          roughness={0.55}
        />
      </mesh>
      <mesh position={[0, noseY * scale, 0.33 * scale]} castShadow>
        <sphereGeometry args={[0.015 * scale, 10, 10]} />
        <meshStandardMaterial color={noseColor} emissive={noseColor} emissiveIntensity={0.1} />
      </mesh>

      {/* Buttons */}
      {buttonHeights.map((height) => (
        <mesh key={`button-${height}`} position={[0, height * scale, buttonDepth]}>
          <cylinderGeometry args={[0.025 * scale, 0.025 * scale, 0.015 * scale, 12]} />
          <meshStandardMaterial color={buttonColor} roughness={0.4} metalness={0.2} />
        </mesh>
      ))}

      {/* Arms */}
      {[-1, 1].map((dir) => (
        <group key={`arm-${dir}`} position={[dir * 0.35 * scale, armCenterY, 0]}>
          <mesh
            position={[0, 0, 0.05 * scale]}
            rotation={[0, 0, dir * -Math.PI / 6]}
            castShadow
          >
            <cylinderGeometry args={[0.02 * scale, 0.02 * scale, 0.35 * scale, 8]} />
            <meshStandardMaterial color="#8B4513" roughness={0.85} />
          </mesh>
          <mesh
            position={[dir * 0.12 * scale, 0.1 * scale, 0.1 * scale]}
            rotation={[0, 0, dir * -Math.PI / 4]}
            castShadow
          >
            <cylinderGeometry args={[0.015 * scale, 0.015 * scale, 0.18 * scale, 8]} />
            <meshStandardMaterial color="#8B4513" roughness={0.85} />
          </mesh>
          <mesh
            position={[dir * 0.2 * scale, 0.18 * scale, 0.14 * scale]}
            rotation={[0, 0, dir * -Math.PI / 6]}
            castShadow
          >
            <cylinderGeometry args={[0.01 * scale, 0.01 * scale, 0.12 * scale, 8]} />
            <meshStandardMaterial color="#8B4513" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Scarf */}
      <group ref={scarfRef} position={[0, scarfY, 0]}>
        <mesh castShadow>
          <torusGeometry args={[0.33 * scale, 0.05 * scale, 12, 32]} />
          <meshStandardMaterial
            color={scarfColor}
            roughness={0.5}
            emissive={scarfColor}
            emissiveIntensity={0.12}
          />
        </mesh>
        {[-0.2, 0, 0.2].map((offset) => (
          <mesh key={`scarf-stripe-${offset}`} position={[offset * scale, 0.02 * scale, 0.03 * scale]}>
            <boxGeometry args={[0.12 * scale, 0.03 * scale, 0.03 * scale]} />
            <meshStandardMaterial
              color={scarfStripeColor}
              emissive={scarfStripeColor}
              emissiveIntensity={0.1}
            />
          </mesh>
        ))}
        {[-0.2, 0.2].map((offset) => (
          <mesh
            key={`scarf-tail-${offset}`}
            position={[offset * scale, -0.15 * scale, 0.12 * scale]}
            rotation={[0.25, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.09 * scale, 0.25 * scale, 0.04 * scale]} />
            <meshStandardMaterial
              color={scarfColor}
              roughness={0.5}
              emissive={scarfColor}
              emissiveIntensity={0.12}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
