import { ColorRepresentation, Vector3 } from "three";

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
    sunLight: {
        color: ColorRepresentation;
        intensity: number;
        shadow: {
            frustum: {
                left: number;
                right: number;
                bottom: number;
                top: number;
            },
            mapSize: number;
        },
        position: Vector3;
    }
};