import { BlockType, DistributionType, OreData } from "@/types/Blocks";
import { MeshLambertMaterial } from "three";
import { TEXTURES } from "./Textures";

let ORES_CACHE: Partial<Record<BlockType, OreData>> | null = null;

function createOreData(data: Omit<OreData, "type">): OreData {
    return {
        ...data,
        type: "ore"
    }
}

/**
 * Configuration object containing only `OreData`. It is a subset of `BLOCKS`.
 */
export function getOres(): Partial<Record<BlockType, OreData>> {
    if (!ORES_CACHE) {
        ORES_CACHE = {
            [BlockType.CoalOre]: createOreData({
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
                ],
                hardness: 1,
            }),
            [BlockType.GoldOre]: createOreData({
                material: new MeshLambertMaterial({ map: TEXTURES.gold_ore }),
                rarity: .9,
                scale: { x: 15, y: 12, z: 40 },
                batches: [
                    {
                        distribution: DistributionType.Triangular,
                        minHeight: 0,
                        maxHeight: .3,
                    }
                ],
                hardness: 1,
            }),
            [BlockType.IronOre]: createOreData({
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
                ],
                hardness: 1,
            }),
        };
    }

    return ORES_CACHE; 
}