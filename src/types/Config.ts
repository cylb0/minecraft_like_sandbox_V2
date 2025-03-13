export interface WorldConfig {
    terrain: TerrainConfig;
    size: WorldSizeConfig;
};

export interface TerrainConfig {
    amplitude: number;
    bedrockThickness: number;
    scale: number;
    seed: number;
    seaLevel: number;
    snowLevel: number;
}

export interface WorldSizeConfig {
    worldSize: number;
    chunkWidth: number;
    chunkDepth: number;
    renderRadius: number;
    blockSize: number;
}
