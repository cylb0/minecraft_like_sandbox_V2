import { Vector3 } from "three";

/**
 * Defines movement behavior for movable entities;
 */
interface IMovable {
    /**
     * Updates movement based on user inputs or AI logic.
     */
    move(): void;

    /**
     * Moves the entity in a given direction
     * 
     * @param direction - The normalized direction vector (movement axis relative the entity).
     * @param multiplier - Multiplier to determine speed and direction (negative value for reverse movement).
     */
    moveDirection(direction: Vector3, multiplier: number): void;
}

export default IMovable;
