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