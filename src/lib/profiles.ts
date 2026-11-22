import { Profile, User } from '../types';
import { TREE_CENTER_X, TREE_CENTER_Z } from './roomLayout';
import michaelImage from '../assets/images/michael.jpg';
import amandaImage from '../assets/images/amanda.jpg';
import joeyImage from '../assets/images/joey.jpg';
import aliyaImage from '../assets/images/aliya.jpg';
import eliImage from '../assets/images/eli.jpg';
import ellaImage from '../assets/images/ella.jpg';
import micahImage from '../assets/images/micah.jpg';
import carrieImage from '../assets/images/carrie.jpg';
import rockImage from '../assets/images/rock.jpg';
import kaylaImage from '../assets/images/kayla.jpg';
import mattImage from '../assets/images/matt.jpg';
import sonnyImage from '../assets/images/sonny.jpg';
import barbImage from '../assets/images/barb.jpg';
import mikeImage from '../assets/images/mike.jpg';
import ashleyImage from '../assets/images/ashley.jpg';
import brittanyImage from '../assets/images/brittany.jpg';
import wendyImage from '../assets/images/wendy.jpg';
import karlImage from '../assets/images/karl.jpg';
import marilynImage from '../assets/images/marilyn.jpg';
import bobImage from '../assets/images/bob.jpg';
import nickImage from '../assets/images/nick.jpg';
import nateImage from '../assets/images/nate.jpg';
import chadImage from '../assets/images/chad.jpg';
import johnImage from '../assets/images/john.jpg';
import roenImage from '../assets/images/roen.jpg';
import nolleImage from '../assets/images/nolle.jpg';
import toshImage from '../assets/images/tosh.jpg';
import morganImage from '../assets/images/morgan.jpg';

const fallbackImages: Record<string, string> = {
  Michael: michaelImage,
  Amanda: amandaImage,
  Joey: joeyImage,
  Aliya: aliyaImage,
  Elijah: eliImage,
  Ella: ellaImage,
  Micah: micahImage,
  Carrie: carrieImage,
  Rock: rockImage,
  Kayla: kaylaImage,
  Matt: mattImage,
  Sonny: sonnyImage,
  Barbara: barbImage,
  Mike: mikeImage,
  Ashley: ashleyImage,
  Brittany: brittanyImage,
  Wendy: wendyImage,
  Karl: karlImage,
  Marilyn: marilynImage,
  Bob: bobImage,
  Nick: nickImage,
  Nathaniel: nateImage,
  Chad: chadImage,
  John: johnImage,
  Roen: roenImage,
  Noli: nolleImage,
  Tosh: toshImage,
  Morgan: morganImage,
};

export interface PresentPerson extends User {
  id: string;
}

export const profileToUser = (profile: Profile): User => ({
  name: profile.name,
  image: profile.image_url || fallbackImages[profile.name] || '',
  wishlistLink: profile.wishlist_link || 'https://www.amazon.com/',
});

export const profileToPresent = (profile: Profile): PresentPerson => ({
  id: profile.id,
  ...profileToUser(profile),
});

/** Keep in sync with PersonPresent PRESENT_SCALE */
const PILE_SCALE = 0.29;
const BOX_W = 0.7 * PILE_SCALE;
const BOX_H = 0.5 * PILE_SCALE;
/** Approx gift top including bow — must stay under FitModel canopy clip. */
const GIFT_TOP = 0.58 * PILE_SCALE;
/** Rug top (cylinder center 0.025, height 0.05). */
export const FLOOR_Y = 0.05;
/** Half-ish box width — used when sliding a buried gift out of a stack. */
export const PILE_BOX_W = BOX_W;
/** Just outside the carved skirt — nest inside the canopy cavity. */
/** Outside the trunk train loop (r≈0.38) so boxes don’t sit on the rails. */
const TREE_KEEP_OUT = 0.58;
/** Outer edge for initial placement. */
const PILE_MAX_R = 1.35;
/** Horseshoe opens into the room (away from the back-right walls). */
const OPEN_YAW = Math.atan2(-TREE_CENTER_X, -TREE_CENTER_Z);
const OPEN_COS = Math.cos(OPEN_YAW);
const OPEN_SIN = Math.sin(OPEN_YAW);
/** Radial step between rings — leave a clear gap between boxes. */
const RING_STEP = BOX_W * 1.8;
/** Bump when pile math changes so HMR cannot reuse a stale cache. */
const PILE_LAYOUT_REV = 32;
/** Minimum center distance between floor gifts (boxes are BOX_W square). */
const FLOOR_MIN_GAP = BOX_W * 2.15;
/**
 * Open-local horseshoe: starts on the window flank (still tag-readable) and
 * wraps into the back-right corner behind the trunk from the default view.
 */
