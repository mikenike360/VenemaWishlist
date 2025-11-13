import * as THREE from 'three';

// Easing functions for smooth animations
export const easing = {
  easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOut: (t: number): number => t * (2 - t),
  easeIn: (t: number): number => t * t,
  smoothstep: (t: number): number => t * t * (3 - 2 * t),
};

// Material presets for consistent look
export const materials = {
  wood: {
    dark: new THREE.MeshStandardMaterial({
      color: '#654321',
      roughness: 0.85,
      metalness: 0.05,
    }),
    medium: new THREE.MeshStandardMaterial({
      color: '#8B4513',
      roughness: 0.8,
      metalness: 0.0,
    }),
    light: new THREE.MeshStandardMaterial({
      color: '#DEB887',
      roughness: 0.75,
      metalness: 0.0,
    }),
  },
  snow: new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    roughness: 0.1,
    metalness: 0.0,
  }),
  ice: new THREE.MeshStandardMaterial({
    color: '#B0E0E6',
    roughness: 0.05,
    metalness: 0.2,
    transparent: true,
    opacity: 0.9,
  }),
  glass: (emissiveColor: string, intensity: number) => new THREE.MeshStandardMaterial({
    color: '#87CEEB',
    emissive: emissiveColor,
    emissiveIntensity: intensity,
    transparent: true,
    opacity: 0.75,
    roughness: 0.1,
    metalness: 0.1,
  }),
  metal: (color: string) => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.2,
    metalness: 0.8,
  }),
};

