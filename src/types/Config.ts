export interface WorldConfig {
    terrain: TerrainConfig;
    water: WaterConfig;
    size: WorldSizeConfig;
};

export interface TerrainConfig {
    amplitude: number;
    bedrockThickness: number;
    scale: number;
    seed: number;
    snowLevel: number;
}

export interface WorldSizeConfig {
    worldSize: number;
    chunkWidth: number;
    chunkDepth: number;
    renderRadius: number;
    blockSize: number;
}

export interface WaterConfig {
    seaLevel: number;
}