import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  DEFAULT_CAMERA_POSITION,
  TREE_CENTER_X,
  TREE_CENTER_Z,
  TREE_LOOK_Y,
} from '../../../lib/roomLayout';

export interface OrbitHold {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

interface CameraControlsProps {
  focus: [number, number, number] | null;
  /** Bump to ease the camera back to the default wide shot. */
  homeRequest?: number;
  onRelease: () => void;
  orbit: React.MutableRefObject<OrbitHold>;
}

const TREE = new THREE.Vector3(TREE_CENTER_X, TREE_LOOK_Y, TREE_CENTER_Z);
const HOME_CAMERA = new THREE.Vector3(...DEFAULT_CAMERA_POSITION);
const YAW_SPEED = 1.15;
const PITCH_SPEED = 0.7;
/** Allow a bit more swing toward the fireplace (+X side of the tree). */
const MIN_AZIMUTH = -0.85;
const MAX_AZIMUTH = 1.05;
/** Pull search focus from the default viewing side (fireplace-facing). */
const VIEW_FROM = new THREE.Vector3(0.45, 0, 0.9).normalize();

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  focus,
  homeRequest = 0,
  onRelease,
  orbit,
}) => {
  const controls = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const keys = useRef<OrbitHold>({ left: false, right: false, up: false, down: false });
  const focusVec = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  const spherical = useRef(new THREE.Spherical());
  const releaseRef = useRef(onRelease);
  const goingHome = useRef(false);
  const lastHomeRequest = useRef(0);
  const { gl } = useThree();

  releaseRef.current = onRelease;

  useEffect(() => {
    if (homeRequest === lastHomeRequest.current) return;
    lastHomeRequest.current = homeRequest;
    if (homeRequest <= 0) return;
    goingHome.current = true;
    releaseRef.current();
  }, [homeRequest]);

  useEffect(() => {
    const held = keys.current;
    const setKey = (key: string, down: boolean) => {
      if (key === 'ArrowLeft') held.left = down;
      if (key === 'ArrowRight') held.right = down;
      if (key === 'ArrowUp') held.up = down;
      if (key === 'ArrowDown') held.down = down;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      setKey(event.key, true);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      setKey(event.key, false);
    };
    const clearKeys = () => {
      held.left = false;
      held.right = false;
      held.up = false;
      held.down = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearKeys);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearKeys);
      clearKeys();
    };
  }, []);

  useEffect(() => {
    const element = gl.domElement;
    const blockMiddleClick = (event: Event) => {
      if ('button' in event && event.button === 1) event.preventDefault();
    };
    element.addEventListener('pointerdown', blockMiddleClick);
    element.addEventListener('auxclick', blockMiddleClick);
    return () => {
      element.removeEventListener('pointerdown', blockMiddleClick);
      element.removeEventListener('auxclick', blockMiddleClick);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const current = controls.current;
    if (!current) return;

    const buttons = orbit.current;
    const yaw = (buttons.left || keys.current.left ? 1 : 0) - (buttons.right || keys.current.right ? 1 : 0);
    const pitch = (buttons.up || keys.current.up ? 1 : 0) - (buttons.down || keys.current.down ? 1 : 0);

    if (yaw !== 0 || pitch !== 0) {
      goingHome.current = false;
      if (focus) releaseRef.current();
      const step = 1 - Math.exp(-delta * 2.5);
      if (current.target.distanceToSquared(TREE) > 0.04) {
        offset.current.copy(TREE).sub(current.target).multiplyScalar(step);
        current.target.add(offset.current);
        current.object.position.add(offset.current);
      }
      offset.current.copy(current.object.position).sub(current.target);
      spherical.current.setFromVector3(offset.current);
      spherical.current.theta = THREE.MathUtils.clamp(
        spherical.current.theta - yaw * YAW_SPEED * delta,
        MIN_AZIMUTH,
        MAX_AZIMUTH,
      );
      spherical.current.phi = THREE.MathUtils.clamp(
        spherical.current.phi - pitch * PITCH_SPEED * delta,
        current.minPolarAngle,
        current.maxPolarAngle,
      );
      spherical.current.radius = THREE.MathUtils.clamp(spherical.current.radius, current.minDistance, current.maxDistance);
      spherical.current.makeSafe();
      current.object.position.setFromSpherical(spherical.current).add(current.target);
      current.object.lookAt(current.target);
      current.update();
      return;
    }

    if (goingHome.current) {
      current.target.lerp(TREE, 0.12);
      current.object.position.lerp(HOME_CAMERA, 0.12);
      current.update();
      const atHome =
        current.object.position.distanceToSquared(HOME_CAMERA) < 0.0025 &&
        current.target.distanceToSquared(TREE) < 0.0025;
      if (atHome) goingHome.current = false;
      return;
    }

    if (!focus) return;
    focusVec.current.set(focus[0], Math.max(focus[1] + 0.25, 0.4), focus[2]);
    // Stand closer so face nameplates are readable on search focus.
    desired.current.copy(focusVec.current).addScaledVector(VIEW_FROM, 1.35).setY(1.05);
    current.target.lerp(focusVec.current, 0.1);
    current.object.position.lerp(desired.current, 0.1);
    current.update();
  });

  return (
    <OrbitControls
      ref={controls}
      target={[TREE.x, TREE.y, TREE.z]}
      enableZoom={true}
      enablePan={false}
      enableRotate={true}
      minDistance={1.0}
      maxDistance={5.2}
      minPolarAngle={Math.PI / 4.2}
      maxPolarAngle={Math.PI / 2.02}
      minAzimuthAngle={MIN_AZIMUTH}
      maxAzimuthAngle={MAX_AZIMUTH}
      autoRotate={false}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.8}
      zoomSpeed={1.1}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.ROTATE,
        RIGHT: THREE.MOUSE.ROTATE,
      }}
      onStart={() => {
        goingHome.current = false;
        releaseRef.current();
      }}
    />
  );
};
