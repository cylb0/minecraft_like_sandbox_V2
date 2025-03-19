import { ColorRepresentation } from "three";

export interface WorldConfig {
    /** Duration of the day in seconds. */
    dayDurationInSeconds: number;
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
    moonLight: AstralLightConfig,
    sunLight: AstralLightConfig;
};

export interface AstralLightConfig {
    angleOffset: number;
    defaultColor: ColorRepresentation;
    defaultIntensity: number;
    mesh: {
        size: number;
    };
    radius: number;
    shadow: {
        frustum: number,
        mapSize: number;
    },
    variations?: Map<number, LightVariation>;
    visibility: { from: number, to: number };
};

export interface LightVariation {
    color: ColorRepresentation,
    intensity: number;
};
