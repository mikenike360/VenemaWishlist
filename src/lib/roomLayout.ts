/** Shared living-room layout anchors — keep tree, rug, gifts, and camera in sync. */

/** Back-right corner: by the window and fireplace wall. */
export const TREE_POSITION: [number, number, number] = [2.4, 0, -2.5];

export const TREE_CENTER_X = TREE_POSITION[0];
export const TREE_CENTER_Z = TREE_POSITION[2];

/** Look-at height — gift pile / lower trunk, not mid-canopy. */
export const TREE_LOOK_Y = 0.45;

/** Default camera: low floor view, swung toward the fireplace (left of tree). */
export const DEFAULT_CAMERA_POSITION: [number, number, number] = [3.2, 0.92, 0.55];
