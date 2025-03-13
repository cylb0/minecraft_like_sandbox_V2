import { ColorRepresentation } from "three";

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
    color: ColorRepresentation;
    opacity?: number;
};

export enum DistributionType {
    Uniform,
    Triangular,
}

export interface OreBatch {
    distribution: DistributionType;
    minHeight: number;
    maxHeight: number;
}

export interface OreData extends BlockData {
    /** Value between 0 and 1. */
    rarity: number;
    scale: { x: number, y: number, z: number };
    batches: Array<OreBatch>;
}

export type BlockTypeData = BlockData | OreData;
