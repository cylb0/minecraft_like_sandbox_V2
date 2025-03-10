export const CAMERA_FOV = 90;
export const CAMERA_NEAR = .01;
export const CAMERA_FAR = 1000;
export const CAMERA_ROTATION_SENSITIVITY = .002;

/**
 * Retrieves the current camera aspect ratio.
 * - Uses `window.innerWidth / window.innerHeight` to compute ratio.
 * - Returns a value for when window is not available.
 * @returns 
 */
export function getCameraAspect(): number {
    if (typeof window !== "undefined") {
        return window.innerWidth / window.innerHeight;
    }
    return 16 / 9;
}