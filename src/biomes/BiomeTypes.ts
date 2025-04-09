import { BlockType } from "@/types/Blocks";
import { OctavesConfig } from "@/types/Config";

export enum BiomeType {
    Plain = 0,
    Forest = 1,
    Desert = 2,
    Mountain = 3,
    SnowyMountain = 4,
    Ocean = 5,
    Beach = 6,
}

export interface Biome {
    name: string;
    terrain: {
        scale: number;
        octaves: OctavesConfig,
    };
    blocks: {
        surface: BlockType;
        subsurface?: BlockType;
    };
    altitudeRange: [number, number];
    temperatureRange: [number, number];
}

export interface BiomeWeight {
    biome: Biome;
    weight: number;
}
