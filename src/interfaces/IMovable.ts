import { Vector3 } from "three";

/**
 * Defines movement behavior for movable entities;
 */
interface IMovable {
    /** The base movement speed for the entity. */
    baseSpeed: number;
    
    /** Wether or not the entity is standing on the floor. */
    isGrounded: boolean;

    /** Direction of the movement based on inputs (or AI?). */
    readonly movementDirection: Vector3;

    /**
     * Actual velocity of the entity.
     * 
     * - Includes vertical velocity for gravity and jumps.
     */
    readonly velocity: Vector3;

    /**
     * Updates movement based on user inputs or AI logic.
     * @param delta - The elapsed time since last
     */
    move(delta: number): void;

    /**
     * Handles jump.
     */
    jump(): void;
}

export default IMovable;
