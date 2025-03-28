/**
 * Represents the dimensions of the player model (hitbox).
 * 
 * - `width`: The player's width in world units.
 * - `height`: The player's height in world units.
 * - `depth`: The player's depth in world units.
 */
export const PLAYER_DIMENSIONS = { width: .6, height: 1.8, depth: .6 };

/** Defines the player's base spawn position in the world. */
export const PLAYER_SPAWN_POSITION = { x: 0, z: 0 };

/** Max speed on Y axis (m/s²). */
export const PLAYER_MAX_VELOCITY_Y = -200;
export const PLAYER_JUMP_VELOCITY = 6;

/** Max distance in world-units at which player can interact with blocks. */
export const PLAYER_MAX_BLOCKS_INTERACTION_DISTANCE = 3;