import { ColorRepresentation, Material } from "three";

export enum BlockType {
    Empty = 0,
    Bedrock = 1,
    Water = 2,
    Sand = 3,
    Stone = 4,
    Dirt = 5,
    Grass = 6,
    Snow = 7,
    CoalOre = 8,
    IronOre = 9,
    GoldOre = 10,
}

/**
 * Types of ore distribution within a chunk.
 */
export enum DistributionType {
    Uniform,
    Triangular,
}

/**
 * Represents the basic data of a block.
 */
export interface Block {
    /** The type of block. */
    blockType: BlockType;
    /** The instanceId of the block within its instanciated mesh. */
    instanceId: number;
};

/**
 * Data needed for representing rendering a block.
 */
export interface BlockData {
    /** The material or array of materials applied to a block's mesh. */
    material?: Material | Array<Material>;
    /** The fallback color for the block. */
    color?: ColorRepresentation;
    opacity?: number;
};

/**
 * Represents a batch of ore distribution within a chunk.
 * It includes thresholds as percentage of the chunk's height.
 */
export interface OreBatch {
    /** The type of distribution for a batch. */
    distribution: DistributionType;
    /** The minimum height at which the ore can be found (between 0 and 1). */
    minHeight: number;
    /** The maximum height at which the ore can be found (between 0 and 1). */
    maxHeight: number;
};

/**
 * Represents data for ore blocks including distribution and rarity.
 */
export interface OreData extends BlockData {
    /** Value between 0 and 1. */
    rarity: number;
    /** Thes scale of the ore vein. Used for noise rendering. */
    scale: { x: number, y: number, z: number };
    /** And array of batches defining distribution at different heights of the chunk. */
    batches: Array<OreBatch>;
};
