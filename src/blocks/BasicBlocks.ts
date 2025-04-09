import { MeshLambertMaterial } from "three";
import { BlockData, BlockType } from "./BlockTypes";
import { TEXTURES } from "./Textures";

let BASIC_BLOCK_CACHE: Partial<Record<BlockType, BlockData>> | null = null;

function createBasicBlock(data: Omit<BlockData, "type">): BlockData {
    return {
        ...data,
        type: "base"
    }
}

export function getBasicBlocks(): Partial<Record<BlockType, BlockData>> {
    if (!BASIC_BLOCK_CACHE) {
        BASIC_BLOCK_CACHE = {
            [BlockType.Empty]: undefined,
            [BlockType.Bedrock]: createBasicBlock({
                material: new MeshLambertMaterial({ map: TEXTURES.bedrock }),
                hardness: Infinity,
            }),
            [BlockType.Cloud]: createBasicBlock({
                color: 0xffffff,
                opacity: .9,
                solid: false,
                hardness: Infinity,
            }),
            [BlockType.Dirt]: createBasicBlock({
                material: new MeshLambertMaterial({ map: TEXTURES.dirt }),
                hardness: 1,
            }),
            [BlockType.Grass]: createBasicBlock({
                material: [
                    new MeshLambertMaterial({ map: TEXTURES.grass_side }),
                    new MeshLambertMaterial({ map: TEXTURES.grass_side }),
                    new MeshLambertMaterial({ map: TEXTURES.grass_top }),
                    new MeshLambertMaterial({ map: TEXTURES.dirt }),
                    new MeshLambertMaterial({ map: TEXTURES.grass_side }),
                    new MeshLambertMaterial({ map: TEXTURES.grass_side }),
                ],
                hardness: 1,
            }),
            [BlockType.Sand]: createBasicBlock({
                material: new MeshLambertMaterial({ map: TEXTURES.sand }),
                hardness: 1,
            }),
            [BlockType.Snow]: createBasicBlock({
                material: new MeshLambertMaterial({ map: TEXTURES.snow }),
                hardness: 1,
            }),
            [BlockType.Stone]: createBasicBlock({
                material: new MeshLambertMaterial({ map: TEXTURES.stone }),
                hardness: 1,
            }),
            [BlockType.Water]: createBasicBlock({
                color: 0x1e90ff,
                opacity: .5,
                solid: false,
                hardness: 1,
            }),
        };
    }

    return BASIC_BLOCK_CACHE;
} 
