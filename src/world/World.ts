import { AmbientLight, Group,Vector3 } from "three";
import Chunk from "@/world/Chunk";
import { getDefaultWorldConfig } from "@/config";
import { WorldConfig } from "@/types/Config";
import Clock from "@/helpers/Clock";
import SunLight from "@/world/lights/SunLight";
import MoonLight from "@/world/lights/MoonLight";
import AstralLight from "@/world/lights/AstralLight";

/**
 * Represents the game world, manages chunks, terrain, lighting and scene elements.
 * @extends {Group} For easier rendering.
 */
class World extends Group {
    /** Clock to handle time related operations. */
    clock: Clock;

    /** Object containing all data required for configuration. */
    config: WorldConfig;

    /** Unique seed used for terrain procedural generation. */
    seed: number;

    moonLight: MoonLight | null = null;

    sunLight: SunLight | null = null;

    #bufferedChunks: Map<string, Chunk> = new Map();

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
        this.clock = new Clock(this.config.dayDurationInSeconds);
    }

    /**
     * Generates the world by creating and adding chunks within a render radius.
     * 
     * - Generates chunks within `renderRadius + 1` because chunks will need access to outer chunk data for occlusion rendering.
     * - Saves chunks in a Map for further access.
     * - Adds lighting.
     * - Chunks are added to the scene even when empty.
     */
    generate() {
        this.dispose();

        const renderRadius = this.config.size.renderRadius + 1;

        for (let x = -renderRadius; x <= renderRadius; x++) {
            for (let z = -renderRadius; z <= renderRadius; z++) {
                const chunkKey = `${x},${z}`;
                const chunk = this.#generateChunk(x, z);
                this.#bufferedChunks.set(chunkKey, chunk);
                this.add(chunk);
                chunk.visible = false;
            }
        }
        
        this.addLighting();

        this.updateChunksRendering();
    }

    /**
     * Retrieves a block to land on to based on world {x, z} coordinates.
     * 
     * @param worldX - World x-coordinate.
     * @param worldZ - World z-coordinate.
     * @returns A `Vector3` free position.
     */
    findSPawnPosition(worldX: number, worldZ: number): Vector3 {
        const chunk = this.#getOrCreateChunk(worldX, worldZ);
        const { localX, localZ } = this.#getLocalPosition(worldX, worldZ);

        const hightestY = chunk.findHighestEmptyBlock(localX, localZ);

        return new Vector3(worldX, hightestY, worldZ);
    }

    /**
     * Transform world coordinates into local chunk coordinates.
     * 
     * @param worldX - World x-coordinate.
     * @param worldZ - World z-coordinate.
     * @returns Local coordinates within a chunk.
     */
    #getLocalPosition(worldX: number, worldZ: number): { localX: number, localZ: number } {
        return { 
            localX: worldX % this.config.size.chunkWidth,
            localZ: worldZ % this.config.size.chunkWidth,
        };
    }

    /**
     * Retrieves an existing chunk by its position or generates a new one if missing.
     * 
     * @param worldX - World x-coordinate.
     * @param worldZ - World z-coordinate.
     */
    #getOrCreateChunk(worldX: number, worldZ: number): Chunk {
        const chunkX = Math.floor(worldX / this.config.size.chunkWidth);
        const chunkZ = Math.floor(worldZ / this.config.size.chunkWidth);

        const chunkKey = `${chunkX},${chunkZ}`;
        let chunk = this.#bufferedChunks.get(chunkKey);

        if (!chunk) {
            chunk = this.#generateChunk(chunkX, chunkZ);
            this.#bufferedChunks.set(chunkKey, chunk);
        }

        return chunk;
    }

    /**
     * Renders all chunks within `renderRadius` distance.
     */
    updateChunksRendering() {
        const renderRadius = this.config.size.renderRadius;

        for (let x = -renderRadius; x <= renderRadius; x++) {
            for (let z = -renderRadius; z <= renderRadius; z++) {
                const chunkKey = `${x},${z}`;
                const chunk = this.#bufferedChunks.get(chunkKey);

                if (chunk) {
                    chunk.visible = true;
                    chunk.render();
                }

                this.#generateChunk(x, z);
            }
        }
    }

    /**
     * Setups lighting on the scene.
     * 
     * - Creates indirect lighting, making everything uniformly lit.
     * - Creates sunlight coming from a specific direction.
     */
    addLighting() {
        this.#setupAmbientLight();
        this.#setupSunLight(false);
        this.#setupMoonLight(false);
    }

    /**
     * Generate a chunk at given world grid coordinates.
     * 
     * @param x - The worldGrid-coordinate of the chunk.
     * @param z - The worldGrid-coordinate of the chunk.
     * @returns A chunk object.
     */
    #generateChunk(x: number, z: number): Chunk {
        const chunk = new Chunk(this.seed, this.config);
        chunk.position.set(x * this.config.size.chunkWidth, 0, z * this.config.size.chunkWidth);
        chunk.generate();

        return chunk;
    }

    /**
     * Sets up the ambient light in the scene.
     * 
     * - Provides uniform lighting on the entire scene.
     */
    #setupAmbientLight() {
        const ambientLight = new AmbientLight(this.config.light.ambientLight.color, this.config.light.ambientLight.intensity);
        this.add(ambientLight);
    }

    /**
     * Sets up the directional sun light in the scene.
     *
     * - Simulates sunlight casting shadows and providing stronger than ambient directional lighting.
     * 
     * @param helper - Boolean flag to trigger shadow camera's frustum.
     */
    #setupSunLight(helper: boolean) {
        this.sunLight = new SunLight(
            this.clock,
            this.config.light.sunLight,
            new Vector3(0, 0, 0),
            helper
        );
        this.add(this.sunLight);
    }

    /**
     * Sets up the directional moon light in the scene.
     *
     * - Simulates moonlight casting shadows and providing stronger than ambient directional lighting.
     * 
     * @param helper - Boolean flag to trigger shadow camera's frustum.
     */
    #setupMoonLight(helper: boolean) {
        this.moonLight = new MoonLight(
            this.clock,
            this.config.light.moonLight,
            new Vector3(0, 0, 0),
            helper
        );
        this.add(this.moonLight);
    }

    /**
     * Disposes of and removes all chunks within the world.
     * It iterates through the world's children and dispose of any `Chunk` instance.
     * It also removes lights and reinitializes `sunLight`.
     */
    dispose() {
        this.#bufferedChunks.forEach((chunk) => {
            chunk.dispose();
            this.remove(chunk);
        });
        this.#bufferedChunks.clear();

        this.children.forEach((child) => {
            if (child instanceof AstralLight || child instanceof AmbientLight) {
                child.dispose();
                this.remove(child);
            }
        })

        this.moonLight = null;
        this.sunLight = null;
    }
}

export default World;
