import { BlockType } from "@/types/Blocks";
import Player from "@/units/Player";
import World from "@/world/World";
import { Box3Helper } from "three";
import { Box3, Group, Scene, Vector3 } from "three";
import { epsilonSign } from "@/helpers/MathUtils";
import { PLAYER_MAX_VELOCITY_Y } from "@/constants/player";
import { getBlockBoundingBox, getCollisionRange, isBlockSolid, sortCollisionsByOverlap } from "@/helpers/PhysicsHelper";
import { DEFAULT_GRAVITY } from "@/constants/world";

class Physics {
    #helpers = new Group();

    constructor(scene: Scene) {
        scene.add(this.#helpers);
    }

    /**
     * Updates the player's physics state.
     * 
     * - Applies gravity to the player's y-axis velocity.
     * - Moves the player based on his current velocity (gravity + inputs).
     * - Checks and resolves collisions with nearby blocks.
     * 
     * @param player - The `Player` to apply physics to.
     * @param world - The `World` object containing blocks.
     * @param delta - The elapsed time since last render (in seconds).
     */
    update(player: Player, world: World, delta: number): void {
        this.#helpers.clear();

        if (!player.isGrounded) {
            this.#applyGravity(player, delta);
        }

        player.move(delta);

        this.#handleCollisions(player, world)
    }

    /**
     * Applies gravity on the player.
     * 
     * @param player - The player to apply gravity to.
     * @param delta - The amount of time passed since last render.
     */
    #applyGravity(player: Player, delta: number): void {
        player.velocity.y -= DEFAULT_GRAVITY * delta;
        player.velocity.y = Math.max(player.velocity.y, PLAYER_MAX_VELOCITY_Y)
    }

    /**
     * Computes the overlap between player and block.
     * @returns A `Vector3` representing the overlap.
     */
    #computeOverlap(playerBox: Box3, blockBox: Box3): Vector3 | null {
        if (!playerBox.intersectsBox(blockBox)) return null;

        const intersection = playerBox.clone().intersect(blockBox);
        if (intersection.isEmpty()) return null;

