import { Vector3 } from "three";

/**
 * Computes the new position of a point rotation around a given origin in a 2D plane (x, y).
 * 
 * @param origin - The rotation center for the computation.
 * @param radius - The distance of the point to the origin.
 * @param angle - The rotation in radians.
 * @returns The new position of the rotated point as a `THREE.Vector3`.
 */
export function computeOrbitPosition(origin: Vector3, radius: number, angle: number): Vector3 {
    const x = origin.x + radius * Math.cos(angle);
    const y = origin.y + radius * Math.sin(angle);
    const z = origin.z;
    return new Vector3(x, y, z);
}

/**
 * Computes the progress of a given value within a given range.
 * - Clamps progress between 0 and 1.
 * 
 * @param value - The value to test progress of.
 * @param from - The lower boundary of the range.
 * @param to - The upper boundary of the range.
 * @returns The progress of the number within the range [0, 1]. Returns 0 if `from` equals `to`.
 * 
 */
export function computeVariationProgress(value: number, from: number, to: number): number {
    if (from === to) return 0;

    let progress = (value - from) / (to - from);

    if (progress < 0) {
        progress = 0;
    } else if (progress > 1) {
        progress = 1;
    }

    return progress;
}

/**
 * Modulo function that works as intended with negative values.
 */
export function modulo(n: number, size: number): number {
    return ((n % size) + size) % size;
}

/**
 * Returns the mathematical signe of a number, defaults to `1` when value is 0.
 * 
 * - Used for physics calculation as it always return a direction even for aligned centers.
 * 
 * @param n - The number to test sign of.
 * @returns `1` if input is `0`, otherwise `Math.sign(n)`.
 */
export function epsilonSign(n: number): number {
    return (n === 0 ? 1 : Math.sign(n));
}