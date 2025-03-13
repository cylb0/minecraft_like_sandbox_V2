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
export const DEFAULT_AMBIENTLIGHT_COLOR = 0xffffff;
export const DEFAULT_AMBIENTLIGHT_INTENSITY = .1;

export const DEFAULT_SUNLIGHT_COLOR = 0xffffff;
export const DEFAULT_SUNLIGHT_INTENSITY = 1;
export const DEFAULT_SUNLIGHT_SHADOW_FRUSTUM_OFFSET = 40;
export const DEFAULT_SUNLIGHT_SHADOW_FRUSTUM = {
    left: -DEFAULT_SUNLIGHT_SHADOW_FRUSTUM_OFFSET,
    right: DEFAULT_SUNLIGHT_SHADOW_FRUSTUM_OFFSET,
    bottom: -DEFAULT_SUNLIGHT_SHADOW_FRUSTUM_OFFSET,
    top: DEFAULT_SUNLIGHT_SHADOW_FRUSTUM_OFFSET,
};
export const DEFAULT_SUNLIGHT_POSITION = new Vector3(DEFAULT_CHUNK_DIMENSIONS.width, DEFAULT_CHUNK_DIMENSIONS.depth, -DEFAULT_CHUNK_DIMENSIONS.width * DEFAULT_WORLD_SIZE);
export const DEFAULT_SUNLIGHT_SHADOW_MAPSIZE = 1200;