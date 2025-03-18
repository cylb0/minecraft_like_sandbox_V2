import { LightingConfig, LightVariation, TerrainConfig, WaterConfig, WorldConfig, WorldSizeConfig } from "@/types/Config";
import { DEFAULT_BLOCK_SIZE } from "@/constants/block";
import { DEFAULT_AMBIENTLIGHT_COLOR, DEFAULT_AMBIENTLIGHT_INTENSITY, DEFAULT_BEDROCK_THICKNESS, DEFAULT_CHUNK_DIMENSIONS, DEFAULT_DAY_DURATION, DEFAULT_MOONLIGHT_COLOR, DEFAULT_MOONLIGHT_INTENSITY, DEFAULT_MOONLIGHT_OFFSET, DEFAULT_MOONLIGHT_RADIUS, DEFAULT_MOONLIGHT_SHADOW_MAPSIZE, DEFAULT_NOISE_AMPLITUDE, DEFAULT_NOISE_SCALE, DEFAULT_RENDER_RADIUS, DEFAULT_SEA_LEVEL, DEFAULT_SEED, DEFAULT_SNOW_LEVEL, DEFAULT_SUNLIGHT_COLOR, DEFAULT_SUNLIGHT_INTENSITY, DEFAULT_SUNLIGHT_OFFSET, DEFAULT_SUNLIGHT_RADIUS, DEFAULT_SUNLIGHT_SHADOW_MAPSIZE, DEFAULT_WORLD_SIZE } from "@/constants/world";

export function getDefaultWorldConfig(): WorldConfig {
    return {
        /** Duration of the day in seconds. */
        dayDurationInSeconds: DEFAULT_DAY_DURATION,
        light: getDefaultLightingConfig(),
        size: getDefaultWorldSizeConfig(),
        terrain: getDefaultTerrainConfig(),
        water: getDefaultWaterConfig(),
    };
};

function getDefaultTerrainConfig(): TerrainConfig {
    return {
        amplitude: DEFAULT_NOISE_AMPLITUDE,
        bedrockThickness: DEFAULT_BEDROCK_THICKNESS,
        seed: DEFAULT_SEED,
        scale: DEFAULT_NOISE_SCALE,
        snowLevel: DEFAULT_SNOW_LEVEL,
    };
};

function getDefaultWorldSizeConfig(): WorldSizeConfig {
    return {
        worldSize: DEFAULT_WORLD_SIZE,
        chunkWidth: DEFAULT_CHUNK_DIMENSIONS.width,
        chunkDepth: DEFAULT_CHUNK_DIMENSIONS.depth,
        renderRadius: DEFAULT_RENDER_RADIUS,
        blockSize: DEFAULT_BLOCK_SIZE,
    };
};

function getDefaultWaterConfig(): WaterConfig {
    return {
        seaLevel: DEFAULT_SEA_LEVEL,
    };
};

function getDefaultLightingConfig(): LightingConfig {
    return {
        ambientLight: {
            color: DEFAULT_AMBIENTLIGHT_COLOR,
            intensity: DEFAULT_AMBIENTLIGHT_INTENSITY,
        },
        moonLight: {
            angleOffset: DEFAULT_MOONLIGHT_OFFSET,
            defaultColor: DEFAULT_MOONLIGHT_COLOR,
            defaultIntensity: DEFAULT_MOONLIGHT_INTENSITY,
            mesh: {
                size: DEFAULT_MOONLIGHT_RADIUS * .3,
            },
            radius: DEFAULT_MOONLIGHT_RADIUS,
            shadow: {
                frustum: DEFAULT_MOONLIGHT_RADIUS,
                mapSize: DEFAULT_MOONLIGHT_SHADOW_MAPSIZE,
            },
            visibility: { from: 18, to: 6 },
        },
        sunLight: {
            angleOffset: DEFAULT_SUNLIGHT_OFFSET,
            defaultColor: DEFAULT_SUNLIGHT_COLOR,
            defaultIntensity: DEFAULT_SUNLIGHT_INTENSITY,
            mesh: {
                size: DEFAULT_SUNLIGHT_RADIUS * .2,
            },
            radius: DEFAULT_SUNLIGHT_RADIUS,
            shadow: {
                frustum: DEFAULT_SUNLIGHT_RADIUS,
                mapSize: DEFAULT_SUNLIGHT_SHADOW_MAPSIZE,
            },
            variations: new Map<number, LightVariation>([
                [6, { color: 0xffa500, intensity: 0 }],
                [7.5, { color: 0xffffff, intensity: 1 }],
                [10, { color: 0xffffff, intensity: 2 }],
                [14, { color: 0xffffff, intensity: 2 }],
                [16.5, { color: 0xffffff, intensity: 1 }],
                [18, { color: 0xffa500, intensity: 0 }]
            ]),
            visibility: { from: 6, to: 18 },
        },
    };
};
