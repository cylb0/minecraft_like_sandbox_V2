import { AmbientLight, ColorRepresentation, DirectionalLight, Group, Vector3 } from "three";
import Chunk from "./Chunk";
import { getDefaultWorldConfig } from "@/config";
import { WorldConfig } from "@/types/Config";

/**
 * Represents the game world, manages chunks, terrain, lighting and scene elements.
 * @extends {Group} For easier rendering.
 */
class World extends Group {
    /** Unique seed used for terrain procedural generation. */
    seed: number;

    /** Object containing all data required for configuration. */
    config: WorldConfig;

    /**
     * Creates a new World instance.
     *
     * @param seed - The seed use for generation.
     * @param config - The `WorldConfig` object containing all data related to generation.
     */
    constructor(seed: number, config: WorldConfig = getDefaultWorldConfig()) {
        super();
        this.seed = seed;
        this.config = config;
    }

    /**
     * Generates the world by creating and adding chunks within a render radius.
     */
    generate() {
        this.dispose();
        for (let x = -this.config.size.renderRadius; x <= this.config.size.renderRadius; x++) {
            for (let z = -this.config.size.renderRadius; z <= this.config.size.renderRadius; z++) {
                this.#generateChunk(x, z, this.seed);
            }
        }
    }

    /**
     * Disposes of and removes all chunks within the world.
     * It iterates through the world's children and dispose of any `Chunk` instance.
     */
    dispose() {
        for (let i = this.children.length - 1; i >= 0; i--) {
            const child = this.children[i];
            if (child instanceof Chunk) {
                child.dispose();
                this.remove(child);
            }
        }
    }

    /**
     * Generate a chunk at given world grid coordinates.
     * 
     * @param x - The worldGrid-coordinate of the chunk.
     * @param z - The worldGrid-coordinate of the chunk.
     * @param seed - The seed used for chunk generation.
     */
    #generateChunk(x: number, z: number, seed: number) {
        const chunk = new Chunk(seed, this.config);
        chunk.position.set(x * this.config.size.chunkWidth, 0, z * this.config.size.chunkWidth);
        chunk.generate();
        this.add(chunk);
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
        position = new Vector3(0, this.config.size.chunkDepth * 2, 0),
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
