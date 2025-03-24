import { Box3, Group, Scene, Vector3 } from "three";

class Physics {
    #helpers = new Group();

    constructor(scene: Scene) {
        scene.add(this.#helpers);
    }
    /**
     * Returns a `THREE.Box3` object corresponding the given coordinates.
     * 
     * @param x - The x-position of the block to compute a bounding box for.
     * @param y - The y-position of the block to compute a bounding box for.
     * @param z - The z-position of the block to compute a bounding box for.
     * @returns A Box3 object for the block.
     */
    getBlockBoundingBox(x: number, y: number, z: number): Box3 {
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
    getBlockRange(box: Box3) {
        return {
            minX: Math.floor(box.min.x),
            maxX: Math.ceil(box.max.x),
            minY: Math.floor(box.min.y),
            maxY: Math.ceil(box.max.y),
            minZ: Math.floor(box.min.z),
            maxZ: Math.ceil(box.max.z),
        }
    }
}

export default Physics;
