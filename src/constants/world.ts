export const DEFAULT_SEED = 0;

/**
 * The number of chunks along the x an z axes.
 */
export const DEFAULT_WORLD_SIZE = 2;

/**
 * Represents the size of a chunk in blocks.
 * 
 * - A chunk has a fixed `size` in blocks on x and z axes.
 * - It has a fixed `depth` on y axis.
 */
export const DEFAULT_CHUNK_DIMENSIONS = { width: 16, depth: 64 }

/** Max distance in chunks to be rendered around the player's position. */
export const DEFAULT_RENDER_RADIUS = 2;

/** Noise scale. */
export const DEFAULT_NOISE_SCALE = 100;

/** Noise amplitude. */
export const DEFAULT_NOISE_AMPLITUDE = .3;

export const DEFAULT_SEA_LEVEL = DEFAULT_CHUNK_DIMENSIONS.depth * .4;
export const DEFAULT_WATER_OFFSET = 2;

export const DEFAULT_SNOW_LEVEL = DEFAULT_CHUNK_DIMENSIONS.depth * .7;

export const DEFAULT_BEDROCK_THICKNESS = 1;