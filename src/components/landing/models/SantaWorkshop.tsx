import React from 'react';
import { GiftModel } from './GiftModel';
import { ToyModel } from './ToyModel';
import { Elf } from './Elf';

export const SantaWorkshop: React.FC = () => {
  return (
    <group position={[0, -2.5, 0]}>
      {/* Workshop Floor - only receives shadows from workshop lights */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Warm ambient lighting */}
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#FFE5B4" />
      <pointLight position={[-3, 2, -3]} intensity={0.6} color="#FFD700" />
      <pointLight position={[3, 2, -3]} intensity={0.6} color="#FFD700" />

      {/* Workbench 1 - Left side */}
      <group position={[-3, 0.3, -2]}>
        {/* Table top */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 0.1, 1]} />
          <meshStandardMaterial 
            color="#654321" 
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
        {/* Table legs */}
        {[-0.9, 0.9].map((x) => (
          [-0.4, 0.4].map((z) => (
            <mesh key={`leg-${x}-${z}`} position={[x, -0.2, z]}>
              <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
              <meshStandardMaterial color="#4A2C2A" roughness={0.8} />
            </mesh>
          ))
        ))}
        {/* Tools on workbench - sitting on table top */}
        <mesh position={[-0.3, 0.05, 0]}>
          <boxGeometry args={[0.3, 0.05, 0.05]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.3, 0.05, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 8]} />
          <meshStandardMaterial color="#8B4513" roughness={0.6} />
        </mesh>
        {/* Toy in progress - sitting on table */}
        <ToyModel position={[0, 0.05, 0.2]} toyType="car" scale={0.6} rotation={[0, 0.5, 0]} noAnimation />
        {/* Elf working at this bench - standing on floor */}
        <Elf position={[-0.5, -0.3, 0.6]} scale={0.6} rotation={[0, Math.PI, 0]} noAnimation workingPose="assembling" />
      </group>

      {/* Workbench 2 - Right side */}
      <group position={[3, 0.3, -2]}>
        {/* Table top */}
        <mesh receiveShadow>
          <boxGeometry args={[2, 0.1, 1]} />
          <meshStandardMaterial 
            color="#654321" 
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
        {/* Table legs */}
        {[-0.9, 0.9].map((x) => (
          [-0.4, 0.4].map((z) => (
            <mesh key={`leg-${x}-${z}`} position={[x, -0.2, z]}>
              <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
              <meshStandardMaterial color="#4A2C2A" roughness={0.8} />
            </mesh>
          ))
        ))}
        {/* Toy parts - sitting on table */}
        <mesh position={[-0.4, 0.05, 0]}>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial color="#FF4444" roughness={0.5} />
        </mesh>
        <mesh position={[0.4, 0.05, 0]}>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial color="#4444FF" roughness={0.5} />
        </mesh>
        {/* Elf working at this bench - standing on floor */}
        <Elf position={[0.5, -0.3, 0.6]} scale={0.6} rotation={[0, Math.PI, 0]} noAnimation workingPose="assembling" />
      </group>

      {/* Gift Wrapping Station 1 - Center left */}
      <group position={[-2, 0.3, 2]}>
        {/* Table top */}
        <mesh receiveShadow>
          <boxGeometry args={[1.5, 0.1, 1.5]} />
          <meshStandardMaterial 
            color="#D2B48C" 
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
        {/* Table legs */}
        {[-0.6, 0.6].map((x) => (
          [-0.6, 0.6].map((z) => (
            <mesh key={`leg-${x}-${z}`} position={[x, -0.2, z]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
              <meshStandardMaterial color="#8B7355" roughness={0.8} />
            </mesh>
          ))
        ))}
        {/* Gifts on table - sitting on table top */}
        <GiftModel position={[-0.3, 0.05, -0.3]} scale={0.5} rotation={[0, 0.3, 0]} noAnimation />
        <GiftModel position={[0.3, 0.05, 0.3]} scale={0.5} rotation={[0, -0.2, 0]} noAnimation />
        {/* Wrapping paper roll - sitting on table */}
        <mesh position={[0, 0.2, 0]} rotation={[0, Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
          <meshStandardMaterial color="#FF6B9D" roughness={0.3} />
        </mesh>
        {/* Elf wrapping gifts - standing on floor */}
        <Elf position={[0, -0.3, 0.9]} scale={0.6} rotation={[0, Math.PI, 0]} noAnimation workingPose="wrapping" />
      </group>

      {/* Gift Wrapping Station 2 - Center right */}
      <group position={[2, 0.3, 2]}>
        {/* Table top */}
        <mesh receiveShadow>
          <boxGeometry args={[1.5, 0.1, 1.5]} />
          <meshStandardMaterial 
            color="#D2B48C" 
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
        {/* Table legs */}
        {[-0.6, 0.6].map((x) => (
          [-0.6, 0.6].map((z) => (
            <mesh key={`leg-${x}-${z}`} position={[x, -0.2, z]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
              <meshStandardMaterial color="#8B7355" roughness={0.8} />
            </mesh>
          ))
        ))}
        {/* Gifts on table - sitting on table top */}
        <GiftModel position={[-0.3, 0.05, 0.3]} scale={0.5} rotation={[0, 0.5, 0]} noAnimation />
        <GiftModel position={[0.3, 0.05, -0.3]} scale={0.5} rotation={[0, -0.4, 0]} noAnimation />
        {/* Elf wrapping gifts - standing on floor */}
        <Elf position={[0, -0.3, 0.9]} scale={0.6} rotation={[0, Math.PI, 0]} noAnimation workingPose="wrapping" />
      </group>

      {/* Central Workbench - Main assembly area */}
      <group position={[0, 0.3, 0]}>
        {/* Table top - larger */}
        <mesh receiveShadow>
          <boxGeometry args={[3, 0.1, 2]} />
          <meshStandardMaterial 
            color="#654321" 
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
        {/* Table legs */}
        {[-1.3, 1.3].map((x) => (
          [-0.9, 0.9].map((z) => (
            <mesh key={`leg-${x}-${z}`} position={[x, -0.2, z]}>
              <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
              <meshStandardMaterial color="#4A2C2A" roughness={0.8} />
            </mesh>
          ))
        ))}
        {/* Toys being assembled - sitting on table */}
        <ToyModel position={[-0.8, 0.05, 0]} toyType="car" scale={0.7} rotation={[0, 0.8, 0]} noAnimation />
        <ToyModel position={[0.8, 0.05, 0]} toyType="car" scale={0.7} rotation={[0, -0.3, 0]} noAnimation />
        {/* Tool box - sitting on table */}
        <mesh position={[0, 0.2, -0.6]}>
          <boxGeometry args={[0.6, 0.3, 0.4]} />
          <meshStandardMaterial color="#8B4513" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.35, -0.6]}>
          <boxGeometry args={[0.55, 0.05, 0.35]} />
          <meshStandardMaterial color="#A0522D" roughness={0.5} />
        </mesh>
        {/* Elves working at central bench - standing on floor */}
        <Elf position={[-1.2, -0.3, 0.5]} scale={0.6} rotation={[0, -Math.PI / 3, 0]} noAnimation workingPose="assembling" />
        <Elf position={[1.2, -0.3, 0.5]} scale={0.6} rotation={[0, Math.PI / 3, 0]} noAnimation workingPose="assembling" />
      </group>

      {/* Wall decorations - warm lights */}
      <mesh position={[-4, 2, -4]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700"
          emissiveIntensity={1.0}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[4, 2, -4]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700"
          emissiveIntensity={1.0}
          roughness={0.1}
        />
      </mesh>

      {/* Storage shelves - back wall */}
      <group position={[0, 1, -4]}>
        {/* Shelf 1 */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[6, 0.1, 1]} />
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </mesh>
        {/* Shelf 2 */}
        <mesh position={[0, 0.8, 0]} receiveShadow>
          <boxGeometry args={[6, 0.1, 1]} />
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </mesh>
        {/* Shelf supports */}
        {[-2.8, -1.4, 0, 1.4, 2.8].map((x) => (
          <mesh key={`support-${x}`} position={[x, 0.4, 0]}>
            <boxGeometry args={[0.1, 0.8, 0.1]} />
            <meshStandardMaterial color="#654321" roughness={0.8} />
          </mesh>
        ))}
        {/* Gifts on shelves - sitting on shelf surfaces */}
        <GiftModel position={[-2, 0.05, 0]} scale={0.4} rotation={[0, 0.2, 0]} noAnimation />
        <GiftModel position={[-1, 0.05, 0]} scale={0.4} rotation={[0, -0.3, 0]} noAnimation />
        <GiftModel position={[0, 0.05, 0]} scale={0.4} rotation={[0, 0.4, 0]} noAnimation />
        <GiftModel position={[1, 0.05, 0]} scale={0.4} rotation={[0, -0.2, 0]} noAnimation />
        <GiftModel position={[2, 0.05, 0]} scale={0.4} rotation={[0, 0.3, 0]} noAnimation />
        <GiftModel position={[-1.5, 0.85, 0]} scale={0.35} rotation={[0, -0.2, 0]} noAnimation />
        <GiftModel position={[0, 0.85, 0]} scale={0.35} rotation={[0, 0.3, 0]} noAnimation />
        <GiftModel position={[1.5, 0.85, 0]} scale={0.35} rotation={[0, -0.4, 0]} noAnimation />
      </group>
    </group>
  );
};

