import { Block, BlockData, BlockType, OreData, PlantData } from "@/types/Blocks";
import { BoxGeometry } from "three";
import { getBasicBlocks } from "./BasicBlocks";
import { getOres } from "./Ores";
import { getPlants } from "./Plants";

/** Represents the size of a block in world units. */
export const DEFAULT_BLOCK_SIZE = 1;

/** Default block representing an empty space. */
export const EMPTY_BLOCK: Block = { blockType: BlockType.Empty, instanceId: -1 };

/** Default Geometry used for blocks mesh creation. */
export const DEFAULT_BLOCK_GEOMETRY = new BoxGeometry(DEFAULT_BLOCK_SIZE);

/**
 * Type definition for the `BLOCKS` configuration object.
 * It maps `BlockType` enums to either `OreData`, `BlockData` or `undefined`.
 */
type BlocksType = Partial<Record<BlockType, BlockData | OreData | PlantData>>;

let BLOCKS_CACHE: BlocksType | null = null;

/**
 * Returns the configuration object containing data for all block types in the world.
 * - Used only after textures are preloaded.
 * Each property corresponds to a `BlockType` enum value and contains either `OreData`, `BlockData`.
 * - `OreData` is used for ore blocks with additional generation properties.
 * - `BlockData` is used for basic blocks and only define visual properties. 
 */
export function getBlocks(): BlocksType {
    if (!BLOCKS_CACHE) {
        BLOCKS_CACHE = {
            ...getBasicBlocks(),
            ...getOres(),
            ...getPlants(),
        };
    }
    return BLOCKS_CACHE;
};
