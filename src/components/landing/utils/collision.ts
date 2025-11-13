// Collision detection utilities

export interface CollisionObject {
  x: number;
  z: number;
  r: number; // radius
}

// All collision objects (buildings, trees, lamp posts, benches, snowmen, presents, etc.)
export const getCollisionObjects = (): CollisionObject[] => {
  return [
    // Buildings
    { x: 0, z: -8, r: 2.2 }, // Church
    { x: 8, z: 2, r: 1.7 }, // Shop
    { x: -8, z: 2, r: 1.7 }, // Cabin
    { x: 10, z: -2, r: 1.2 }, // House
    { x: 8, z: -4, r: 1.2 }, // House
    { x: -10, z: -2, r: 1.2 }, // House
    { x: -8, z: -4, r: 1.2 }, // House
    // Trees
    { x: 0, z: 0, r: 1.8 }, // Center tree
    { x: -4, z: -3, r: 1.0 }, // Tree
    { x: 4, z: -3, r: 1.1 }, // Tree
    { x: -3, z: 4, r: 0.9 }, // Tree
    { x: 3, z: 4, r: 1.2 }, // Tree
    { x: -12, z: -6, r: 0.8 }, // Tree
    { x: 12, z: -6, r: 0.9 }, // Tree
    { x: -10, z: 6, r: 1.0 }, // Tree
    { x: 10, z: 6, r: 1.1 }, // Tree
    // Lamp posts
    { x: -4, z: -4, r: 0.15 },
    { x: 4, z: -4, r: 0.15 },
    { x: -4, z: 4, r: 0.15 },
    { x: 4, z: 4, r: 0.15 },
    { x: 0, z: -6, r: 0.15 },
    { x: 0, z: 6, r: 0.15 },
    { x: -6, z: 0, r: 0.15 },
    { x: 6, z: 0, r: 0.15 },
    // Benches
    { x: -6, z: 8, r: 0.9 },
    { x: 6, z: 8, r: 0.9 },
    { x: 0, z: 12, r: 0.9 },
    // Snowmen
    { x: -6, z: -1, r: 0.6 },
    { x: 6, z: -1, r: 0.6 },
    { x: -5, z: 5, r: 0.6 },
    { x: 5, z: 5, r: 0.6 },
    // Presents
    { x: -0.8, z: 0.8, r: 0.3 },
    { x: 0.8, z: 0.8, r: 0.3 },
    { x: -0.5, z: -1.2, r: 0.3 },
    { x: 0.5, z: -1.2, r: 0.3 },
    { x: -4.5, z: -2.5, r: 0.3 },
    { x: 4.5, z: -2.5, r: 0.3 },
    { x: -2.5, z: 4.5, r: 0.3 },
    { x: 2.5, z: 4.5, r: 0.3 },
    // Bridge
    { x: 0, z: 6, r: 1.8 },
    // Pond border (avoid getting too close)
    { x: 0, z: 8, r: 4.2 },
  ];
};

export const calculateCollisionAvoidance = (
  newX: number,
  newZ: number,
  avoidRadius: number,
  collisionObjects: CollisionObject[]
): { steerX: number; steerZ: number } => {
  let steerX = 0;
  let steerZ = 0;

  for (const obj of collisionObjects) {
    const dist = Math.sqrt(Math.pow(newX - obj.x, 2) + Math.pow(newZ - obj.z, 2));
    const minDist = obj.r + avoidRadius;
    if (dist < minDist) {
      // Calculate steering force away from object
      const angle = Math.atan2(newZ - obj.z, newX - obj.x);
      const pushStrength = (minDist - dist) / avoidRadius;
      steerX += Math.cos(angle) * pushStrength * 0.3;
      steerZ += Math.sin(angle) * pushStrength * 0.3;
    }
  }

  return { steerX, steerZ };
};

