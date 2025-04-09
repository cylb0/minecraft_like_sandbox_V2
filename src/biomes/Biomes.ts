import { DEFAULT_SEA_LEVEL } from "@/constants/world";
import { Biome, BiomeType } from "@/types/Biomes";
import { BlockType } from "@/types/Blocks";

type BiomesType = Partial<Record<BiomeType, Biome>>;

let BIOMES_CACHE: BiomesType | null = null;

export function getBiomes(): BiomesType {
    if (!BIOMES_CACHE) {
        BIOMES_CACHE = {
            [BiomeType.Mountain]: {
                name: 'Mountain',
                terrain: {
                    scale: 80,
                    octaves: {
                        count: 6,
                        persistence: .2,
                        lacunarity: 1.8,
                    },
                },
                blocks: {
                    surface: BlockType.Stone,
                },
                altitudeRange: [.6, .7],
                temperatureRange: [0.2, .7],
            },
            [BiomeType.SnowyMountain]: {
                name: 'Snowy Mountain',
                terrain: {
                    scale: 80,
                    octaves: {
                        count: 6,
                        persistence: .2,
                        lacunarity: 2,
                    },
                },
                blocks: {
                    surface: BlockType.Snow,
                    subsurface: BlockType.Stone,
                },
                altitudeRange: [.68, 1],
                temperatureRange: [.1, .4],
            },
            [BiomeType.Forest]: {
                name: 'Forest',
                terrain: {
                    scale: 100,
                    octaves: {
                        count: 4,
                        persistence: .5,
                        lacunarity: 2,
                    },
                },
                blocks: {
                    surface: BlockType.Grass,
                    subsurface: BlockType.Dirt,
                },
                altitudeRange: [.4, .7],
                temperatureRange: [.3, .7],
            },
            [BiomeType.Plain]: {
                name: 'Plain',
                terrain: {
                    scale: 120,
                    octaves: {
                        count: 3,
                        persistence: .5,
                        lacunarity: 1.8,
                    },
                },
                blocks: {
                    surface: BlockType.Grass,
                    subsurface: BlockType.Dirt,
                },
                altitudeRange: [.35, .6],
                temperatureRange: [.35, .85],
            },
            [BiomeType.Desert]: {
                name: 'Desert',
                terrain: {
                    scale: 150,
                    octaves: {
                        count: 3,
                        persistence: .6,
                        lacunarity: 2,
                    },
                },
                blocks: {
                    surface: BlockType.Sand,
                },
                altitudeRange: [.3, .45],
                temperatureRange: [.75, 1],
            },
            [BiomeType.Ocean]: {
                name: 'Ocean',
                terrain: {
                    scale: 150,
                    octaves: {
                        count: 2,
                        persistence: .3,
                        lacunarity: 2,
                    },
                },
                blocks: {
                    surface: BlockType.Sand,
                },
                altitudeRange: [.25, DEFAULT_SEA_LEVEL],
                temperatureRange: [.2, .6],
            },
            // [BiomeType.Beach]: {
            //     name: 'Beach',
            //     terrain: {
            //         scale: 120,
            //         octaves: {
            //             count: 1,
            //             persistence: 1,
            //             lacunarity: 1,
            //         },
            //     },
            //     blocks: {
            //         surface: BlockType.Sand,
            //     },
            //     altitudeRange: [DEFAULT_SEA_LEVEL, .45],
            //     temperatureRange: [.25, .6],
            // }
        }
    }
    return BIOMES_CACHE;
}
