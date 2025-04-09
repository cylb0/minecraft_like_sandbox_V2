import { BlockType, PlantData } from "./BlockTypes";
import { createDoubleSidedTexture, createXShapeGeometry } from "@/helpers/PlantHelper";
import { TEXTURES } from "./Textures";
import { DEFAULT_BLOCK_SIZE } from "./Blocks";

let PLANTS_CACHE: Partial<Record<BlockType, PlantData>> | null = null;

function createPlantData(
    data: Omit<PlantData, "type">
): PlantData {
    return {
        ...data,
        type: "plant",
    }
}

/**
 * Configuration object containing only `PlantData`. It is a subset of `BLOCKS`.
 */
export function getPlants(): Partial<Record<BlockType, PlantData>> {
    if (!PLANTS_CACHE) {
        PLANTS_CACHE = {
            [BlockType.DandelionFlower]: createPlantData({
                material: createDoubleSidedTexture(TEXTURES.flower_dandelion),
                geometry: createXShapeGeometry(DEFAULT_BLOCK_SIZE),
                solid: false,
                hardness: 1,
            }),
            [BlockType.GrassPlant]: createPlantData({
                material: createDoubleSidedTexture(TEXTURES.plant_grass),
                geometry: createXShapeGeometry(DEFAULT_BLOCK_SIZE),
                solid: false,
                hardness: 1,
            }),
            [BlockType.LilyFlower]: createPlantData({
                material: createDoubleSidedTexture(TEXTURES.flower_lily),
                geometry: createXShapeGeometry(DEFAULT_BLOCK_SIZE),
                solid: false,
                hardness: 1,
            }),
            [BlockType.PoppyFlower]: createPlantData({
                material: createDoubleSidedTexture(TEXTURES.flower_poppy),
                geometry: createXShapeGeometry(DEFAULT_BLOCK_SIZE),
                solid: false,
                hardness: 1,
            }),
        };
    }
    return PLANTS_CACHE;
};