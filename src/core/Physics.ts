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

}

export default Physics;
