import { AmbientLight, Group,Vector3 } from "three";
import Chunk from "@/world/Chunk";
import { getDefaultWorldConfig } from "@/config";
import { WorldConfig } from "@/types/Config";
import Clock from "@/helpers/Clock";
import SunLight from "@/world/lights/SunLight";
import MoonLight from "@/world/lights/MoonLight";
import AstralLight from "@/world/lights/AstralLight";
import { Block } from "@/types/Blocks";
import CoordsHelper from "@/helpers/CoordsHelper";

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

    #previousPlayerChunkPosition = '';

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
     * Updates the world.
     * 
     * It performs different actions.
     * - Determines the player's current chunk based on its position.
     * - If player has moved to a new chunk since last update it:
     * Buffers nearby chunks and updates rendering (loading / unloading chunks to the scene).
     * Updates the `#previousPlayerChunkPosition` to the current chunk.
     * - Updates the astral lights.
     * 
     * @param playerPosition - The player's current position.
     */
    update(playerPosition: Vector3): void {
        const { xIndex, zIndex } = CoordsHelper.worldToChunkCoords(playerPosition.x, playerPosition.z, this.config.size.chunkWidth);

        const chunkKey = `${xIndex},${zIndex}`;

        if (chunkKey !== this.#previousPlayerChunkPosition) {
            this.#bufferedChunks = this.#getNearbyChunks(playerPosition);
            this.updateChunksRendering();
            this.#previousPlayerChunkPosition = chunkKey
        }

        this.sunLight?.update(playerPosition);
        this.moonLight?.update(playerPosition);
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

    /**
     * Generates the world.
     * 
     * - Dispose of previous world if needed.
     * - Adds lighting.
     */
    generate() {
        this.dispose();

        this.addLighting();
    }

    /**
     * Determines all chunks around player's current position within a given radius.
     * 
     * - It retrieves chunks if they're already buffered and creates them otherwise.
     * - It then updates `this.#bufferedChunks` with newly added chunks.
     * 
     * @param playerPosition - The position to retrieve chunks around.
     */
    #getNearbyChunks(playerPosition: Vector3): Map<string, Chunk> {
        const { xIndex, zIndex } = CoordsHelper.worldToChunkCoords(playerPosition.x, playerPosition.z, this.config.size.chunkWidth);
        const renderRadius = this.config.size.renderRadius;

        const nearbyChunks = new Map<string, Chunk>();
        for (let x = xIndex - renderRadius; x <= xIndex + renderRadius; x++) {
            for (let z = zIndex - renderRadius; z <= zIndex + renderRadius; z++) {
                const chunkKey = `${x},${z}`;
                const chunk = this.#getOrCreateChunk(x, z);
                nearbyChunks.set(chunkKey, chunk);
            }
        }

        return nearbyChunks;
    }

    /**
     * Retrieves a Block from its world coordinates.
     * 
     * - Find the coordinates of the chunk this block belongs to.
     * - Retrieves the chunk or generate it if needed.
     * - Returns the correct block within this chunk.
     * 
     * @param worldX - World x-coordinate.
     * @param worldY - World y-coordinate.
     * @param worldZ - World z-coordinate.
     * @returns 
     */
    getBlock(worldX: number, worldY: number, worldZ: number): Block | null {
        const { xIndex, zIndex } = CoordsHelper.worldToChunkCoords(worldX, worldZ, this.config.size.chunkWidth);

        const chunkKey = `${xIndex},${zIndex}`;
        let chunk = this.#bufferedChunks.get(chunkKey);

        if (!chunk) {
            chunk = this.#generateChunk(xIndex, zIndex);
            this.#bufferedChunks.set(chunkKey, chunk);
        }

        const { x: localX, y: localY, z: localZ } = CoordsHelper.worldToLocalCoords(worldX, worldY, worldZ, this.config.size.chunkWidth);

        return chunk.getBlock(localX, localY, localZ);
    }

    /**
     * Retrieves a block to land on to based on world {x, z} coordinates.
     * 
     * @param worldX - World x-coordinate.
     * @param worldZ - World z-coordinate.
     * @returns A `Vector3` free position.
     */
    findSpawnPosition(worldX: number, worldZ: number): Vector3 {
        const { xIndex, zIndex } = CoordsHelper.worldToChunkCoords(worldX, worldZ, this.config.size.chunkWidth);

        const chunk = this.#getOrCreateChunk(xIndex, zIndex);

        const { x, y, z} = CoordsHelper.worldToLocalCoords(worldX, 0, worldZ, this.config.size.chunkWidth);

        const hightestY = chunk.findHighestEmptyBlock(x, y);

        return new Vector3(worldX, hightestY, worldZ);
    }

    /**
     * Removes a block from the world.
     * 
     * - Retrieve corresponding chunk.
     * - Compute world coordinates to local coordinates.
     * - Calls `Chunk.removeBlock()`.
     * 
     * @param worldX - World x-coordinate.
     * @param worldY - World y-coordinate.
     * @param worldZ - World z-coordinate.
     */
    removeBlock(worldX: number, worldY: number, worldZ: number): void {
        const { xIndex, zIndex } = CoordsHelper.worldToChunkCoords(worldX, worldZ, this.config.size.chunkWidth);
        const chunk = this.#getOrCreateChunk(xIndex, zIndex);
        const { x, y, z } = CoordsHelper.worldToLocalCoords(worldX, worldY, worldZ, this.config.size.chunkWidth);

        return chunk.removeBlock(x, y, z);
    }

    /**
     * Renders all chunks within `renderRadius` distance.
     * 
     * - It traverses `this.#bufferedChunks` to render chunks that are not yet in the scene.
     * - It then moves through `this.children` and retrieves all chunks that no longer need to be rendered.
     * - It removes those chunks and disposes of their resources.
     */
    updateChunksRendering(): void {
        this.#bufferedChunks.forEach((chunk, chunkKey) => {
            if (!this.children.includes(chunk)) {
                this.add(chunk);
                chunk.render();
            }
        });

        const chunksToRemove: Array<Chunk> = [];

        this.children.forEach((child) => {
            if (child instanceof Chunk) {
                const { xIndex, zIndex } = CoordsHelper.worldToChunkCoords(child.position.x, child.position.z, this.config.size.chunkWidth);
                const chunkKey = `${xIndex},${zIndex}`;

                if (!this.#bufferedChunks.has(chunkKey)) {
                    chunksToRemove.push(child)
                }
            }
        })

        chunksToRemove.forEach((chunk) => {
            this.remove(chunk);
            chunk.dispose();
        })
    }

    /**
     * Retrieves an existing chunk by its position or generates a new one if missing.
     * 
     * @param xIndex - x-index of the chunk in world grid.
     * @param zIndex - z-index of the chunk in world grid.
     */
    #getOrCreateChunk(xIndex: number, zIndex: number): Chunk {
        const chunkKey = `${xIndex},${zIndex}`;
        let chunk = this.#bufferedChunks.get(chunkKey);

        if (!chunk) {
            chunk = this.#generateChunk(xIndex, zIndex);
            this.#bufferedChunks.set(chunkKey, chunk);
        }
        return chunk;
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
            // new Vector3(0, 0, 0),
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
            // new Vector3(0, 0, 0),
            helper
        );
        this.add(this.moonLight);
    }
}

export default World;
