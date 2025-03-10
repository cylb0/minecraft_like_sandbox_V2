import { BLOCK_SIZE } from "@/constants/block";
import { CHUNK_DIMENSIONS, WORLD_SIZE } from "@/constants/world";
import { AmbientLight, BoxGeometry, ColorRepresentation, DirectionalLight, Group, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three";

const geometry = new BoxGeometry(BLOCK_SIZE);
const material = new MeshLambertMaterial({ color: 0x00ff00 });

/**
 * Represents the game world, manages chunks, terrain, lighting and scene elements.
 */
class World extends Group {
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
        super();
        this.#scene = scene;
        this.#seed = seed;
    }

    generateBasicWorld() {
        const halfWorldSize = WORLD_SIZE * CHUNK_DIMENSIONS.size / 2;
        for (let x = -halfWorldSize; x < halfWorldSize; x++) {
            for (let y = 0; y < CHUNK_DIMENSIONS.depth; y++) {
                for (let z = -halfWorldSize; z < halfWorldSize; z++) {
                    const block = new Mesh(geometry, material);
                    block.position.set(x, y, z);
                    this.add(block);
                }
            }
        } 
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
        this.add(ambientLight);

        const sunLight = new DirectionalLight(color, intensity);
        sunLight.position.copy(position);
        sunLight.castShadow = shadow;
        this.add(sunLight);
    }
}

export default World;
