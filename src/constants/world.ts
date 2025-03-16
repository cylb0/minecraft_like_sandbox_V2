import { Vector3 } from "three";

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
export const DEFAULT_CHUNK_DIMENSIONS = { width: 16, depth: 64 }
export const DEFAULT_NOISE_SCALE = 100;
export const DEFAULT_NOISE_AMPLITUDE = .3;
export const DEFAULT_BEDROCK_THICKNESS = 1;
export const DEFAULT_SEA_LEVEL = DEFAULT_CHUNK_DIMENSIONS.depth * .4;
export const DEFAULT_SNOW_LEVEL = DEFAULT_CHUNK_DIMENSIONS.depth * .7;
/** Max distance in chunks to be rendered around the player's position. */
export const DEFAULT_RENDER_RADIUS = 2;

// LIGHTING
/** Day duration in seconds. (max: 86400 = 24h)*/
export const DEFAULT_DAY_DURATION = 60;

export const DEFAULT_AMBIENTLIGHT_COLOR = 0xffffff;
export const DEFAULT_AMBIENTLIGHT_INTENSITY = .1;

export const DEFAULT_SUNLIGHT_COLOR = 0xffffff;
export const DEFAULT_SUNLIGHT_INTENSITY = 4;
export const DEFAULT_SUNLIGHT_SHADOW_FRUSTUM_OFFSET = ((DEFAULT_RENDER_RADIUS + 1) * DEFAULT_CHUNK_DIMENSIONS.width);
export const DEFAULT_SUNLIGHT_SHADOW_MAPSIZE = 1200;