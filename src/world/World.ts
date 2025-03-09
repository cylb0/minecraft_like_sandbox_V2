import { CHUNK_DIMENSIONS, WORLD_SIZE } from "@/constants/world";
import { AmbientLight, ColorRepresentation, DirectionalLight, Scene, Vector3 } from "three";

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

    /**
     * Setups lighting on the scene.
     * 
     * - Creates indirect lighting, making everything uniformly lit.
     * - Creates sunlight coming from a specific direction far over origin.
     * - Enables shadows to add realism.
     * 
     * @param options - Configuration object for the lighting.
     * @param options.position - The sunlight's position in `THREE.Scene` (default: `(0, CHUNK_DIMENSIONS.depth * 2, 0)`).
     * @param options.color - The light's color (default: `0xffffff`).
     * @param options.intensity - Tthe light's intensity (default: `1`).
     * @param options.shadow - Wether or not shadows should be enabled (default: `false`).
     */
    public addLighting({
        position = new Vector3(0, CHUNK_DIMENSIONS.depth * 2, 0),
        color = 0xffffff,
        intensity = 1,
        shadow = false,
    }: {
        position?: Vector3;
        color?: ColorRepresentation;
        intensity?: number;
        shadow?: boolean;
    } = {}) {
        const ambientLight  = new AmbientLight(color, intensity)
        this.#scene.add(ambientLight);

        const sunLight = new DirectionalLight(color, intensity);
        sunLight.position.copy(position);
        sunLight.castShadow = shadow;
        this.#scene.add(sunLight);
    }
}

export default World;
