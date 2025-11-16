import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ToyModelProps {
  position: [number, number, number];
  toyType?: 'car' | 'train'; // Type of toy to render
  scale?: number;
  rotation?: [number, number, number];
  noAnimation?: boolean;
}

// Toy car colors
const carColors = ['#FF4444', '#4444FF', '#44FF44', '#FF44FF', '#FFFF44', '#44FFFF'];
// Train colors
const trainColors = ['#8B4513', '#654321', '#A0522D'];

export const ToyModel: React.FC<ToyModelProps> = ({ 
  position, 
  toyType = 'car',
  scale = 1,
  rotation = [0, 0, 0],
  noAnimation = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  
  // Pick random colors
  const carColor = React.useMemo(() => 
    carColors[Math.floor(Math.random() * carColors.length)], 
    []
  );
  const trainColor = React.useMemo(() => 
    trainColors[Math.floor(Math.random() * trainColors.length)], 
    []
  );

  useFrame((state, delta) => {
    if (groupRef.current && !noAnimation) {
      timeRef.current += delta;
      // Gentle bobbing animation
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current * 1.2) * 0.03;
    }
  });

  if (toyType === 'train') {
    return (
      <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
        {/* Train engine - main body */}
        <mesh position={[0, 0.1 * scale, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7 * scale, 0.18 * scale, 0.4 * scale]} />
          <meshStandardMaterial 
            color={trainColor}
            roughness={0.5}
            metalness={0.15}
          />
        </mesh>
        
        {/* Train front - cone pointing forward */}
        <mesh position={[0, 0.1 * scale, 0.2 * scale]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.35 * scale, 0.15 * scale, 8]} />
          <meshStandardMaterial 
            color={trainColor}
            roughness={0.5}
            metalness={0.15}
          />
        </mesh>
        
        {/* Train cab - smaller cabin on top, positioned more toward center */}
        <mesh position={[0, 0.26 * scale, -0.05 * scale]} castShadow>
          <boxGeometry args={[0.28 * scale, 0.18 * scale, 0.25 * scale]} />
          <meshStandardMaterial 
            color={trainColor}
            roughness={0.5}
            metalness={0.15}
          />
        </mesh>
        
        {/* Train chimney - on the engine, positioned better */}
        <mesh position={[-0.15 * scale, 0.24 * scale, -0.1 * scale]} castShadow>
          <cylinderGeometry args={[0.04 * scale, 0.035 * scale, 0.18 * scale, 12]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Front cowcatcher - positioned at front */}
        <mesh position={[0, 0.04 * scale, 0.22 * scale]} rotation={[Math.PI / 8, 0, 0]} castShadow>
          <boxGeometry args={[0.3 * scale, 0.03 * scale, 0.06 * scale]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Wheels - better aligned with train body */}
        {[-0.22, -0.07, 0.07, 0.22].map((x, i) => (
          <React.Fragment key={i}>
            {/* Left wheel */}
            <mesh position={[x * scale, 0.06 * scale, -0.18 * scale]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <cylinderGeometry args={[0.1 * scale, 0.1 * scale, 0.04 * scale, 20]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} />
            </mesh>
            {/* Right wheel */}
            <mesh position={[x * scale, 0.06 * scale, 0.18 * scale]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <cylinderGeometry args={[0.1 * scale, 0.1 * scale, 0.04 * scale, 20]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} />
            </mesh>
          </React.Fragment>
        ))}
        
        {/* Windows in cab - front window */}
        <mesh position={[0, 0.26 * scale, 0.08 * scale]} castShadow>
          <boxGeometry args={[0.22 * scale, 0.1 * scale, 0.015 * scale]} />
          <meshStandardMaterial 
            color="#87CEEB" 
            transparent 
            opacity={0.7}
            emissive="#87CEEB" 
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        
        {/* Side windows in cab */}
        <mesh position={[-0.12 * scale, 0.26 * scale, -0.05 * scale]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.2 * scale, 0.1 * scale, 0.015 * scale]} />
          <meshStandardMaterial 
            color="#87CEEB" 
            transparent 
            opacity={0.6}
            emissive="#87CEEB" 
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0.12 * scale, 0.26 * scale, -0.05 * scale]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.2 * scale, 0.1 * scale, 0.015 * scale]} />
          <meshStandardMaterial 
            color="#87CEEB" 
            transparent 
            opacity={0.6}
            emissive="#87CEEB" 
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        
        {/* Train bell on top of cab */}
        <mesh position={[0, 0.38 * scale, -0.05 * scale]} castShadow>
          <sphereGeometry args={[0.035 * scale, 12, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.2} />
        </mesh>
      </group>
    );
  }

  // Car model - more detailed and realistic
  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {/* Car body - main chassis */}
      <mesh position={[0, 0.13 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42 * scale, 0.16 * scale, 0.28 * scale, 2, 2, 2]} />
        <meshStandardMaterial 
          color={carColor}
          roughness={0.4}
          metalness={0.4}
        />
      </mesh>
      
      {/* Car roof - more streamlined */}
      <mesh position={[0, 0.24 * scale, -0.01 * scale]} castShadow>
        <boxGeometry args={[0.36 * scale, 0.11 * scale, 0.22 * scale]} />
        <meshStandardMaterial 
          color={carColor}
          roughness={0.4}
          metalness={0.4}
        />
      </mesh>
      
      {/* Windshield - more realistic angle */}
      <mesh position={[0, 0.21 * scale, 0.11 * scale]} rotation={[Math.PI / 5, 0, 0]} castShadow>
        <boxGeometry args={[0.34 * scale, 0.09 * scale, 0.025 * scale]} />
        <meshStandardMaterial 
          color="#B0E0E6" 
          transparent 
          opacity={0.65}
          emissive="#B0E0E6"
          emissiveIntensity={0.25}
          roughness={0.1}
          metalness={0.15}
        />
      </mesh>
      
      {/* Rear window */}
      <mesh position={[0, 0.21 * scale, -0.12 * scale]} rotation={[-Math.PI / 5, 0, 0]} castShadow>
        <boxGeometry args={[0.32 * scale, 0.08 * scale, 0.02 * scale]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          transparent 
          opacity={0.5}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      
      {/* Side windows */}
      <mesh position={[-0.18 * scale, 0.21 * scale, 0.02 * scale]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.25 * scale, 0.08 * scale, 0.02 * scale]} />
        <meshStandardMaterial 
          color="#B0E0E6" 
          transparent 
          opacity={0.6}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0.18 * scale, 0.21 * scale, 0.02 * scale]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.25 * scale, 0.08 * scale, 0.02 * scale]} />
        <meshStandardMaterial 
          color="#B0E0E6" 
          transparent 
          opacity={0.6}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      
      {/* Front bumper */}
      <mesh position={[0, 0.08 * scale, 0.15 * scale]} castShadow>
        <boxGeometry args={[0.4 * scale, 0.04 * scale, 0.03 * scale]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Rear bumper */}
      <mesh position={[0, 0.08 * scale, -0.15 * scale]} castShadow>
        <boxGeometry args={[0.4 * scale, 0.04 * scale, 0.03 * scale]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Wheels with better detail */}
      {[-0.13, 0.13].map((x, i) => (
        <React.Fragment key={i}>
          {/* Front wheels */}
          <mesh position={[x * scale, 0.06 * scale, 0.14 * scale]} castShadow>
            <cylinderGeometry args={[0.07 * scale, 0.07 * scale, 0.05 * scale, 20]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Wheel rim */}
          <mesh position={[x * scale, 0.06 * scale, 0.14 * scale]} castShadow>
            <torusGeometry args={[0.055 * scale, 0.008 * scale, 8, 20]} />
            <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Wheel hub */}
          <mesh position={[x * scale, 0.06 * scale, 0.14 * scale]} castShadow>
            <cylinderGeometry args={[0.02 * scale, 0.02 * scale, 0.06 * scale, 8]} />
            <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
          </mesh>
          
          {/* Back wheels */}
          <mesh position={[x * scale, 0.06 * scale, -0.14 * scale]} castShadow>
            <cylinderGeometry args={[0.07 * scale, 0.07 * scale, 0.05 * scale, 20]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Wheel rim */}
          <mesh position={[x * scale, 0.06 * scale, -0.14 * scale]} castShadow>
            <torusGeometry args={[0.055 * scale, 0.008 * scale, 8, 20]} />
            <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Wheel hub */}
          <mesh position={[x * scale, 0.06 * scale, -0.14 * scale]} castShadow>
            <cylinderGeometry args={[0.02 * scale, 0.02 * scale, 0.06 * scale, 8]} />
            <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
          </mesh>
        </React.Fragment>
      ))}
      
      {/* Headlights - more prominent */}
      <mesh position={[-0.11 * scale, 0.11 * scale, 0.145 * scale]} castShadow>
        <sphereGeometry args={[0.035 * scale, 16, 16]} />
        <meshStandardMaterial 
          color="#FFFFCC" 
          emissive="#FFFFAA"
          emissiveIntensity={1.0}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0.11 * scale, 0.11 * scale, 0.145 * scale]} castShadow>
        <sphereGeometry args={[0.035 * scale, 16, 16]} />
        <meshStandardMaterial 
          color="#FFFFCC" 
          emissive="#FFFFAA"
          emissiveIntensity={1.0}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
      
      {/* Headlight housings */}
      <mesh position={[-0.11 * scale, 0.11 * scale, 0.145 * scale]} castShadow>
        <torusGeometry args={[0.04 * scale, 0.005 * scale, 8, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.11 * scale, 0.11 * scale, 0.145 * scale]} castShadow>
        <torusGeometry args={[0.04 * scale, 0.005 * scale, 8, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Grille */}
      <mesh position={[0, 0.1 * scale, 0.15 * scale]} castShadow>
        <boxGeometry args={[0.25 * scale, 0.03 * scale, 0.01 * scale]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Side mirrors */}
      <mesh position={[-0.2 * scale, 0.18 * scale, 0.08 * scale]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[0.04 * scale, 0.03 * scale, 0.02 * scale]} />
        <meshStandardMaterial color={carColor} roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0.2 * scale, 0.18 * scale, 0.08 * scale]} rotation={[0, -Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[0.04 * scale, 0.03 * scale, 0.02 * scale]} />
        <meshStandardMaterial color={carColor} roughness={0.4} metalness={0.4} />
      </mesh>
    </group>
  );
};

