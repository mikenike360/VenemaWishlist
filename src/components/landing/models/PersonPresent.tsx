import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PresentPerson } from '../../../lib/profiles';
import { clearPileHoverIndex, ensurePileMotion, getPileTarget, setPileHoverIndex } from '../pileMotion';

const giftColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
const ribbonColors = ['#FFD700', '#FF6B9D', '#C44569', '#FFA502', '#FF1493', '#FF69B4'];

function colorIndex(name: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

function makeNameTexture(name: string, highlighted: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 220;
  const context = canvas.getContext('2d');
  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.fillStyle = highlighted ? '#fff6d8' : '#f6efe2';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = highlighted ? '#c9a227' : '#c4b49a';
  context.lineWidth = highlighted ? 14 : 8;
  context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

  context.fillStyle = '#2a1a0c';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  let size = 92;
  const font = (next: number) => `700 ${next}px Georgia, "Palatino Linotype", Palatino, serif`;
  context.font = font(size);
  while (context.measureText(name).width > 460 && size > 32) {
    size -= 4;
    context.font = font(size);
  }
  context.fillText(name, canvas.width / 2, canvas.height / 2 + 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

interface PersonPresentProps {
  person: PresentPerson;
  index: number;
  pileCount: number;
  position: [number, number, number];
  yaw?: number;
  highlighted: boolean;
  dimmed?: boolean;
  onSelect: (person: PresentPerson) => void;
}

/** Keep in sync with PILE_SCALE in profiles.ts */
const PRESENT_SCALE = 0.29;

export const PersonPresent: React.FC<PersonPresentProps> = ({
  person,
  index,
  pileCount,
  position,
  yaw = 0,
  highlighted,
  dimmed = false,
  onSelect,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const giftRef = useRef<THREE.Group>(null);
  const clearTouchHover = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** True when this touch already opened the card — skip the follow-up click. */
  const openedFromTouch = useRef(false);
  const [hovered, setHovered] = useState(false);
  const giftColor = useMemo(() => giftColors[colorIndex(person.name, giftColors.length)], [person.name]);
  const ribbonColor = useMemo(() => ribbonColors[colorIndex(person.name + 'ribbon', ribbonColors.length)], [person.name]);
  const accent = highlighted || hovered;
  const nameTexture = useMemo(
    () => makeNameTexture(person.name, accent),
    [person.name, accent],
  );

  useEffect(() => () => nameTexture.dispose(), [nameTexture]);

  useEffect(
    () => () => {
      if (clearTouchHover.current) clearTimeout(clearTouchHover.current);
    },
    [],
  );

  useEffect(() => {
    ensurePileMotion(pileCount);
    if (rootRef.current) {
      rootRef.current.position.set(position[0], position[1], position[2]);
    }
  }, [pileCount, position]);

  const claimHover = () => {
    if (clearTouchHover.current) {
      clearTimeout(clearTouchHover.current);
      clearTouchHover.current = null;
    }
    setHovered(true);
    setPileHoverIndex(index);
  };

  const releaseHover = (delayMs = 0) => {
    if (clearTouchHover.current) clearTimeout(clearTouchHover.current);
    if (delayMs <= 0) {
      setHovered(false);
      clearPileHoverIndex(index);
      return;
    }
    // Touch has no lasting hover — keep the lift visible briefly after tap.
    clearTouchHover.current = setTimeout(() => {
      setHovered(false);
      clearPileHoverIndex(index);
      clearTouchHover.current = null;
    }, delayMs);
  };

  useFrame(() => {
    ensurePileMotion(pileCount);
    const target = getPileTarget(index);
    if (rootRef.current) {
      rootRef.current.position.x += (target.x - rootRef.current.position.x) * 0.18;
      rootRef.current.position.y += (target.y - rootRef.current.position.y) * 0.18;
      rootRef.current.position.z += (target.z - rootRef.current.position.z) * 0.18;
    }
    if (giftRef.current) {
      const scaleTarget = (accent ? 1.12 : 1) * PRESENT_SCALE;
      const next = giftRef.current.scale.x + (scaleTarget - giftRef.current.scale.x) * 0.15;
      giftRef.current.scale.setScalar(next);
    }
  });

  const openCard = () => {
    claimHover();
    onSelect(person);
    // Keep the peek visible while the card opens, then settle.
    releaseHover(800);
  };

  return (
    <group
      ref={rootRef}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        // Touch already opened on pointerdown — the lift mid-gesture often
        // makes this click miss, which felt like needing a second tap.
        if (openedFromTouch.current) {
          openedFromTouch.current = false;
          return;
        }
        openCard();
      }}
      onPointerDown={(event) => {
        // Only the frontmost hit may claim hover — stops stacked gifts fighting.
        if (event.intersections[0]?.eventObject !== event.eventObject) return;
        event.stopPropagation();
        // R3F stopPropagation does not reach OrbitControls (same canvas listener).
        event.nativeEvent.stopImmediatePropagation();
        claimHover();
        if (event.pointerType === 'mouse') {
          document.body.style.cursor = 'pointer';
          return;
        }
        // Touch/pen: open on press. Waiting for click fails when the gift
        // lifts/scales under the finger before the click raycast.
        openedFromTouch.current = true;
        openCard();
      }}
      onPointerOver={(event) => {
        if (event.pointerType === 'touch' || event.pointerType === 'pen') return;
        if (event.intersections[0]?.eventObject !== event.eventObject) return;
        event.stopPropagation();
        claimHover();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        if (event.pointerType === 'touch' || event.pointerType === 'pen') {
          releaseHover(450);
          return;
        }
        releaseHover(0);
        document.body.style.cursor = 'auto';
      }}
      onPointerUp={(event) => {
        if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
        // Finger lift ends "hover"; delay so riders still animate open.
        releaseHover(450);
      }}
    >
      <group ref={giftRef} rotation={[0, yaw, 0]} scale={PRESENT_SCALE}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.5, 0.7]} />
          <meshStandardMaterial
            color={giftColor}
            emissive={highlighted ? '#FFD700' : hovered ? '#886600' : '#000000'}
            emissiveIntensity={highlighted ? 0.55 : hovered ? 0.2 : 0}
            roughness={0.5}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </mesh>
        <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <boxGeometry args={[0.78, 0.12, 0.06]} />
          <meshStandardMaterial
            color={ribbonColor}
            roughness={0.3}
            metalness={0.1}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </mesh>
        <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} castShadow>
          <boxGeometry args={[0.78, 0.12, 0.06]} />
          <meshStandardMaterial
            color={ribbonColor}
            roughness={0.3}
            metalness={0.1}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </mesh>
        <mesh position={[0, 0.58, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={ribbonColor}
            roughness={0.2}
            metalness={0.2}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </mesh>
        {/* Face nameplate always on — reads as a real gift tag. */}
        <mesh position={[0, 0.26, 0.36]} raycast={() => null}>
          <planeGeometry args={[0.48, 0.22]} />
          <meshBasicMaterial map={nameTexture} toneMapped={false} />
        </mesh>
      </group>

      {(hovered || highlighted) && (
        <Html
          position={[0, 0.55, 0]}
          center
          distanceFactor={6.5}
          zIndexRange={[50, 0]}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div
            style={{
              background: '#fff6d8',
              border: '2px solid #c9a227',
              borderRadius: 6,
              padding: '3px 10px',
              fontFamily: 'Georgia, "Palatino Linotype", Palatino, serif',
              fontSize: 14,
              fontWeight: 700,
              color: '#2a1a0c',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(40, 20, 0, 0.25)',
            }}
          >
            {person.name}
          </div>
        </Html>
      )}
    </group>
  );
};
