import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export const villageModels = {
  gnome: '/models/gnome.glb',
  santa: '/models/santa.glb',
  snowman: '/models/snowman.glb',
  pine: '/models/pine.glb',
  lamp: '/models/lamp.glb',
  car: '/models/car.glb',
  gazebo: '/models/gazebo.glb',
  pineSnow: '/models/pine-snow.glb',
  fireplace: '/models/fireplace.glb',
  couch: '/models/couch.glb',
  rug: '/models/rug.glb',
  floorLamp: '/models/floor-lamp.glb',
  window: '/models/window.glb',
  christmasTree: '/models/christmas-tree.glb',
  gifts: '/models/gifts.glb',
  trainLoco: '/models/train-loco.glb',
  trainWagon: '/models/train-wagon.glb',
  trainCarriage: '/models/train-carriage.glb',
} as const;

for (const url of Object.values(villageModels)) {
  useGLTF.preload(url);
}

/**
 * Polygonal Mind characters are exported with their arms along Z and their
 * face along -X. A quarter turn brings that face to +Z, which is the
 * direction the old primitives faced before the scene yaws them.
 */
export const CHARACTER_YAW = Math.PI / 2;

interface FitModelProps {
  url: string;
  height: number;
  yaw?: number;
  /** Multiply untextured albedo so a night scene can still read the model. */
  brighten?: number;
  /** Fit to height (default) or to the larger horizontal span. */
  fit?: 'height' | 'width';
  /** Bias depth so flat props (rugs) do not z-fight the floor. */
  polygonOffset?: boolean;
  /** Hide small ground-level meshes (e.g. baked gifts under a tree GLB). */
  hideGroundClutter?: boolean;
}

function fittedClone(
  source: THREE.Object3D,
  height: number,
  brighten: number,
  fit: 'height' | 'width',
  polygonOffset: boolean,
  hideGroundClutter: boolean,
) {
  const root = source.clone(true);
  root.position.set(0, 0, 0);
  root.rotation.set(0, 0, 0);
  root.scale.set(1, 1, 1);
  root.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const measure = fit === 'width' ? Math.max(size.x, size.z) : size.y;
  const factor = height / Math.max(measure, 1e-4);
  root.scale.multiplyScalar(factor);
  root.updateMatrixWorld(true);

  const fitted = new THREE.Box3().setFromObject(root);
  const center = fitted.getCenter(new THREE.Vector3());
  root.position.x -= center.x;
  root.position.z -= center.z;
  root.position.y -= fitted.min.y;
  root.updateMatrixWorld(true);

  let meshIndex = 0;
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    if (hideGroundClutter) {
      const meshBox = new THREE.Box3().setFromObject(child);
      const meshSize = meshBox.getSize(new THREE.Vector3());
      const meshCenter = meshBox.getCenter(new THREE.Vector3());
      const mat = Array.isArray(child.material) ? child.material[0] : child.material;
      const matName = mat && 'name' in mat ? String(mat.name) : '';
      // Keep foliage + trunk + star. Hide floor gifts and baked bauble shells —
      // after the gift-cave carve those shells hang in empty air between tiers.
      const isFoliageOrTrunk =
        matName === 'mat10' || matName === 'mat11' || matName === 'mat20';
      const isStar = matName === 'mat12' && meshCenter.y > 1.5;
      const isShortFloorProp = meshCenter.y < 0.35 && meshSize.y < 0.35;
      if (isShortFloorProp || (!isFoliageOrTrunk && !isStar)) {
        child.visible = false;
        return;
      }
      // Pull lower canopy faces inward so slanted boughs cannot cut through gifts.
      if (matName === 'mat11' || matName === 'mat10') {
        const geom = child.geometry.clone();
        child.geometry = geom;
        const pos = geom.attributes.position;
        const v = new THREE.Vector3();
        const caveHeight = 0.95;
        const floorY = 0.48;
        const innerR = 0.22;
        const rimR = 0.7;
        child.updateWorldMatrix(true, false);
        for (let i = 0; i < pos.count; i++) {
          v.fromBufferAttribute(pos, i);
          child.localToWorld(v);
          if (v.y < caveHeight) {
            const t = Math.max(v.y, 0) / caveHeight;
            const maxR = innerR + (rimR - innerR) * t * t;
            const radial = Math.hypot(v.x, v.z);
            if (radial > maxR && radial > 1e-4) {
              const s = maxR / radial;
              v.x *= s;
              v.z *= s;
            }
            if (v.y < floorY) v.y = floorY;
            child.worldToLocal(v);
            pos.setXYZ(i, v.x, v.y, v.z);
          }
        }
        pos.needsUpdate = true;
        geom.computeVertexNormals();
      }
    }
    // Flat multi-layer props (rugs) should not cast shadows onto themselves.
    child.castShadow = !polygonOffset;
    child.receiveShadow = true;
    if (polygonOffset) {
      // Separate coplanar layers so they do not z-fight each other.
      child.position.y += meshIndex * 0.004;
      meshIndex += 1;
    }
    if (brighten <= 1 && !polygonOffset) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    const nextMats = materials.map((material) => {
      const next = material.clone();
      if (brighten > 1 && next instanceof THREE.MeshStandardMaterial && !next.map) {
        next.color.multiplyScalar(brighten);
        next.emissive.copy(next.color);
        next.emissiveIntensity = 0.28;
      }
      if (polygonOffset) {
        next.polygonOffset = true;
        next.polygonOffsetFactor = -4;
        next.polygonOffsetUnits = -4;
      }
      return next;
    });
    child.material = Array.isArray(child.material) ? nextMats : nextMats[0];
  });

  return root;
}

export function FitModel({
  url,
  height,
  yaw = 0,
  brighten = 1,
  fit = 'height',
  polygonOffset = false,
  hideGroundClutter = false,
}: FitModelProps) {
  const gltf = useGLTF(url);
  const group = useRef<THREE.Group>(null);
  const { actions, names } = useAnimations(gltf.animations, group);
  // clutterRev bumps when the hide heuristic changes so HMR remakes the clone.
  const clutterRev = hideGroundClutter ? 18 : 0;
  const object = useMemo(
    () => fittedClone(gltf.scene, height, brighten, fit, polygonOffset, hideGroundClutter),
    [gltf.scene, height, brighten, fit, polygonOffset, hideGroundClutter, clutterRev],
  );

  useEffect(() => {
    const name = names.find((clip) => /idle/i.test(clip)) ?? names[0];
    const action = name ? actions[name] : undefined;
    action?.reset().play();
    return () => {
      action?.stop();
    };
  }, [actions, names]);

  return (
    <group ref={group} rotation={[0, yaw, 0]}>
      <primitive object={object} />
    </group>
  );
}
