import Scene from "@/core/scene/GameScene";

/**
 * Represents the game world, manages chunks, terrain, lighting and scene elements.
 */
class World {
    /** The `THREE.Scene` scene where the world is rendered. */
    #scene: Scene;

    /** Unique seed used for terrain procedural generation. */
    #seed: number;

    /**
     * Creates a new world instance.
     *
     * @param scene - The `THREE.Scene` where world object will be added.
     * @param seed - Unique seed used for noise generation.
     */
    constructor(scene: Scene, seed: number) {
        this.#scene = scene;
        this.#seed = seed;
    }
}

export default World;
