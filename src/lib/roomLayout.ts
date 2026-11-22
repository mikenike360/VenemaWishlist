/** Shared living-room layout anchors — keep tree, rug, gifts, and camera in sync. */

/** Back-right corner: by the window and fireplace wall. */
export const TREE_POSITION: [number, number, number] = [2.4, 0, -2.5];

export const TREE_CENTER_X = TREE_POSITION[0];
export const TREE_CENTER_Z = TREE_POSITION[2];

/** Look-at height — gift pile / lower trunk, not mid-canopy. */
export const TREE_LOOK_Y = 0.45;

/** Default camera: slightly wider shot, swung toward the fireplace (left of tree). */
export const DEFAULT_CAMERA_POSITION: [number, number, number] = [3.55, 1.2, 1.35];
export const DEFAULT_CAMERA_FOV = 48;

/**
 * Phone / narrow viewport: pull back and raise so fireplace, tree, gifts,
 * and nook stay in frame together.
 */
export const MOBILE_CAMERA_POSITION: [number, number, number] = [3.9, 1.65, 2.15];
export const MOBILE_CAMERA_FOV = 60;
export const MOBILE_CAMERA_MAX_WIDTH = 768;

export function isMobileCameraViewport(
  width = typeof window !== 'undefined' ? window.innerWidth : 1024,
): boolean {
  return width < MOBILE_CAMERA_MAX_WIDTH;
}

export function homeCameraPosition(width?: number): [number, number, number] {
  return isMobileCameraViewport(width) ? MOBILE_CAMERA_POSITION : DEFAULT_CAMERA_POSITION;
}

export function homeCameraFov(width?: number): number {
  return isMobileCameraViewport(width) ? MOBILE_CAMERA_FOV : DEFAULT_CAMERA_FOV;
}
