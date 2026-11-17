import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export interface OrbitHold {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

interface CameraControlsProps {
  focus: [number, number, number] | null;
  onRelease: () => void;
  orbit: React.MutableRefObject<OrbitHold>;
}

const TREE = new THREE.Vector3(0, 0.4, 0);
const YAW_SPEED = 1.15;
const PITCH_SPEED = 0.7;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
}

export const CameraControls: React.FC<CameraControlsProps> = ({ focus, onRelease, orbit }) => {
  const controls = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const keys = useRef<OrbitHold>({ left: false, right: false, up: false, down: false });
  const focusVec = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  const spherical = useRef(new THREE.Spherical());
  const releaseRef = useRef(onRelease);
  const { gl } = useThree();

  releaseRef.current = onRelease;

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
      if (focus) releaseRef.current();
      const step = 1 - Math.exp(-delta * 2.5);
      if (current.target.distanceToSquared(TREE) > 0.04) {
        offset.current.copy(TREE).sub(current.target).multiplyScalar(step);
        current.target.add(offset.current);
        current.object.position.add(offset.current);
      }
      offset.current.copy(current.object.position).sub(current.target);
      spherical.current.setFromVector3(offset.current);
      spherical.current.theta -= yaw * YAW_SPEED * delta;
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

    if (!focus) return;
    focusVec.current.set(focus[0], 0.4, focus[2]);
    const outward = focusVec.current.clone().setY(0);
    if (outward.lengthSq() < 0.001) outward.set(0, 0, 1);
    outward.normalize();
    desired.current.copy(focusVec.current).addScaledVector(outward, 3.2).setY(2.5);
    current.target.lerp(focusVec.current, 0.08);
    current.object.position.lerp(desired.current, 0.08);
    current.update();
  });

  return (
    <OrbitControls
      ref={controls}
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      minDistance={2.6}
      maxDistance={50}
      minPolarAngle={Math.PI / 12}
      maxPolarAngle={Math.PI / 1.8}
      autoRotate={false}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.8}
      panSpeed={0.8}
      zoomSpeed={1.2}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.ROTATE,
        RIGHT: THREE.MOUSE.PAN,
      }}
      onStart={() => releaseRef.current()}
    />
  );
};
