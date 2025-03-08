import { CHUNK_DIMENSIONS } from "@/constants/world";

/**
 * Represents the dimensions of the player model (hitbox).
 * 
 * - `width`: The player's width in world units.
 * - `height`: The player's height in world units.
 * - `depth`: The player's depth in world units.
 */
export const PLAYER_DIMENSIONS = { width: .5, height: 2, depth: .5 };

/** Defines the player's base spawn position in the world. */
export const PLAYER_SPAWN_POSITION = { x: -5, y: CHUNK_DIMENSIONS.depth, z: -5 };