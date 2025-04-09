import { getBlocks } from "@/blocks/Blocks";
import { BlockType } from "@/types/Blocks";

class BlockHelper {
    /**
     * Checks wether or not a block is transparent.
     */
    static isTransparent(blockType: BlockType): boolean {
        const blockData = getBlocks()[blockType];
        if (!blockData) return true;

        if (Array.isArray(blockData.material)) {
            return blockData.material.some(material => material.transparent);
        }

        if (blockData.material) return blockData.material.transparent;

        return (blockData.opacity !== undefined && blockData.opacity < 1);
    }

    /**
     * Checks if a block can be destroyed based on its hardness.
     * 
     * @param blockType - The block type to check.
     * @returns `true` if the block can be destroyed, `false` otherwise.
     */
    static isDestroyable(blockType: BlockType): boolean {
        return getBlocks()[blockType]?.hardness !== Infinity;
    }
}

export default BlockHelper;
