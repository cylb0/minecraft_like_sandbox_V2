import { EMPTY_BLOCK } from "@/blocks/Blocks";
import { getOres } from "@/blocks/Ores";
import { getBiomes } from "@/constants/biomes";
import BlockHelper from "@/helpers/BlockHelper";
import BlockRenderer from "@/helpers/BlockRenderer";
import PseudoRandomGenerator from "@/helpers/PseudoRandomGenerator";
import { Biome, BiomeType, BiomeWeight } from "@/types/Biomes";
import { Block, BlockType, DistributionType } from "@/types/Blocks";
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
     * Retrieves the highest empty block coordinate of a core (chunk section at given `(x, z)`).
     * 
     * @param x x-coordinate of the core.
     * @param z z-coordinate of the core.
     * @returns the y-coordinate of the highest empty block found.
     */
    findHighestEmptyBlock(x: number, z: number): number {
        const flooredX = Math.floor(x);
        const flooredZ = Math.floor(z);

        for (let y = this.#config.size.chunkDepth - 1; y >= 0; y--) {
            if (this.getBlock(flooredX, y, flooredZ)?.blockType !== BlockType.Empty) {
                return y + 1;
            }
        }
        return 0;
    }

    /**
     * Handles all operations needed to generate a Chunk.
     */
    generate() {
        this.#generateBedrock();
        this.#generateOres();
        this.#generateStoneTerrain();
        this.#generateWater();
        this.#generateClouds();
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
     * Retrieves all 6 potential neighbors of a block.
     * 
     * - Returns an empty array if provided coordinates are out of bound.
     * 
     * @param x - x-coordinate within the chunk.
     * @param y - y-coordinate within the chunk.
     * @param z - z-coordinate within the chunk.
     * @returns an array containing all neighbors if found as well as their world position.
     */
    getNeighbors(x: number, y: number, z: number): Array<{ block: Block | null; worldPosition: Vector3 }> {
        if (!this.isBlockInBounds(x, y, z)) return [];
        
        const neighbors = [
            { block: this.getBlock(x - 1, y, z), worldPosition: new Vector3(this.position.x + x - 1, this.position.y + y, this.position.z + z) },
            { block: this.getBlock(x + 1, y, z), worldPosition: new Vector3(this.position.x + x + 1, this.position.y + y, this.position.z + z)},
            { block: this.getBlock(x , y - 1, z), worldPosition: new Vector3(this.position.x + x, this.position.y + y - 1, this.position.z + z) },
            { block: this.getBlock(x , y + 1, z), worldPosition: new Vector3(this.position.x + x, this.position.y + y + 1, this.position.z + z) },
            { block: this.getBlock(x , y, z - 1), worldPosition: new Vector3(this.position.x + x, this.position.y + y, this.position.z + z - 1) },
            { block: this.getBlock(x , y, z + 1), worldPosition: new Vector3(this.position.x + x, this.position.y + y, this.position.z + z + 1) }
        ];

        const blockPosition = new Vector3(x, y, z);

        if (x === 0) neighbors[0].block = this.#getNeighborChunkBlock(-1, 0, blockPosition);
        if (x === this.#config.size.chunkWidth - 1) neighbors[1].block = this.#getNeighborChunkBlock(1, 0, blockPosition);
        if (z === 0) neighbors[4].block = this.#getNeighborChunkBlock(0, -1, blockPosition);
        if (z === this.#config.size.chunkWidth - 1) neighbors[5].block = this.#getNeighborChunkBlock(0, 1, blockPosition);

        return neighbors;
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

    /**
     * Renders a chunk.
    */
    render() {
        requestIdleCallback(() => this.#generateMeshes());
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

            if (block === null || !BlockHelper.isDestroyable(block.blockType)) return;

            this.#hideBlockInstance(block);

            this.blocks[x][y][z] = EMPTY_BLOCK;

            this.#updateNeighborsVisibility(x, y, z);
        }
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
     * Adds a block to it's corresponding `InstancedMesh` at given coordinates.
     * 
     * - It verifies that coordinates are within the chunk's bounds and that they correspond to an existing non empty block.
     * - It retrieves the corresponding `InstancedMesh` from `blockRenderer`.
     * - It checks if a block is already in the mesh for those coordinates.
     * - Adds the block to the mesh and updates its instance ID.
     * - Updates both mesh's boundingBox for collisions and boundingSphere for camera view.
     * 
     * @param x The x-coordinate of the block to add.
     * @param y The y-coordinate of the block to add.
     * @param z The z-coordinate of the block to add.
     */
    #addBlockToMesh(x: number, y: number, z: number): void {
        if (!this.isBlockInBounds(x, y, z)) return;

        const block = this.getBlock(x, y, z);
        if (!block || block.blockType === BlockType.Empty) return;

        const mesh = this.#blockRenderer.getBlockType(block.blockType);

        if (this.#isBlockAlreadyInMesh(mesh, x, y, z)) return;

        const halfBlockSize = this.#config.size.blockSize / 2;

        const instanceId = mesh.count;
        const matrix = new Matrix4();
        matrix.setPosition(x + halfBlockSize, y + halfBlockSize, z + halfBlockSize);
        mesh.setMatrixAt(instanceId, matrix);

        this.setInstanceId(x, y, z, instanceId);
        mesh.count++;

        mesh.instanceMatrix.needsUpdate = true;
        mesh.computeBoundingBox();
        mesh.computeBoundingSphere();
    }

    /**
     * Returns a blended [minAlt, maxAlt] array based on given biome weights.
     *
     * @param biomeWeights
     * @returns 
     */
    #computeBlendedAltitudeRange(biomeWeights: Array<BiomeWeight>): [number, number] {
        let minAlt = 0;
        let maxAlt = 0;

        for (const { biome, weight } of biomeWeights) {
            minAlt += biome.altitudeRange[0] * weight;
            maxAlt += biome.altitudeRange[1] * weight;
        }

        return [minAlt, maxAlt];
    }

    /**
     * Compute a height in blocks based on a given noise value.
     *
     * - Normalizes the noise value.
     * - Converts it to actual block height and clamps value.
     * 
     * @param noise - The noise to convert to actual block height.
     * @returns A computed height value.
     */
    #computeHeightFromNoise(noise: number, altitudeRange: [number, number] = [0, 1]): number {
        const [min, max] = altitudeRange;
        const chunkDepth = this.#config.size.chunkDepth;
        
        const heightFactor = min + (max - min) * noise;
        return heightFactor * chunkDepth;
    }

    /**
     * Computes a weighted noise value by blending multiple biome octave patterns.
     * Iterates over multiple octaves to create a more distributed noise.
     * 
     * - Each iteration adds noise at a higher frequency and lower amplitude, adding detail to the overall noise.
     * - Persistence controls how much each octave contributes to final result.
     * - Lacunarity controls the frequency increase between octaves.
     * - Scale controls the size of the noise pattern.
     * - Amplitude controls the initial amplitude of the noise pattern.
     * 
     * @param simplex - An instance of SimplexNoise used to generate noise.
     * @param worldX - The world x-coordinate.
     * @param worldZ - The world z-coordinate.
     * @param biomeWeights - An array of biome / weight pairs for given worldX and worldZ.
     * @returns A normalized octave noise (between 0 and 1);
     */
    #computeWeightedOctaveNoise(simplex: SimplexNoise, worldX: number, worldZ: number, biomeWeights: Array<BiomeWeight>): number {
        let total = 0;

        for (const { biome, weight } of biomeWeights) {
            const { count, persistence, lacunarity } = biome.terrain.octaves;
            const scale = biome.terrain.scale;

            let value = 0;
            let amplitude = 1;
            let frequency = 1;
            let maxValue = 0;

            for (let i = 0; i < count; i++) {
                const noise = simplex.noise((worldX / scale) * frequency, (worldZ / scale) * frequency);
                value += amplitude * noise;
                maxValue += amplitude;
                amplitude *= persistence;
                frequency *= lacunarity;
            }

            value = ((value / maxValue) + 1) / 2;
            total += value * weight;
        }

        return total;
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
     * Computes biome influence weights at given coordinates.
     * 
     * - It computes a temperature noise and an altitude noise.
     * - It compares those results to each biome's temperature range and altitude ranges.
     * - Based on distance to each biome's ranges, it defines a weight for that biome.
     * 
     * @param simplex - The `SimplexNoise` instance used to generate pseudo-random values.
     * @param worldX - The world x-coordinate.
     * @param worldZ - The world z-coordinate.
     * @returns An array of `BiomeWeight` that will be used to generate terrain.
     */
    #generateBiomeWeights(simplex: SimplexNoise, worldX: number, worldZ: number): Array<BiomeWeight> {
        const temperature = (simplex.noise(worldX / 1000, worldZ / 1000) + 1) / 2;
        const altitude = (simplex.noise(worldX / 300, worldZ / 300) + 1) / 2;

        const biomes = getBiomes();
        const weights: Array<BiomeWeight> = [];

        for (const biome of Object.values(biomes)) {
            if (!biome) continue;

            const [tMin, tMax] = biome.temperatureRange;
            const [aMin, aMax] = biome.altitudeRange;

            const tMid = (tMin + tMax) / 2;
            const aMid = (aMin + aMax) / 2;

            const tDist = temperature - tMid;
            const aDist = altitude - aMid;

            const distance = Math.sqrt(tDist * tDist + aDist * aDist);

            const falloff = .4;
            const weight = Math.max(0, 1 - distance / falloff);

            if (weight > 0) {
                weights.push({ biome, weight });
            }
        }

        if (weights.length === 0) {
            return [{ biome: getBiomes()[BiomeType.Ocean]!, weight: 1 }];
        }

        const totalWeights = weights.reduce((total, w) => total + w.weight, 0);

        return weights.map(({ biome, weight }) => ({
            biome,
            weight: weight / totalWeights
        }));
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
     * Generates the instanced meshes for the chunk's blocks.
     * It iterates through all blocks, checks their visibility, and adds them to the appropriate instanced mesh.
     */
    #generateMeshes() {
        this.dispose();

        const matrix = new Matrix4();

        const halfBlockSize = this.#config.size.blockSize / 2;

        for (let x = 0; x < this.#config.size.chunkWidth; x++) {
            for (let y = 0; y < this.#config.size.chunkDepth; y++) {
                for (let z = 0; z < this.#config.size.chunkWidth; z++) {
                    const block = this.getBlock(x, y, z);
                    if (block === null) continue;

                    const blockType = block.blockType;
                    if (blockType === BlockType.Empty) continue;

                    if (this.isBlockVisible(x, y, z) || blockType === BlockType.Bedrock) {
                        const mesh = this.#blockRenderer.getBlockType(blockType);
                        const instanceId = mesh.count;

                        matrix.setPosition(x + halfBlockSize, y + halfBlockSize, z + halfBlockSize);
                        mesh.setMatrixAt(instanceId, matrix);
                        this.setInstanceId(x, y, z, instanceId);
                        mesh.count++;
                    }
                }
            }
        }

        const meshes = this.#blockRenderer.instancedMeshes;

        this.add(...meshes);
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
     * Generates the base stone terrain using weighted simplex noise and blending.
     * 
     * - Generates a height map using weighted octaves based on a mix of biomes at each coordinate.
     * - Determines height range blending all `biome.altitudeRange`.
     * - Fills all blocks below height with `BlockType.Stone` and removes all flying ore generated by `generatedOres()`.
     * - Generates the appropriate surface blocks based on biome that has the more weight. 
     */
    #generateStoneTerrain() {
        const simplex = new SimplexNoise(this.#rng);

        for (let x = 0; x < this.#config.size.chunkWidth; x++) {
            for (let z = 0; z < this.#config.size.chunkWidth; z++) {
                const worldX = this.position.x + x;
                const worldZ = this.position.z + z;

                const biomeWeights = this.#generateBiomeWeights(simplex, worldX, worldZ);
                const noiseValue = this.#computeWeightedOctaveNoise(simplex, worldX, worldZ, biomeWeights);
                const blendedAlts = this.#computeBlendedAltitudeRange(biomeWeights);
                const height = this.#computeHeightFromNoise(noiseValue, blendedAlts);
                
                const mainBiome = biomeWeights.reduce((a, b) => (a.weight > b.weight ? a : b)).biome;

                for (let y = this.#config.terrain.bedrockThickness; y < this.#config.size.chunkDepth; y++) {
                    if (y < height) {
                        if (this.getBlock(x, y, z)?.blockType === BlockType.Empty) {
                            this.setBlockType(x, y, z, BlockType.Stone);
                        }
                    } else {
                        this.setBlockType(x, y, z, BlockType.Empty);
                    }
                }

                this.#generateSurface(x, z, mainBiome);
            }
        }
    }

    /**
     * Replace top layers with biome specific blocks.
     * 
     * @param x - Chunk's x-coordinate.
     * @param z - Chunk's z-coordinate.
     * @param biome - The biome used to retrieve surface blocks.
     */
    #generateSurface(x: number, z: number, biome: Biome): void {
        let highestBlockY = this.findHighestEmptyBlock(x, z);
        if (highestBlockY > 2) {
            this.setBlockType(x, highestBlockY - 1, z, biome.blocks.surface);
            this.setBlockType(x, highestBlockY - 2, z, biome.blocks.subsurface ?? biome.blocks.surface);
        }
    }

    /**
     * Generates water blocks between highest block height and seaLevel threshold.
     */
    #generateWater(): void {
        for (let x = 0; x < this.#config.size.chunkWidth; x++) {
            for (let z = 0; z < this.#config.size.chunkWidth; z++) {
                let highestBlockY = this.findHighestEmptyBlock(x, z);

                for (let y = highestBlockY; y <= this.#config.size.chunkDepth * this.#config.water.seaLevel; y++) {
                    this.setBlockType(x, y, z, BlockType.Water);
                }
            }
        }
    }

    /**
     * Finds the chunk containing a given block based on its world position.
     * 
     * @param blockPosition - The position of the block to retrieve chunk of. 
     * @returns A `Chunk` or `undefined` if not found.
     */
    #getChunkContainingBlock(blockPosition: Vector3): Chunk {
        const chunkWidth = this.#config.size.chunkWidth;

        return this.parent?.children.find((child) => 
            child instanceof Chunk &&
            child.position.x === Math.floor(blockPosition.x / chunkWidth) * chunkWidth &&
            child.position.z === Math.floor(blockPosition.z / chunkWidth) * chunkWidth
        ) as Chunk;
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
     * Hides a block by switching its corresponding InstancedMesh instance to the last active position and reducing the instance count.
     *
     * - Retreives the `InstancedMesh` for the given block's type.
     * - Gets the matrix of the last active instance of the mesh.
     * - Extracts its position.
     * - Swap the instance to be removed with the last active instance.
     * - Reduce the instance count so the former last instance is no more rendered.
     * - Updates the instance matrix.
     * 
     * @param block - The `Block` to hide.
     */
    #hideBlockInstance(block: Block): void {
        const mesh = this.#blockRenderer.getBlockType(block.blockType);

        const lastInstanceMatrix = new Matrix4();
        mesh.getMatrixAt(mesh.count - 1, lastInstanceMatrix);

        const lastInstancePosition = new Vector3().applyMatrix4(lastInstanceMatrix);
        const halfBlockSize = this.#config.size.blockSize / 2;
        this.setInstanceId(lastInstancePosition.x - halfBlockSize, lastInstancePosition.y - halfBlockSize, lastInstancePosition.z - halfBlockSize, block.instanceId);
        mesh.setMatrixAt(block.instanceId, lastInstanceMatrix);
        mesh.count--;
        mesh.instanceMatrix.needsUpdate = true;
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
    * Checks if a block is already present in the mesh for the given chunk coordinates.
    * 
    * - Traverse the mesh looking for an instance with position matching given coordinates.
    * - Sub half a block size from the instance's coordinate as instances are offseted.
    *
    * @param mesh - The `InstancedMesh` containing block instances.
    * @param x - The x-coordinate of the block.
    * @param y - The y-coordinate of the block.
    * @param z - The z-coordinate of the block.
    * @returns `true` if the block is already in the mesh at given coordinates, `false` otherwise.
    */
    #isBlockAlreadyInMesh(mesh: InstancedMesh, x: number, y: number, z: number): boolean {
        const matrix = new Matrix4();
        const position = new Vector3();
        const halfBlockSize = this.#config.size.blockSize / 2;

        for (let i = 0; i < mesh.count; i++) {
            mesh.getMatrixAt(i, matrix);
            position.setFromMatrixPosition(matrix);

            const blockX = position.x - halfBlockSize;
            const blockY = position.y - halfBlockSize;
            const blockZ = position.z - halfBlockSize;

            if (blockX === x && blockY === y && blockZ === z) {
                return true;
            }
        }

        return false;
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

        for (const neighbor of neighbors) {
            if (!neighbor.block) continue;
            if (neighbor.block.blockType === BlockType.Empty) return true;
            if (BlockHelper.isTransparent(neighbor.block.blockType)) return true;
        }

        return false;
    }

    /**
     * Updates the visibility of a block's neighbors.
     * 
     * This method is used after removing a block to update it's neighbors visibility as a removed block needs to reveal what it was hiding.
     * 
     * - It retrieves all neighbors of the block.
     * - Ensures that each neighbor exists and is not empty.
     * - Retrieves the chunk containing each neighbor.
     * - Converts the neighbor's world position to local coordinates in that chunk.
     * - Adds the block to the mesh if it is visible.
     * 
     * @param x - The local-x coordinate of the block to update neighbors of.
     * @param y - The local-y coordinate of the block to update neighbors of.
     * @param z - The local-z coordinate of the block to update neighbors of.
     */
    #updateNeighborsVisibility(x: number, y: number, z: number): void {
        const neighbors = this.getNeighbors(x, y, z);

        for (const neighbor of neighbors) {

            if (!neighbor.block || neighbor.block.blockType === BlockType.Empty) continue;
            
            const neighborChunk = this.#getChunkContainingBlock(neighbor.worldPosition);

            if (!neighborChunk) continue;

            const neighborLocalPosition = neighborChunk.worldToLocal(neighbor.worldPosition)

            if (neighborChunk.isBlockVisible(neighborLocalPosition.x, neighborLocalPosition.y, neighborLocalPosition.z)) {
                neighborChunk.#addBlockToMesh(neighborLocalPosition.x, neighborLocalPosition.y, neighborLocalPosition.z)
            }
        }
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
