import { BlockType, OreData } from "@/types/Blocks";
import { getBlocks } from "./Blocks";

let ORES_CACHE: { [key in BlockType]: OreData } | null = null;

/**
 * Configuration object containing only `OreData`. It is a subset of `BLOCKS`.
 */
export function getOres(): { [key in BlockType]: OreData } {
    const BLOCKS = getBlocks();
    if (!ORES_CACHE) {
        ORES_CACHE = {
            [BlockType.CoalOre]: BLOCKS[BlockType.CoalOre] as OreData,
            [BlockType.IronOre]: BLOCKS[BlockType.IronOre] as OreData,
            [BlockType.GoldOre]: BLOCKS[BlockType.GoldOre] as OreData,
        } as { [key in BlockType]: OreData };
    }

    return ORES_CACHE; 
}