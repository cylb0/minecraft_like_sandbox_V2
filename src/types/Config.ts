import { ColorRepresentation } from "three";

export interface WorldConfig {
    terrain: TerrainConfig;
    water: WaterConfig;
    size: WorldSizeConfig;
    light: LightingConfig;
};

export interface TerrainConfig {
    amplitude: number;
    bedrockThickness: number;
    scale: number;
    seed: number;
    snowLevel: number;
};

export interface WorldSizeConfig {
    worldSize: number;
    chunkWidth: number;
    chunkDepth: number;
    renderRadius: number;
    blockSize: number;
};

export interface WaterConfig {
    seaLevel: number;
};

export interface LightingConfig {
    ambientLight: {
        color: ColorRepresentation;
        intensity: number;
    },
    sunLight: DayNightLightConfig;
};

export interface DayNightLightConfig {
    color: ColorRepresentation;
    /** Duration of the day in seconds. */
    dayDuration: number;
    intensity: number;
    radius: number;
    shadow: {
        frustum: number,
        mapSize: number;
    },
};
