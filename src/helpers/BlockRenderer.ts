import { DEFAULT_BLOCK_GEOMETRY, getBlocks } from "@/constants/block";
import { BlockData, BlockType } from "@/types/Blocks";
import { InstancedMesh, Material, MeshStandardMaterial, MeshStandardMaterialParameters } from "three";

/**
 * Class responsible for managing the rendering of blocks using `THREE.InstancedMesh` for performance.
 */
class BlockRenderer {
    /** A map storing instanced meshses for each block type. */
    #instancedMeshes: Map<BlockType, InstancedMesh> = new Map();
    /** The maximum number of instances that can be rendered in an instanced mesh. */
    #maxInstances: number;

    /**
     * Creates a new BlockRenderer instance.
     * 
     * - Initializes meshes map.
     *
     * @param maxInstances - The maximum number of instances that each instanced mesh can contain.
     * (Maximum number of blocks in a chunk).
     */
    constructor(maxInstances: number) {
        this.#maxInstances = maxInstances;
        this.initMeshes();
    }

    /**
     * Initializes instanced mesh for each block type defined in config `BLOCKS`.
     * 
     * - Loops through each entry in `BLOCKS`. And renders each non-empty block.
     * - Checks if the block has a predefined material, otherwise rely on its color property to generate one.
     * - Generates mesh, counters and shadows.
     */
    private initMeshes(): void {
        const BLOCKS = getBlocks();
        Object.entries(BLOCKS).forEach(([key, blockData]) => {
            const type = Number(key) as BlockType;

            if (type !== BlockType.Empty) {
                const material = blockData.material ?? this.createColorMaterial(blockData!);
                const mesh = new InstancedMesh(DEFAULT_BLOCK_GEOMETRY, material, this.#maxInstances);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.count = 0;
                this.#instancedMeshes.set(type as BlockType, mesh);
            }
        });
    }

    /**
     * Creates a `Material` for a given block config.
     * @param blockData - The block data containing material properties.
     * @returns The created mesh material.
     */
    private createColorMaterial(blockData: BlockData): Material {
        const materialOptions: MeshStandardMaterialParameters = {
            color: blockData.color,
            transparent: !!blockData.opacity,
            opacity: blockData.opacity || 1,
        }

        return new MeshStandardMaterial(materialOptions);
    }

    /**
     * Retrieves the instanced mesh for a given block type.
     * @param blockType - The block type to retrieve mesh for.
     * @returns The instanced mesh for the given block type.
     */
    getBlockType(blockType: BlockType): InstancedMesh {
        return this.#instancedMeshes.get(blockType)!;
    }

    /**
     * Gets an array of all instanced mesh.
     * @returns An array containing all instanced mesh.
     */
    get instancedMeshes(): Array<InstancedMesh> {
        return Array.from(this.#instancedMeshes.values());
    }
}

export default BlockRenderer;
