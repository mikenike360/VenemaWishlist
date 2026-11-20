import {
  FLOOR_Y,
  PILE_BOX_W,
  pilePlacement,
  pileRiders,
} from '../../lib/profiles';
import { TREE_CENTER_X, TREE_CENTER_Z } from '../../lib/roomLayout';

export interface PilePose {
  x: number;
  y: number;
  z: number;
}

const LIFT = 0.1;
/** Extra lift when a stacked gift is revealed so it clears parked riders. */
const LIFT_BURIED = 0.22;
/** How far riders hop sideways (along the pile arc) — not into the room. */
const RIDER_PARK = PILE_BOX_W * 0.95;

let pileCount = 0;
let hoverIndex: number | null = null;
let searchIndex: number | null = null;
const targets: PilePose[] = [];

function restingPose(index: number): PilePose {
  const [x, y, z] = pilePlacement(index, pileCount).position;
  return { x, y, z };
}

function recomputeTargets() {
  for (let i = 0; i < pileCount; i++) {
    targets[i] = restingPose(i);
  }

  const active = hoverIndex ?? searchIndex;
  if (active == null || active < 0 || active >= pileCount) return;

  const riders = pileRiders(active, pileCount);
  const rest = restingPose(active);

  if (riders.length > 0) {
    // Keep the hovered gift in place — radial slide was pushing boxes into the
    // train / nook. Park riders beside the stack along the pile tangent.
    targets[active] = { x: rest.x, y: rest.y + LIFT_BURIED, z: rest.z };
    const dx = rest.x - TREE_CENTER_X;
    const dz = rest.z - TREE_CENTER_Z;
    const len = Math.hypot(dx, dz) || 1;
    const tx = -dz / len;
    const tz = dx / len;
    riders.forEach((rider, order) => {
      const side = order % 2 === 0 ? 1 : -1;
      const step = RIDER_PARK * (1 + Math.floor(order / 2) * 0.35);
      targets[rider] = {
        x: rest.x + tx * side * step,
        y: FLOOR_Y,
        z: rest.z + tz * side * step,
      };
    });
    return;
  }

  targets[active] = { x: rest.x, y: rest.y + LIFT, z: rest.z };
}

/** Ensure targets exist for the current people count. */
export function ensurePileMotion(count: number) {
  if (count === pileCount && targets.length === count) return;
  pileCount = count;
  targets.length = count;
  if (hoverIndex != null && hoverIndex >= count) hoverIndex = null;
  if (searchIndex != null && searchIndex >= count) searchIndex = null;
  recomputeTargets();
}

export function setPileHoverIndex(index: number | null) {
  if (hoverIndex === index) return;
  hoverIndex = index;
  recomputeTargets();
}

/** Clear hover only if this gift still owns it (avoids out/over races between neighbors). */
export function clearPileHoverIndex(index: number) {
  if (hoverIndex !== index) return;
  hoverIndex = null;
  recomputeTargets();
}

export function setPileSearchIndex(index: number | null) {
  if (searchIndex === index) return;
  searchIndex = index;
  recomputeTargets();
}

export function getPileTarget(index: number): PilePose {
  return targets[index] ?? restingPose(index);
}
