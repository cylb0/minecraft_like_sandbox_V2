import { EMPTY_BLOCK, getBlocks, getOres} from "@/constants/block";
import BlockRenderer from "@/helpers/BlockRenderer";
import PseudoRandomGenerator from "@/helpers/PseudoRandomGenerator";
import { Block, BlockData, BlockType, DistributionType } from "@/types/Blocks";
import { WorldConfig } from "@/types/Config";
import { Group, InstancedMesh, Matrix4, Vector3 } from "three";

import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";

/**
 * Represents a chunk in the game world containing a 3D grid of blocks.
 * 
 * - Each chunk has a fixed size (`CHUNK_SIZE x CHUNK_SIZE x WORLD_SIZE.DEPTH`).
 * - The chunk's position is adjusted using `CHUNK_OFFSET` to align with the world coordinates.
 * @extends {Group} For easier rendering and simplified position management.
 */
class Chunk extends Group {
    /**
     * 3D array representing blocks within the chunk on `(x, z, y)` axes.
     *
     * - `(x, z)` axis represent horizontal coordinates while `y` axis is used for depth.
    */
    blocks: Block[][][] = [];

    /** Pseudo random generator based on seed. */
    #rng: PseudoRandomGenerator;

    /** Object containing all data required for configuration. */
    #config: WorldConfig;

    #blockRenderer: BlockRenderer;

    constructor(seed: number, config: WorldConfig) {
        super();
        this.#rng = new PseudoRandomGenerator(seed);
        this.#config = config;
        this.#initChunk();
        this.#blockRenderer = new BlockRenderer(this.#config.size.chunkWidth * this.#config.size.chunkWidth *this.#config.size.chunkDepth);
    }