const PILE_ARC_START = Math.PI * 0.75;
const PILE_ARC_SPAN = Math.PI * 1.05;

function hash01(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Local (lx, lz) with +lz toward the open room, mapped into world XZ. */
function worldFromOpen(lx: number, lz: number): [number, number] {
  return [
    TREE_CENTER_X + lx * OPEN_COS + lz * OPEN_SIN,
    TREE_CENTER_Z - lx * OPEN_SIN + lz * OPEN_COS,
  ];
}

/** Push a point outward if it sits inside the tree keep-out cylinder. */
function clearOfTree(x: number, z: number): [number, number] {
  const dx = x - TREE_CENTER_X;
  const dz = z - TREE_CENTER_Z;
  const dist = Math.hypot(dx, dz);
  if (dist >= TREE_KEEP_OUT) return [x, z];
  const scale = TREE_KEEP_OUT / Math.max(dist, 1e-4);
  return [TREE_CENTER_X + dx * scale, TREE_CENTER_Z + dz * scale];
}

export interface PilePlacement {
  position: [number, number, number];
  yaw: number;
  /** Index of the gift this one rests on, if any. */
  supportIndex: number | null;
}

type Occupied = { x: number; z: number; top: number; stack: number; index: number };

/** Push floor gifts apart so boxes are not visually fused. */
function separateFloorGifts(placements: PilePlacement[], occupied: Occupied[]) {
  for (let pass = 0; pass < 10; pass++) {
    let moved = false;
    for (let a = 0; a < occupied.length; a++) {
      for (let b = a + 1; b < occupied.length; b++) {
        const dx = occupied[b].x - occupied[a].x;
        const dz = occupied[b].z - occupied[a].z;
        const dist = Math.hypot(dx, dz);
        if (dist >= FLOOR_MIN_GAP || dist < 1e-5) continue;
        const push = ((FLOOR_MIN_GAP - dist) / dist) * 0.5;
        occupied[a].x -= dx * push;
        occupied[a].z -= dz * push;
        occupied[b].x += dx * push;
        occupied[b].z += dz * push;
        moved = true;
      }
    }
    for (const box of occupied) {
      // Keep clear of the trunk. Soft outer bound only — a hard max-R clamp
      // would collapse separation back onto a dense ring.
      let [x, z] = clearOfTree(box.x, box.z);
      const dx = x - TREE_CENTER_X;
      const dz = z - TREE_CENTER_Z;
      const dist = Math.hypot(dx, dz);
      const softMax = PILE_MAX_R + 0.22;
      if (dist > softMax) {
        const s = softMax / dist;
        x = TREE_CENTER_X + dx * s;
        z = TREE_CENTER_Z + dz * s;
      }
      box.x = x;
      box.z = z;
      const placement = placements[box.index];
      placement.position[0] = box.x;
      placement.position[2] = box.z;
    }
    if (!moved) break;
  }
}

/** Build a spaced under-tree heap inside the carved canopy cavity. */
function buildPile(count: number): PilePlacement[] {
  const placements: PilePlacement[] = [];
  const occupied: Occupied[] = [];
  // Prefer a single spaced layer; only overflow stacks when needed.
  const floorCount = Math.min(count, Math.max(14, Math.ceil(count * 0.82)));
  const ringCount = 3;
  const stackMinR = TREE_KEEP_OUT + RING_STEP * 0.55;

  for (let i = 0; i < floorCount; i++) {
    const h1 = hash01(i + 1 + PILE_LAYOUT_REV);
    const h2 = hash01(i + 17 + PILE_LAYOUT_REV);
    const yaw = (h1 - 0.5) * Math.PI * 0.28;
    const ring = i % ringCount;
    const onRing = Math.floor(i / ringCount);
    const ringSlots = Math.max(Math.ceil(floorCount / ringCount), 1);
    const t = ringSlots <= 1 ? 0.5 : onRing / Math.max(ringSlots - 1, 1);
    // Stagger rings so they are not stacked on the same angles.
    const ringNudge = (ring / ringCount) * (1 / Math.max(ringSlots, 1));
    const angle =
      PILE_ARC_START + (t + ringNudge) * PILE_ARC_SPAN + (h2 - 0.5) * 0.05;
    const radius = Math.min(
      TREE_KEEP_OUT + 0.08 + ring * RING_STEP + h1 * 0.05,
      PILE_MAX_R,
    );
    let [x, z] = worldFromOpen(Math.sin(angle) * radius, Math.cos(angle) * radius);
    [x, z] = clearOfTree(x, z);
    const index = placements.length;
    placements.push({ position: [x, FLOOR_Y, z], yaw, supportIndex: null });
    occupied.push({ x, z, top: FLOOR_Y + BOX_H, stack: 0, index });
  }

  separateFloorGifts(placements, occupied);

  for (let i = floorCount; i < count; i++) {
    const h1 = hash01(i + 1 + PILE_LAYOUT_REV);
    const h2 = hash01(i + 17 + PILE_LAYOUT_REV);
    const h3 = hash01(i + 41 + PILE_LAYOUT_REV);
    const yaw = (h1 - 0.5) * Math.PI * 0.28;

    let x: number;
    let z: number;
    let y: number;

    // One stack max, outer ring only — bows stay under carve floorY (~0.48).
    const candidates = occupied.filter((box) => {
      if (box.stack >= 1) return false;
      const dist = Math.hypot(box.x - TREE_CENTER_X, box.z - TREE_CENTER_Z);
      return dist >= stackMinR && box.top + GIFT_TOP < 0.46;
    });
    if (candidates.length === 0) {
      const t = 0.2 + h2 * 0.6;
      const angle = PILE_ARC_START + t * PILE_ARC_SPAN;
      const radius = Math.min(TREE_KEEP_OUT + RING_STEP * (0.55 + h1 * 0.35), PILE_MAX_R);
      [x, z] = worldFromOpen(Math.sin(angle) * radius, Math.cos(angle) * radius);
      [x, z] = clearOfTree(x, z);
      y = FLOOR_Y;
      const index = placements.length;
      placements.push({ position: [x, y, z], yaw, supportIndex: null });
      occupied.push({ x, z, top: y + BOX_H, stack: 0, index });
      continue;
    }
    const pick = Math.floor(h2 * candidates.length) % candidates.length;
    const support = candidates[pick];

    x = support.x + (h1 - 0.5) * BOX_W * 0.15;
    z = support.z + (h3 - 0.5) * BOX_W * 0.15;
    [x, z] = clearOfTree(x, z);
    y = support.top - 0.012;
    const top = y + BOX_H;

    support.top = top;
    support.stack += 1;

    const index = placements.length;
    placements.push({ position: [x, y, z], yaw, supportIndex: support.index });
    occupied.push({ x, z, top, stack: support.stack, index });
  }

  return placements;
}

let pileCacheCount = -1;
let pileCacheRev = -1;
let pileCache: PilePlacement[] = [];
let ridersCache: number[][] = [];

function rebuildPileCache(count: number) {
  pileCache = buildPile(count);
  pileCacheCount = count;
  pileCacheRev = PILE_LAYOUT_REV;
  ridersCache = pileCache.map(() => []);
  pileCache.forEach((placement, index) => {
    if (placement.supportIndex == null) return;
    ridersCache[placement.supportIndex]?.push(index);
  });
}

/** Deterministic under-tree gift heap (stable across reloads). */
export function pilePlacement(index: number, count: number): PilePlacement {
  if (count !== pileCacheCount || pileCacheRev !== PILE_LAYOUT_REV) {
    rebuildPileCache(count);
  }
  return (
    pileCache[index] ?? {
      position: [TREE_CENTER_X, FLOOR_Y, TREE_CENTER_Z],
      yaw: 0,
      supportIndex: null,
    }
  );
}

export function pilePosition(index: number, count: number): [number, number, number] {
  return pilePlacement(index, count).position;
}

/** Gift indices resting directly on top of `index`. */
export function pileRiders(index: number, count: number): number[] {
  pilePlacement(0, count);
  return ridersCache[index] ?? [];
}
