import { DEFAULT_BLOCK_SIZE, getBlocks } from "@/constants/block";
import { BlockType } from "@/types/Blocks";
import Player from "@/units/Player";
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
    return new Box3(
        new Vector3(x, y, z),
        new Vector3(x + DEFAULT_BLOCK_SIZE, y + DEFAULT_BLOCK_SIZE, z + DEFAULT_BLOCK_SIZE)
    );
};

/**
 * Calculates the range of block coordinates around a given object.
 * @param box - An axis-aligned bounding box in world coordinates.
 * @returns An object containing min and max block coordinates on each axis.
 */
export function getCollisionRange(box: Box3) {
    return {
        minX: Math.floor(box.min.x),
        maxX: Math.floor(box.max.x),
        minY: Math.floor(box.min.y - 1),
        maxY: Math.ceil(box.max.y),
        minZ: Math.floor(box.min.z),
        maxZ: Math.floor(box.max.z),
    }
}

/**
 * Sorts collisions based on the smallest overlap axis with the player.
 * - Used to resolve collisions.
 * - Box3 and Vectors are reused for performance.
 * 
 * @param player - The player to overlap with.
 * @param collisions - An array of `Box3` objects representing blocks in space.
 * @returns The sorted array of `Box3`.
 */
export function sortCollisionsByOverlap(player: Player, collisions: Array<Box3>): Array<Box3> {
     const playerBox = player.boundingBox;

     const intersectionA = new Box3();
     const intersectionB = new Box3();

     const sizeA = new Vector3();
     const sizeB = new Vector3();

    return collisions.sort((a, b) => {
        intersectionA.copy(playerBox).intersect(a);
        intersectionB.copy(playerBox).intersect(b);

        intersectionA.getSize(sizeA);
        intersectionB.getSize(sizeB);

        const minA = Math.min(sizeA.x, sizeA.y, sizeA.z);
        const minB = Math.min(sizeB.x, sizeB.y, sizeB.z);

        return minA - minB;
    })
}

/**
 * Finds wether or not a given blockType correspond to a solid (that cannot be passed through) block.
 * 
 * @param blockType - The block type to check.
 * @returns `true` if block is solid, `false` otherwise. Defaults to `true` unless explicitely defined.
 */
export function isBlockSolid(blockType: BlockType): boolean {
    const BLOCKS = getBlocks();
    return BLOCKS[blockType]?.solid ?? true;
}