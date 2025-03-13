import { LightingConfig, TerrainConfig, WaterConfig, WorldConfig, WorldSizeConfig } from "@/types/Config";
import { DEFAULT_BLOCK_SIZE } from "@/constants/block";
import { DEFAULT_AMBIENTLIGHT_COLOR, DEFAULT_AMBIENTLIGHT_INTENSITY, DEFAULT_BEDROCK_THICKNESS, DEFAULT_CHUNK_DIMENSIONS, DEFAULT_NOISE_AMPLITUDE, DEFAULT_NOISE_SCALE, DEFAULT_RENDER_RADIUS, DEFAULT_SEA_LEVEL, DEFAULT_SEED, DEFAULT_SNOW_LEVEL, DEFAULT_SUNLIGHT_COLOR, DEFAULT_SUNLIGHT_INTENSITY, DEFAULT_SUNLIGHT_POSITION, DEFAULT_SUNLIGHT_SHADOW_FRUSTUM, DEFAULT_SUNLIGHT_SHADOW_MAPSIZE, DEFAULT_WORLD_SIZE } from "@/constants/world";

export function getDefaultWorldConfig(): WorldConfig {
    return {
        light: getDefaultLightingConfig(),
        size: getDefaultWorldSizeConfig(),
        terrain: getDefaultTerrainConfig(),
        water: getDefaultWaterConfig(),
    };
}

function getDefaultTerrainConfig(): TerrainConfig {
    return {
        amplitude: DEFAULT_NOISE_AMPLITUDE,
        bedrockThickness: DEFAULT_BEDROCK_THICKNESS,
        seed: DEFAULT_SEED,
        scale: DEFAULT_NOISE_SCALE,
        snowLevel: DEFAULT_SNOW_LEVEL,
    };
}

function getDefaultWorldSizeConfig(): WorldSizeConfig {
    return {
        worldSize: DEFAULT_WORLD_SIZE,
        chunkWidth: DEFAULT_CHUNK_DIMENSIONS.width,
        chunkDepth: DEFAULT_CHUNK_DIMENSIONS.depth,
        renderRadius: DEFAULT_RENDER_RADIUS,
        blockSize: DEFAULT_BLOCK_SIZE,
    };
}

function getDefaultWaterConfig(): WaterConfig {
    return {
        seaLevel: DEFAULT_SEA_LEVEL,
    };
}

function getDefaultLightingConfig(): LightingConfig {
    return {
        ambientLight: {
            color: DEFAULT_AMBIENTLIGHT_COLOR,
            intensity: DEFAULT_AMBIENTLIGHT_INTENSITY,
        },
        sunLight: {
            color: DEFAULT_SUNLIGHT_COLOR,
            intensity: DEFAULT_SUNLIGHT_INTENSITY,
            shadow: {
                frustum: DEFAULT_SUNLIGHT_SHADOW_FRUSTUM,
                mapSize: DEFAULT_SUNLIGHT_SHADOW_MAPSIZE,
            },
            
            position: DEFAULT_SUNLIGHT_POSITION,
        }
    };
}