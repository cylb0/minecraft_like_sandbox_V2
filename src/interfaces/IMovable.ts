import { Vector3 } from "three";

/**
 * Defines movement behavior for movable entities;
 */
interface IMovable {
    baseSpeed: number;

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
