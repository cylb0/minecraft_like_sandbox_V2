/**
 * The number of chunks along the x an z axes.
 */
export const WORLD_SIZE = 10;

/**
 * Represents the size of a chunk in blocks.
 * 
 * - A chunk has a fixed `size` in blocks on x and z axes.
 * - It has a fixed `depth` on y axis.
 */
export const CHUNK_DIMENSIONS = { size: 16, depth: 64 }

/** Max distance in chunks to be rendered around the player's position. */
export const RENDER_CHUNK_RADIUS = 0;