    /**
     * Initializes the chunk by setting all it's block to empty blocks.
     */
    #initChunk() {
        this.blocks = Array.from({ length: this.#config.size.chunkWidth }, () =>
            Array.from({ length: this.#config.size.chunkDepth }, () =>
                Array.from({ length: this.#config.size.chunkWidth }, () => ({ ...EMPTY_BLOCK }))
            )
        );
    }

    /**
     * Handles all operations needed to generate a Chunk.
     */
    generate() {
        this.#generateBedrock();
        this.#generateOres();
        this.#generateStoneTerrain();
        this.#generateSurface();
        this.#generateWater();
        this.#generateClouds();
    }

    /**
     * Renders a chunk.
    */
    render() {
        this.#generateMeshes();
    }

    /**
     * Removes a block from the chunk. 
     * 
     * - Verifies that coordinates are correct.
     * - Verifies that the block is empty.
     * - Updates the block's type corresponding InstancedMesh to hide the block from the scene. It moves the instance's matrix to a position below the world's lower boundary (y = -1) and decrements the InstancedMesh's count. It also updates chunk's `blocks` setting the block type and coordinates to an `EMPTY_BLOCK`.
     * 
     * @param x - Local x-coordinate.
     * @param y - Local y-coordinate.
     * @param z - Local z-coordinate.
     */
    removeBlock(x: number, y: number, z: number): void {
        if (this.isBlockInBounds(x, y, z)) {
            const block = this.getBlock(x, y, z);
            if (block === null || block.blockType === BlockType.Empty) return;

            const instanceId = block.instanceId;
            const blockType = block.blockType;

            const mesh = this.#blockRenderer.getBlockType(blockType);
            mesh.count--;

            const matrix = new Matrix4();
            matrix.setPosition(0, -1, 0);
            mesh.setMatrixAt(instanceId, matrix);
            mesh.instanceMatrix.needsUpdate = true;

            this.blocks[x][y][z] = EMPTY_BLOCK;
        }
    }


    /**
     * Generates bedrock.
     *
     * - Lower layer of the map is made of special indestructible blocks.
     */
    #generateBedrock() {
        for (let x = 0; x < this.#config.size.chunkWidth; x++) {
            for (let z = 0; z < this.#config.size.chunkWidth; z++) {
                this.setBlockType(x, 0, z, BlockType.Bedrock);
            }
        }
    }

    /**
     * Generates pseudo random clouds at given height.
     * 
     * - Uses simplex noise to create random clouds.
     */
    #generateClouds() {
        const simplex = new SimplexNoise(this.#rng);

        for (let x = 0; x < this.#config.size.chunkWidth; x++) {
            for (let z = 0; z < this.#config.size.chunkWidth; z++) {
                const worldX = this.position.x + x;
                const worldZ = this.position.z + z;

                const level = this.#config.clouds.level;
                const scale = this.#config.clouds.scale;

                const noise = simplex.noise(worldX / scale, worldZ / scale);

                if (noise > .1) {
                    if (this.getBlock(x, level, z)?.blockType === BlockType.Empty) {
                        this.setBlockType(x, level, z, BlockType.Cloud);
                    }
                }
            }
        }
    }

    /**
     * Generates all ores within the chunk.
     *
     * - Iterates through `ORES` and call `generateOre()` on each one of them.
     */
    #generateOres() {
        const simplex = new SimplexNoise(this.#rng);
        const ores = getOres();
        for (const ore in ores) {
            const oreType = Number(ore) as BlockType;
            this.#generateOre(oreType, simplex);
        }
    }

    /**
     * Generates a specific type of ore within the chunk based on its configuration data.
     * 
     * @param oreType - The type of ore to generate.
     * @param simplex - The `THREE.SimplexNoise` instance used for pseudo-random generation.
     */
    #generateOre(oreType: BlockType, simplex: SimplexNoise): void {
        const ores = getOres();
        const oreData = ores[oreType];
        for (const batch of oreData.batches) {
            const distributionType = batch.distribution;
            for (let x = 0; x < this.#config.size.chunkWidth; x++) {
                for (let y = this.#config.terrain.bedrockThickness; y < this.#config.size.chunkDepth; y++) {
                    for (let z = 0; z < this.#config.size.chunkWidth; z++) {
                        const worldX = this.position.x + x;
                        const worldY = this.position.y + y;
                        const worldZ = this.position.z + z;

                        const minHeight = batch.minHeight * this.#config.size.chunkDepth;
                        const maxHeight = batch.maxHeight * this.#config.size.chunkDepth;
                        if (worldY >= minHeight && worldY <= maxHeight) {
                            const noise = simplex.noise3d(worldX / oreData.scale.x, worldY / oreData.scale.y, worldZ / oreData.scale.z);
                            let scaledNoise = noise;

                            if (distributionType === DistributionType.Triangular) {
                                const peakY = this.#config.size.chunkDepth * ((batch.minHeight + batch.maxHeight) / 2);
                                const distanceToPeakY = Math.abs(worldY - peakY);
                                const maxDistance = this.#config.size.chunkDepth * ((batch.maxHeight - batch.minHeight) / 2);
                                const heightFactor = 1 - (distanceToPeakY / maxDistance);
                                
                                scaledNoise = noise * heightFactor;
                            }

                            if (scaledNoise > oreData.rarity) {
                                this.setBlockType(x, y, z, oreType);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Generates the base stone terrain using Simplex noise.
     *
     * - It creates the heightmap based on noise and fills the empty blocks below threshold.
     * - It eliminates flying ore generated by `generateOres()`.
     */
    #generateStoneTerrain() {
        const simplex = new SimplexNoise(this.#rng);
        for (let x = 0; x < this.#config.size.chunkWidth; x++) {
            for (let z = 0; z < this.#config.size.chunkWidth; z++) {
                const worldX = this.position.x + x;
                const worldZ = this.position.z + z;
                
                let noiseValue = simplex.noise(worldX / this.#config.terrain.scale, worldZ / this.#config.terrain.scale);
                const scaledNoise = this.#config.terrain.amplitude * noiseValue + .5;
                
                let height = scaledNoise * this.#config.size.chunkDepth;

                for (let y = this.#config.terrain.bedrockThickness; y < this.#config.size.chunkDepth; y++) {
                    if (y < height) {
                        if (this.getBlock(x, y, z)?.blockType === BlockType.Empty) {
                            this.setBlockType(x, y, z, BlockType.Stone);
                        }
                    } else {
                        this.setBlockType(x, y, z, BlockType.Empty);
                    }
                }
            }
        }
    }

    /**
     * Generates the surface layer of the chunk by replacing 2 top-layers depending on terrain.
     *
     * - Iterates through the chunk, finds the highest non-empty block and replaces surface blocks.
     */
    #generateSurface(): void {
        for (let x = 0; x < this.#config.size.chunkWidth; x++) {
            for (let z = 0; z < this.#config.size.chunkWidth; z++) {
                let highestBlockY = this.findHighestEmptyBlock(x, z);

                // Can only replace 2 blocks over bedrock.
                if (highestBlockY > 2) {
                    if (highestBlockY <= this.#config.water.seaLevel) {
                        this.setBlockType(x, highestBlockY, z, BlockType.Sand);
                        this.setBlockType(x, highestBlockY - 1, z, BlockType.Sand);
                    } else if (highestBlockY === this.#config.water.seaLevel + 1) {
                        this.setBlockType(x, highestBlockY, z, BlockType.Sand);
                        this.setBlockType(x, highestBlockY - 1, z, BlockType.Grass);
                    } else {
                        this.setBlockType(x, highestBlockY - 1, z, BlockType.Dirt);
                        if (highestBlockY < this.#config.terrain.snowLevel) {
                            this.setBlockType(x, highestBlockY, z, BlockType.Grass);
                        } else {
                            this.setBlockType(x, highestBlockY, z, BlockType.Snow);
                        }
                    }
                }
            }
        }
    }

    /**
     * Generates water blocks between highest block height and seaLevel threshold.
     */
    #generateWater(): void {
        for (let x = 0; x < this.#config.size.chunkWidth; x++) {
            for (let z = 0; z < this.#config.size.chunkWidth; z++) {
                let highestBlockY = this.findHighestEmptyBlock(x, z);

                for (let y = highestBlockY; y <= this.#config.water.seaLevel; y++) {
                    this.setBlockType(x, y, z, BlockType.Water);
                }
            }
        }
    }

    /**
     * Retrieves the highest empty block coordinate of a core (chunk section at given `(x, z)`).
     * 
     * @param x x-coordinate of the core.
     * @param z z-coordinate of the core.
     * @returns the y-coordinate of the highest empty block found.
     */
    findHighestEmptyBlock(x: number, z: number): number {
        let highestBlockY = 0;
        for (let y = this.#config.size.chunkDepth - 1; y >= 0; y--) {
            if (this.getBlock(x, y, z)?.blockType !== BlockType.Empty) {
                highestBlockY = y;
                break;
            }
        }
        return highestBlockY;
    }

    /**
     * Generates the instanced meshes for the chunk's blocks.
     * It iterates through all blocks, checks their visibility, and adds them to the appropriate instanced mesh.
     */
    #generateMeshes() {
        this.dispose();

        const maxBlocks = this.#config.size.chunkWidth * this.#config.size.chunkWidth *this.#config.size.chunkDepth;
        const blockRenderer = new BlockRenderer(maxBlocks)

        const matrix = new Matrix4();

        for (let x = 0; x < this.#config.size.chunkWidth; x++) {
            for (let y = 0; y < this.#config.size.chunkDepth; y++) {
                for (let z = 0; z < this.#config.size.chunkWidth; z++) {
                    const block = this.getBlock(x, y, z);
                    if (block === null) continue;

                    const blockType = block.blockType;
                    if (blockType === BlockType.Empty) continue;

                    if (this.isBlockVisible(x, y, z)) {
                        const mesh = blockRenderer.getBlockType(blockType);
                        const instanceId = mesh.count;

                        matrix.setPosition(x, y, z);
                        mesh.setMatrixAt(instanceId, matrix);
                        this.setInstanceId(x, y, z, instanceId);
                        mesh.count++;
                    }
                }
            }
        }

        const meshes = blockRenderer.instancedMeshes;

        this.add(...meshes);
    }

    /**
     * Returns block data for given coordinates.
     * 
     * @param x - x-coordinate within the chunk.
     * @param y - y-coordinate within the chunk.
     * @param z - z-coordinate within the chunk.
     * @returns a `Block` object if found, `null` otherwise.
     */
    getBlock(x: number, y: number, z: number): Block | null {
        if (this.isBlockInBounds(x, y, z)) {
            return this.blocks[x][y][z];
        } 
        return null;
    }

    /**
     * Adds a new BlockType for given block if it exists.
     * @param x - x-coordinate within the chunk.
     * @param y - y-coordinate within the chunk.
     * @param z - z-coordinate within the chunk.
     * @param blockType - The blocktype to add.
     */
    setBlockType(x: number, y: number, z: number, blockType: BlockType): void {
        if (this.isBlockInBounds(x, y, z)) {
            this.blocks[x][y][z].blockType = blockType;
        }
    }

    /**
     * Updates instance id for given block if it exists.
     * @param x - x-coordinate within the chunk.
     * @param y - y-coordinate within the chunk.
     * @param z - z-coordinate within the chunk.
     * @param blockType - The blocktype to add.
     */
    setInstanceId(x: number, y: number, z: number, instanceId: number): void {
        if (this.isBlockInBounds(x, y, z)) {
            this.blocks[x][y][z].instanceId = instanceId;
        }
    }

    /**
     * Checks wether given coordinates represent an existing block within the chunk.
     * 
     * @param x - x-coordinate within the chunk.
     * @param y - y-coordinate within the chunk.
     * @param z - z-coordinate within the chunk.
     */
    isBlockInBounds(x: number, y: number, z: number): boolean {
        return (
            x >= 0 && x < this.#config.size.chunkWidth &&
            y >= 0 && y < this.#config.size.chunkDepth &&
            z >= 0 && z < this.#config.size.chunkWidth
        );
    }

    /**
     * Checks wether a block is visible or not.
     * 
     * - Verify occlusion culling.
     *
     * @param x - x-coordinate within the chunk.
     * @param y - y-coordinate within the chunk.
     * @param z - z-coordinate within the chunk.
     * @returns `true` if block is visible, `false` otherwise.
     */
    isBlockVisible(x: number, y: number, z: number): boolean {
        return this.#testOcclusionCulling(x, y, z);
    }

    isBlockTransparent(blockType: BlockType): boolean {
        const blockData = this.getBlockData(blockType);
        return (!blockData) || (blockData.opacity !== undefined && blockData.opacity < 1);
    }

    getBlockData(blockType: BlockType): BlockData | undefined {
        const blocks = getBlocks();
        return blocks[blockType];
    }

    /**
     * Test wether a block is exposed or not (occlusion culling).
     * 
     * - Retrieves all its neighbor to determine if a face is exposed.
     * - No neighbor on a side means face is visible.
     * - Any transparent neighbor on a side means it is visible as well.
     * 
     * @param x - x-coordinate within the chunk.
     * @param y - y-coordinate within the chunk.
     * @param z - z-coordinate within the chunk.
     * @returns `true` if at least a face of a block is exposed, `false` otherwise.
     */
    #testOcclusionCulling(x: number, y: number, z: number): boolean {
        const neighbors = this.getNeighbors(x, y, z);

        for (const block of neighbors) {
            if (!block) continue;
            if (block.blockType === BlockType.Empty) return true;
            if (this.isBlockTransparent(block.blockType)) return true;
        }

        return false;
    }

    /**
     * Retrieves all 6 potential neighbors of a block.
     * 
     * - Returns an empty array if provided coordinates are out of bound.
     * 
     * @param x - x-coordinate within the chunk.
     * @param y - y-coordinate within the chunk.
     * @param z - z-coordinate within the chunk.
     * @returns an array containing all neighbors if found.
     */
    getNeighbors(x: number, y: number, z: number): Array<Block | null> {
        if (!this.isBlockInBounds(x, y, z)) return [];
        
        const neighbors = [
            this.getBlock(x - 1, y, z),
            this.getBlock(x + 1, y, z),
            this.getBlock(x , y - 1, z),
            this.getBlock(x , y + 1, z),
            this.getBlock(x , y, z - 1),
            this.getBlock(x , y, z + 1),
        ];

        const blockPosition = new Vector3(x, y, z);

        if (x === 0) neighbors[0] = this.#getNeighborChunkBlock(-1, 0, blockPosition);
        if (x === this.#config.size.chunkWidth - 1) neighbors[1] = this.#getNeighborChunkBlock(1, 0, blockPosition);
        if (z === 0) neighbors[4] = this.#getNeighborChunkBlock(0, -1, blockPosition);
        if (z === this.#config.size.chunkWidth - 1) neighbors[5] = this.#getNeighborChunkBlock(0, 1, blockPosition);

        return neighbors;
    }

    /**
     * Looks for the neighbor of a given block in the adjacent chunk.
     * 
     * @param offsetX - The x-offset in world grid relative to the given block's chunk.
     * @param offsetZ - The z-offset in world grid relative to the given block's chunk.
     * @param blockPosition - The `Vector3` position of the block to retrieve neighbor of.
     * @returns a `Block` object if found, `null` otherwise. 
     */
    #getNeighborChunkBlock(offsetX: number, offsetZ: number, blockPosition: Vector3): Block | null {
        const neighborChunkPosition = new Vector3(
            this.position.x + offsetX * this.#config.size.chunkWidth,
            this.position.y,
            this.position.z + offsetZ * this.#config.size.chunkWidth,
        );

        const neighborChunk = this.parent?.children.find((child) => child instanceof Chunk && child.position.equals(neighborChunkPosition)) as Chunk | undefined;

        if (!neighborChunk) return null;

        const neighborBlockX = offsetX === -1 ? this.#config.size.chunkWidth - 1 : offsetX === 1 ? 0 : blockPosition.x;
        const neighborBlockZ = offsetZ === -1 ? this.#config.size.chunkWidth - 1 : offsetZ === 1 ? 0 : blockPosition.z;

        return neighborChunk.getBlock(neighborBlockX, blockPosition.y, neighborBlockZ);
    }

    /**
     * Disposes of the chunk's resources: instanced meshes and geometries / materials.
     * - Traverses the chunk's object and disposes of `InstancedMesh` instances before
     * clearing the chunk's children.
     */
    dispose() {
        this.traverse((obj) => {
            if (obj instanceof InstancedMesh) {
                obj.geometry.dispose();

                if (Array.isArray(obj.material)) {
                    obj.material.forEach((material) => {
                        material.dispose();
                    })
                } else {
                    obj.material.dispose();
                }
            };
        });
        this.clear();
    }
}

export default Chunk;
