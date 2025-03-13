import { TerrainConfig, WaterConfig, WorldConfig, WorldSizeConfig } from "@/types/Config";
import { DEFAULT_BLOCK_SIZE } from "@/constants/block";
import { DEFAULT_BEDROCK_THICKNESS, DEFAULT_CHUNK_DIMENSIONS, DEFAULT_NOISE_AMPLITUDE, DEFAULT_NOISE_SCALE, DEFAULT_RENDER_RADIUS, DEFAULT_SEA_LEVEL, DEFAULT_SEED, DEFAULT_SNOW_LEVEL, DEFAULT_WORLD_SIZE } from "@/constants/world";

export function getDefaultWorldConfig(): WorldConfig {
    return {
        terrain: getDefaultTerrainConfig(),
        water: getDefaultWaterConfig(),
        size: getDefaultWorldSizeConfig(),
    }
}

function getDefaultTerrainConfig(): TerrainConfig {
    return {
        amplitude: DEFAULT_NOISE_AMPLITUDE,
        bedrockThickness: DEFAULT_BEDROCK_THICKNESS,
        seed: DEFAULT_SEED,
        scale: DEFAULT_NOISE_SCALE,
        snowLevel: DEFAULT_SNOW_LEVEL,
    }
}

function getDefaultWorldSizeConfig(): WorldSizeConfig {
    return {
        worldSize: DEFAULT_WORLD_SIZE,
        chunkWidth: DEFAULT_CHUNK_DIMENSIONS.width,
        chunkDepth: DEFAULT_CHUNK_DIMENSIONS.depth,
        renderRadius: DEFAULT_RENDER_RADIUS,
        blockSize: DEFAULT_BLOCK_SIZE,
    }
}

function getDefaultWaterConfig(): WaterConfig {
    return {
        seaLevel: DEFAULT_SEA_LEVEL,
    }
}