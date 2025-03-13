import { Block, BlockData, BlockType, DistributionType, OreData } from "@/types/Blocks";
import { BoxGeometry } from "three";


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
type BlocksType = {
    [key in BlockType]?: OreData | BlockData | undefined;
}

/**
 * Configuration object containing data for all block types in the world.
 * Each property corresponds to a `BlockType` enum value and contains either `OreData`, `BlockData`.
 * - `OreData` is used for ore blocks with additional generation properties.
 * - `BlockData` is used for basic blocks and only define visual properties. 
 */
export const BLOCKS: BlocksType = {
    [BlockType.Empty]: undefined,
    [BlockType.Bedrock]: {
        color: 0x000000,
    },
    [BlockType.Water]: {
        color: 0x1e90ff,
        opacity: .5,
    },
    [BlockType.Stone]: {
        color: 0xf0f0f0,
    },
    [BlockType.Dirt]: {
        color: 0x8b4513,
    },
    [BlockType.Grass]: {
        color: 0x228b22,
    },
    [BlockType.Snow]: {
        color: 0xffffff,
    },
    [BlockType.CoalOre]: {
        color: 0x4a4a4a,
        rarity: .8,
        scale: { x: 10, y: 5, z: 10 },
        batches: [
            {
                distribution: DistributionType.Triangular,
                minHeight: .20,
                maxHeight: .80,
            },
            {
                distribution: DistributionType.Uniform,
                minHeight: .75,
                maxHeight: 1,
            }
        ]
    },
    [BlockType.IronOre]: {
        color: 0xd4d7d9,
        rarity: .9,
        scale: { x: 12, y: 25, z: 20 },
        batches: [
            {
                distribution: DistributionType.Uniform,
                minHeight: 0,
                maxHeight: 40,
            },
            {
                distribution: DistributionType.Triangular,
                minHeight: 15,
                maxHeight: 35,
            },
            {
                distribution: DistributionType.Triangular,
                minHeight: 45,
                maxHeight: 140,
            }
        ]
    },
    [BlockType.GoldOre]: {
        color: 0xefbf04,
        rarity: .9,
        scale: { x: 15, y: 12, z: 40 },
        batches: [
            {
                distribution: DistributionType.Triangular,
                minHeight: 0,
                maxHeight: .3,
            }
        ]
    }
};

/**
 * Configuration object containing only `OreData`. It is a subset of `BLOCKS`.
 */
export const ORES: { [key in BlockType]: OreData } = {
    [BlockType.CoalOre]: BLOCKS[BlockType.CoalOre] as OreData,
    [BlockType.IronOre]: BLOCKS[BlockType.IronOre] as OreData,
    [BlockType.GoldOre]: BLOCKS[BlockType.GoldOre] as OreData,
} as { [key in BlockType]: OreData }
