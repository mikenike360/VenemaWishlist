import { Text } from '@react-three/drei';

/**
 * Wood plaque on the fireplace mantel — brand signal inside the room.
 * Sits on the mantel shelf group at [0, 1.78, -3.18].
 */
export function MantelTitle() {
  return (
    <group position={[0, 0.12, 0.08]}>
      <mesh castShadow receiveShadow position={[0, 0, -0.012]}>
        <boxGeometry args={[1.05, 0.2, 0.04]} />
        <meshStandardMaterial color="#5c3b24" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.98, 0.14, 0.01]} />
        <meshStandardMaterial color="#3a2418" roughness={0.75} />
      </mesh>
      <Text
        position={[0, 0.01, 0.02]}
        fontSize={0.065}
        color="#f3ead7"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.95}
        textAlign="center"
        outlineWidth={0.003}
        outlineColor="#2a1810"
      >
        Family Wishlist
      </Text>
    </group>
  );
}
