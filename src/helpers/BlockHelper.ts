import { getBlocks } from "@/constants/block";
import { BlockType } from "@/types/Blocks";

class BlockHelper {
    /**
     * Checks wether or not a block is transparent.
     */
    static isTransparent(blockType: BlockType): boolean {
        const blockData = getBlocks()[blockType];
        return (!blockData) || (blockData.opacity !== undefined && blockData.opacity < 1);
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
