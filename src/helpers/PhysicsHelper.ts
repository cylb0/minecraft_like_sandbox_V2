import { DEFAULT_BLOCK_SIZE } from "@/constants/block";
import { Box3, Vector3 } from "three";

/**
 * Returns a `THREE.Box3` object corresponding the given coordinates.
 * 
 * @param x - The x-position of the block to compute a bounding box for.
 * @param y - The y-position of the block to compute a bounding box for.
 * @param z - The z-position of the block to compute a bounding box for.
 * @returns A Box3 object for the block.
 */
export function getBlockBoundingBox(x: number, y: number, z: number): Box3 {
    const halfBlock = DEFAULT_BLOCK_SIZE / 2;
    return new Box3(
        new Vector3(x - halfBlock, y - halfBlock, z - halfBlock),
        new Vector3(x + halfBlock, y + halfBlock, z + halfBlock)
    );
};

/**
 * Calculates the range of block coordinates around a given object.
 * @param box - An axis-aligned bounding box in world coordinates.
 * @returns An object containing min and max block coordinates on each axis.
 */
export function getBlockRange(box: Box3) {
    return {
        minX: Math.floor(box.min.x),
        maxX: Math.ceil(box.max.x),
        minY: Math.floor(box.min.y),
        maxY: Math.ceil(box.max.y),
        minZ: Math.floor(box.min.z),
        maxZ: Math.ceil(box.max.z),
    };
};