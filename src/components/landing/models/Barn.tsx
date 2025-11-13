import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BarnProps {
  position: [number, number, number];
}

export const Barn: React.FC<BarnProps> = ({ position }) => {
  const barnRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (barnRef.current) {
      timeRef.current += delta;
    }
  });

  // Christmas light colors
  const lightColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
  const getLightColor = (index: number) => lightColors[index % lightColors.length];

  return (
    <group ref={barnRef} position={position}>
      {/* Foundation */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.5, 6]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Main barn body - red with vertical board siding effect */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.5, 3.5, 5.5]} />
        <meshStandardMaterial color="#DC143C" roughness={0.7} metalness={0.0} />
      </mesh>
      
      {/* Vertical board lines */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = -3.5 + (i * 7) / 7;
        return (
          <mesh key={`board-${i}`} position={[x, 1.5, 2.76]} castShadow>
            <boxGeometry args={[0.05, 3.5, 0.02]} />
            <meshStandardMaterial color="#8B0000" roughness={0.8} />
          </mesh>
        );
      })}

      {/* Gambrel roof - properly connected */}
      {/* Wall top is at y=3.25 (1.5 + 3.5/2), barn width is 7.5, depth is 5.5 */}
      {/* Break point: y=4.5, z=1.75 (front) and z=-1.75 (back) */}
      {/* Ridge: y=5.5, z=0 */}
      
      {/* Front lower slope - from wall (y=3.25, z=2.75) to break (y=4.5, z=1.75) */}
      <mesh position={[0, 3.875, 2.25]} rotation={[Math.PI / 4.5, 0, 0]} castShadow>
        <boxGeometry args={[7.5, 0.2, 1.8]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>
      
      {/* Front upper slope - from break (y=4.5, z=1.75) to ridge (y=5.5, z=0) */}
      <mesh position={[0, 5, 0.875]} rotation={[Math.PI / 10, 0, 0]} castShadow>
        <boxGeometry args={[7.5, 0.2, 1.9]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>
      
      {/* Back lower slope */}
      <mesh position={[0, 3.875, -2.25]} rotation={[-Math.PI / 4.5, 0, 0]} castShadow>
        <boxGeometry args={[7.5, 0.2, 1.8]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>
      
      {/* Back upper slope */}
      <mesh position={[0, 5, -0.875]} rotation={[-Math.PI / 10, 0, 0]} castShadow>
        <boxGeometry args={[7.5, 0.2, 1.9]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>

      {/* Left end - gambrel shape matching front/back */}
      {/* Lower part */}
      <mesh position={[-3.75, 3.875, 0]} rotation={[0, 0, Math.PI / 4.5]} castShadow>
        <boxGeometry args={[0.2, 1.8, 5.5]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>
      {/* Upper part */}
      <mesh position={[-3.75, 5, 0]} rotation={[0, 0, Math.PI / 10]} castShadow>
        <boxGeometry args={[0.2, 1.9, 3.5]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>

      {/* Right end - gambrel shape */}
      {/* Lower part */}
      <mesh position={[3.75, 3.875, 0]} rotation={[0, 0, -Math.PI / 4.5]} castShadow>
        <boxGeometry args={[0.2, 1.8, 5.5]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>
      {/* Upper part */}
      <mesh position={[3.75, 5, 0]} rotation={[0, 0, -Math.PI / 10]} castShadow>
        <boxGeometry args={[0.2, 1.9, 3.5]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>

      {/* Roof ridge cap */}
      <mesh position={[0, 5.5, 0]} castShadow>
        <boxGeometry args={[7.7, 0.2, 0.4]} />
        <meshStandardMaterial color="#3D2817" roughness={0.5} />
      </mesh>

      {/* Snow on roof - matching the roof slopes */}
      {/* Front lower */}
      <mesh position={[0, 3.9, 2.2]} rotation={[Math.PI / 4.5, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.6, 0.1, 1.9]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.0} />
      </mesh>
      {/* Front upper */}
      <mesh position={[0, 5.05, 0.85]} rotation={[Math.PI / 10, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.6, 0.1, 2]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.0} />
      </mesh>
      {/* Back lower */}
      <mesh position={[0, 3.9, -2.2]} rotation={[-Math.PI / 4.5, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.6, 0.1, 1.9]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.0} />
      </mesh>
      {/* Back upper */}
      <mesh position={[0, 5.05, -0.85]} rotation={[-Math.PI / 10, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.6, 0.1, 2]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.0} />
      </mesh>

      {/* Cupola on roof */}
      <mesh position={[0, 6, 0]} castShadow>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>
      <mesh position={[0, 6.6, 0]} castShadow>
        <boxGeometry args={[1.2, 0.2, 1.2]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>
      {/* Cupola windows */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={`cupola-${i}`} position={[x, 6, 0.51]} castShadow>
          <boxGeometry args={[0.2, 0.4, 0.05]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Hayloft opening */}
      <mesh position={[0, 4.5, 2.76]} castShadow>
        <boxGeometry args={[3, 1.5, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Hayloft door beams */}
      <mesh position={[0, 4.5, 2.81]} castShadow>
        <boxGeometry args={[3, 0.1, 0.1]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>
      <mesh position={[-1.5, 4.5, 2.81]} castShadow>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>
      <mesh position={[1.5, 4.5, 2.81]} castShadow>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>

      {/* Large barn doors - bottom section */}
      <mesh position={[0, 0.8, 2.76]} castShadow>
        <boxGeometry args={[3.5, 2, 0.1]} />
        <meshStandardMaterial color="#3D2817" roughness={0.8} />
      </mesh>
      {/* Door cross beams */}
      <mesh position={[0, 0.8, 2.81]} castShadow>
        <boxGeometry args={[3.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>
      <mesh position={[-1.75, 0.8, 2.81]} castShadow>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>
      <mesh position={[1.75, 0.8, 2.81]} castShadow>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>

      {/* Wreath on hayloft */}
      <mesh position={[0, 4.5, 2.85]} castShadow>
        <torusGeometry args={[0.4, 0.06, 8, 16]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
      {/* Wreath bow */}
      <mesh position={[0, 4.8, 2.85]} castShadow>
        <boxGeometry args={[0.2, 0.12, 0.06]} />
        <meshStandardMaterial color="#FF0000" roughness={0.6} />
      </mesh>

      {/* Side windows */}
      {[-2.5, 2.5].map((x, i) => (
        <group key={i}>
          {/* Window glass */}
          <mesh position={[x, 2, 2.76]} castShadow>
            <boxGeometry args={[0.8, 0.8, 0.05]} />
            <meshStandardMaterial
              color="#87CEEB"
              emissive="#FFD700"
              emissiveIntensity={0.6 + Math.sin(timeRef.current * 2 + i) * 0.2}
              transparent
              opacity={0.7}
            />
          </mesh>
          {/* Window frame */}
          <mesh position={[x, 2, 2.78]} castShadow>
            <boxGeometry args={[0.9, 0.9, 0.08]} />
            <meshStandardMaterial color="#3D2817" roughness={0.8} />
          </mesh>
          {/* Window cross */}
          <mesh position={[x, 2, 2.79]} castShadow>
            <boxGeometry args={[0.85, 0.05, 0.02]} />
            <meshStandardMaterial color="#3D2817" roughness={0.8} />
          </mesh>
          <mesh position={[x, 2, 2.79]} castShadow>
            <boxGeometry args={[0.05, 0.85, 0.02]} />
            <meshStandardMaterial color="#3D2817" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Christmas lights around the roof edge */}
      {/* Front lower edge lights */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = -3.5 + (i * 7) / 13;
        const y = 3.9 + (i * 0.8) / 13;
        const z = 2.6 + (i * 0.3) / 13;
        return (
          <mesh key={`front-lower-${i}`} position={[x, y, z]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color={getLightColor(i)}
              emissive={getLightColor(i)}
              emissiveIntensity={0.8 + Math.sin(timeRef.current * 3 + i * 0.5) * 0.3}
            />
          </mesh>
        );
      })}
      {/* Front upper edge lights */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = -3.5 + (i * 7) / 13;
        const y = 5.2;
        const z = 1.1;
        return (
          <mesh key={`front-upper-${i}`} position={[x, y, z]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color={getLightColor(i + 7)}
              emissive={getLightColor(i + 7)}
              emissiveIntensity={0.8 + Math.sin(timeRef.current * 3 + i * 0.5 + 2) * 0.3}
            />
          </mesh>
        );
      })}
      {/* Back lower edge lights */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = -3.5 + (i * 7) / 13;
        const y = 3.9 + (i * 0.8) / 13;
        const z = -2.6 - (i * 0.3) / 13;
        return (
          <mesh key={`back-lower-${i}`} position={[x, y, z]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color={getLightColor(i + 14)}
              emissive={getLightColor(i + 14)}
              emissiveIntensity={0.8 + Math.sin(timeRef.current * 3 + i * 0.5 + 4) * 0.3}
            />
          </mesh>
        );
      })}
      {/* Back upper edge lights */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = -3.5 + (i * 7) / 13;
        const y = 5.2;
        const z = -1.1;
        return (
          <mesh key={`back-upper-${i}`} position={[x, y, z]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color={getLightColor(i + 21)}
              emissive={getLightColor(i + 21)}
              emissiveIntensity={0.8 + Math.sin(timeRef.current * 3 + i * 0.5 + 6) * 0.3}
            />
          </mesh>
        );
      })}

      {/* Point lights for Christmas lights glow */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = -3 + (i * 6) / 7;
        return (
          <pointLight
            key={`light-front-${i}`}
            position={[x, 4.5, 2.8]}
            color={getLightColor(i)}
            intensity={0.3 + Math.sin(timeRef.current * 3 + i) * 0.2}
            distance={5}
            decay={2}
          />
        );
      })}

      {/* Garland around hayloft */}
      {Array.from({ length: 10 }).map((_, i) => {
        const x = -1.4 + (i * 2.8) / 9;
        const y = 4.5 + Math.sin(i * 0.7) * 0.15;
        return (
          <mesh key={`garland-${i}`} position={[x, y, 2.82]} castShadow>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#228B22" roughness={0.7} />
          </mesh>
        );
      })}

      {/* Star on cupola */}
      <mesh position={[0, 7, 0]} castShadow>
        <coneGeometry args={[0.25, 0.4, 5]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 7, 0]} rotation={[0, 0, Math.PI / 5]} castShadow>
        <coneGeometry args={[0.25, 0.4, 5]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

