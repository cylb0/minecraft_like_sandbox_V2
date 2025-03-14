import { TEXTURES } from "@/blocks/textures";
import { Block, BlockData, BlockType, DistributionType, OreData } from "@/types/Blocks";
import { BoxGeometry, MeshLambertMaterial } from "three";

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
    [key in BlockType]?: BlockData | OreData | undefined;
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
        material: new MeshLambertMaterial({ map: TEXTURES.bedrock }),
    },
    [BlockType.Water]: {
        color: 0x1e90ff,
        opacity: .5,
    },
    [BlockType.Sand]: {
        material: new MeshLambertMaterial({ map: TEXTURES.sand }),
    },
    [BlockType.Stone]: {
        material: new MeshLambertMaterial({ map: TEXTURES.stone }),
    },
    [BlockType.Dirt]: {
        material: new MeshLambertMaterial({ map: TEXTURES.dirt }),
    },
    [BlockType.Grass]: {
        material: [
            new MeshLambertMaterial({ map: TEXTURES.grass_side }),
            new MeshLambertMaterial({ map: TEXTURES.grass_side }),
            new MeshLambertMaterial({ map: TEXTURES.grass_top }),
            new MeshLambertMaterial({ map: TEXTURES.dirt }),
            new MeshLambertMaterial({ map: TEXTURES.grass_side }),
            new MeshLambertMaterial({ map: TEXTURES.grass_side }),
        ]
    },
    [BlockType.Snow]: {
        material: new MeshLambertMaterial({ map: TEXTURES.snow }),
    },
    [BlockType.CoalOre]: {
        material: new MeshLambertMaterial({ map: TEXTURES.coal_ore }),
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
        material: new MeshLambertMaterial({ map: TEXTURES.iron_ore }),
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
        material: new MeshLambertMaterial({ map: TEXTURES.gold_ore }),
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