        return intersection.getSize(new Vector3());
    }

    /**
     * Finds which candidate blocks are actually colliding with the player.
     * 
     * @param candidates - An array of `Vector3` representing blocks positions.
     * @param player - The player to check collisions with.
     * @param helper - A boolean to toggle display `Box3Helper` for colliding blocks.
     * @returns An array of `Box3` blocks the player is colliding with.
     */
    #getCollisions(candidates: Array<Vector3>, player: Player, helper: boolean = false): Array<Box3> {
        const collisions: Array<Box3> = []
        const playerBox = player.boundingBox
        for (const position of candidates) {
            const blockBox = getBlockBoundingBox(position.x, position.y, position.z)
            if (!playerBox.intersectsBox(blockBox)) continue;

            const overlap = this.#computeOverlap(playerBox, blockBox);
            if (!overlap) continue;

            const overlapAxes = [overlap.x > 0, overlap.y > 0, overlap.z > 0].filter(Boolean).length;
            if (overlapAxes < 2) continue;

            collisions.push(blockBox);

            if (helper) {
                const boxHelper = new Box3Helper(blockBox, 0xffff00);
                this.#helpers.add(boxHelper);
            }
        }
        return collisions
    }

    /**
     * Retrieves positions of all non-empty solid blocks within a given range.
     * 
     * @param range - An object defining the min and max coordinates on each axis.
     * @param world - The `World` containing the blocks.
     * @returns An array of `Vector3` that are positions of blocks found in the range.
     */
    #getSolidBlocksPositionInRange(range: {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
        minZ: number;
        maxZ: number;
    }, world: World): Array<Vector3> {
        const candidates: Array<Vector3> = []
        for (let x = range.minX; x <= range.maxX; x++) {
            for (let y = range.minY; y <= range.maxY; y++) {
                for (let z = range.minZ; z <= range.maxZ; z++) {
                    const block = world.getBlock(x, y, z);
                    if (
                        !block || 
                        block.blockType === BlockType.Empty ||
                        !isBlockSolid(block.blockType)
                    ) continue;
                    
                    candidates.push(new Vector3(x, y, z))
                }
            }
        }
        return candidates
    }

    /**
     * Handles collision detection and resolution between player and blocks.
     * 
     * @param player - The player to check collision for.
     * @param world - The world containing blocks.
     * @returns `true` if any collision was resolved.
     */
    #handleCollisions(player: Player, world: World): boolean {
        const playerBox = player.boundingBox;
        const range = getCollisionRange(playerBox);
        const candidates = this.#getSolidBlocksPositionInRange(range, world);
        const collisions = this.#getCollisions(candidates, player)

        if (collisions.length === 0) {
            player.setIsGrounded(false);
            return false;
        }

        this.#resolveCollision(player, collisions);

        let isGrounded = false;
        for (const collision of collisions) {
            if (this.#isGroundBlock(player, collision)) {
                isGrounded = true;
                player.setIsGrounded(true)
                break;
            }
        }

        player.setIsGrounded(isGrounded)

        return true;
    }

    /**
     * Checks wether a given block is the ground block directly below player.
     * 
     * @param player - The player object.
     * @param box - The `Box3` representing the block.
     * @returns `true` if the player is standing on that block, `false` otherwise.
     */
    #isGroundBlock(player: Player, box: Box3): boolean {
        return player.boundingBox.min.y === box.max.y;
    }

    /**
     * Resolves collision on the axis with the smallest overlap between player and block.
     * 
     * @param player - The player to resolve collision for.
     * @param blockBox - The bounding box of the block colliding with the player.
     * @param overlap - The overlap vector representing how deep the player is in.
     */
    #resolveAxisCollision(player: Player, blockBox: Box3, overlap: Vector3): void {
        const playerCenter = player.boundingBox.getCenter(new Vector3());
        const blockCenter = blockBox.getCenter(new Vector3());
        const delta = playerCenter.clone().sub(blockCenter);

        if (overlap.y <= overlap.x && overlap.y <= overlap.z) {
            this.#resolveY(player, blockBox, overlap.y, delta.y);
        } else if (overlap.x <= overlap.z) {
            this.#resolveXZ('x', player, overlap.x, delta.x);
        } else {
            this.#resolveXZ('z', player, overlap.z, delta.z);
        }
    }

    /**
     * Resolves horizontal collision.
     * 
     * @param axis - The horizontal axis `'x' | 'z'` along which collision needs resolution.
     * @param player - The player to adjust position of.
     * @param overlap - The overlap (penetration) along the axis.
     * @param delta - The difference between player's and block's position on the axis.
     */
    #resolveXZ(axis: 'x' | 'z', player: Player, overlap: number, delta: number): void {
        player.position[axis] += epsilonSign(delta) * overlap;
        player.velocity[axis] = 0;
    }

    /**
     * Resolves vertical collision.
     * 
     * - Uses the block's bounding box to position player right on top.
     * 
     * @param player - The player to adjust position of.
     * @param blockBox - The bounding box of the block colliding with the player.
     * @param overlap - The overlap (penetration) along the Y-axis.
     * @param delta - The difference between player's and block's position on the Y-axis.
     */
    #resolveY(player: Player, blockBox: Box3, overlap: number, delta: number): void {
        const correction = epsilonSign(delta) * overlap;
        player.position.y += correction;
        player.velocity.y = 0;
        
        if (correction > 0) {
            player.setIsGrounded(true);
            player.position.y = blockBox.max.y;
        }
    }

    /**
     * Resolves collision between a player and block (represented by its bounding box).
     * 
     * - Uses both player and colliding element to compute an intersection box.
     * - Get the size of the box (how deep the player is in the colliding element).
     * 
     * @param player - The player to resolve collision for.
     * @param blockBox - The `Box3` representing the block the player is colliding with.
     */
    #resolveCollision(player: Player, collisions: Box3[]): void {
        collisions = sortCollisionsByOverlap(player, collisions);
    
        for (const blockBox of collisions) {
            const overlap = this.#computeOverlap(player.boundingBox, blockBox)
            if (!overlap) continue;

            this.#resolveAxisCollision(player, blockBox, overlap);
        }
    }
}

export default Physics;
