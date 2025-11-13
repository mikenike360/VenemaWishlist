import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Snowflakes: React.FC = () => {
  const snowflakes = useRef<THREE.Points>(null);
  const count = 3000;
  const timeRef = useRef(0);

  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count);
  const sizes = new Float32Array(count);
  const rotations = new Float32Array(count);
  
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 50;
    positions[i + 1] = Math.random() * 20 + 5;
    positions[i + 2] = (Math.random() - 0.5) * 50;
    velocities[i / 3] = 0.005 + Math.random() * 0.015;
    sizes[i / 3] = 0.1 + Math.random() * 0.15;
    rotations[i / 3] = Math.random() * Math.PI * 2;
  }

  useFrame((state, delta) => {
    if (snowflakes.current) {
      timeRef.current += delta;
      const positions = snowflakes.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        const idx = (i - 1) / 3;
        // Vertical fall with slight horizontal drift
        positions[i] -= velocities[idx];
        positions[i - 1] += Math.sin(timeRef.current + rotations[idx]) * 0.002;
        if (positions[i] < -5) {
          positions[i] = 25;
          positions[i - 1] = (Math.random() - 0.5) * 50;
          positions[i + 1] = (Math.random() - 0.5) * 50;
        }
      }
      snowflakes.current.geometry.attributes.position.needsUpdate = true;
      snowflakes.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={snowflakes}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.2} 
        color="#ffffff" 
        transparent 
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

