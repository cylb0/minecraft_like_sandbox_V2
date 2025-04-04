/** TERRAIN START */
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
export const DEFAULT_CHUNK_DIMENSIONS = { width: 16, depth: 128 }


export const DEFAULT_NOISE_SCALE = 180;
export const DEFAULT_NOISE_AMPLITUDE = 20;
export const DEFAULT_OCTAVES_COUNT = 5;
export const DEFAULT_OCTAVES_PERSISTENCE = .5;
export const DEFAULT_OCTAVES_LACUNARITY = 1.8;

export const DEFAULT_BEDROCK_THICKNESS = 1;
export const DEFAULT_SEA_LEVEL = DEFAULT_CHUNK_DIMENSIONS.depth * .35;
export const DEFAULT_SNOW_LEVEL = DEFAULT_CHUNK_DIMENSIONS.depth * .6;
/** Max distance in chunks to be rendered around the player's position. */
export const DEFAULT_RENDER_RADIUS = 2;

// LIGHTING
/** Day duration in seconds. (min: 10, max: 86400 = 24h)*/
export const DEFAULT_DAY_DURATION = 20 * 60;

export const DEFAULT_AMBIENTLIGHT_COLOR = 0xffffff;
export const DEFAULT_AMBIENTLIGHT_INTENSITY = .1;

export const DEFAULT_MOONLIGHT_OFFSET = Math.PI / 2;
export const DEFAULT_MOONLIGHT_COLOR = 0xffffff;
export const DEFAULT_MOONLIGHT_INTENSITY = .1;
export const DEFAULT_MOONLIGHT_RADIUS = Math.max(DEFAULT_RENDER_RADIUS * DEFAULT_CHUNK_DIMENSIONS.width * 5, DEFAULT_CHUNK_DIMENSIONS.depth * 5);
export const DEFAULT_MOONLIGHT_SHADOW_MAPSIZE = 1200;

export const DEFAULT_SUNLIGHT_OFFSET = -Math.PI / 2;
export const DEFAULT_SUNLIGHT_COLOR = 0xffffff;
export const DEFAULT_SUNLIGHT_INTENSITY = 1;
export const DEFAULT_SUNLIGHT_RADIUS = Math.max(DEFAULT_RENDER_RADIUS * DEFAULT_CHUNK_DIMENSIONS.width * 5, DEFAULT_CHUNK_DIMENSIONS.depth * 5);
export const DEFAULT_SUNLIGHT_SHADOW_MAPSIZE = 1200;

/** Gravitational acceleration (m/s²). */
export const DEFAULT_GRAVITY = 9.81;

export const DEFAULT_CLOUDS_LEVEL = DEFAULT_CHUNK_DIMENSIONS.depth * .75;
export const DEFAULT_CLOUDS_SCALE = 20;