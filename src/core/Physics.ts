import { Box3, Group, Scene, Vector3 } from "three";

class Physics {
    #helpers = new Group();

    constructor(scene: Scene) {
        scene.add(this.#helpers);
    }
    /**
     * Returns a `THREE.Box3` object corresponding the given coordinates.
     * 
     * @param position - The position of the box to compute a bounding box for.
     * @returns A Box3 object for the block.
     */
    getBlockBoundingBox(position: Vector3): Box3 {
        return new Box3().setFromCenterAndSize(position, new Vector3(DEFAULT_BLOCK_SIZE, DEFAULT_BLOCK_SIZE, DEFAULT_BLOCK_SIZE));
    }

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
