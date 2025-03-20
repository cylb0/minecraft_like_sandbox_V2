import { DEFAULT_BLOCK_SIZE } from "@/constants/block";
import { PLAYER_DIMENSIONS, PLAYER_SPAWN_POSITION } from "@/constants/player";
import Camera from "@/core/scene/Camera";
import IMovable from "@/interfaces/IMovable";
import World from "@/world/World";
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Scene, Vector3 } from "three";

/**
 * Represents the player.
 * @extends {Group} For easier rendering.
 */
class Player extends Group implements IMovable {
    #scene: Scene;
    #world: World;

    /**
     * Creates a new `Player` instance.
     * 
     * - Initializes movement, camera and event listeners.
     *
     * @param scene - The `THREE.Scene` to render the player in.
     * @param camera - The `THREE.Camera` attached to the player.
     * @param world - The `World` instance managing chunks and blocks.
     */
    constructor(scene: Scene, camera: PerspectiveCamera, world: World) {
        super();
        this.#scene = scene;
        this.#world = world;
        this.add(camera);

        const playerModel = this.#createPlayer();
        this.add(playerModel);
        this.position.copy(new Vector3(PLAYER_SPAWN_POSITION.x, PLAYER_SPAWN_POSITION.y, PLAYER_SPAWN_POSITION.z));

        scene.add(this);
    }

    move(): void {
        throw new Error("Method not implemented.");
    }

    moveDirection(direction: Vector3, multiplier: number): void {
        throw new Error("Method not implemented.");
    }
    /**
     * Finds a safe spawn for the player.
     *
     * - Based on {x, z} world-coordinates, retrieve an empty.
     * - Adds player offset.
     * - Adds block Yoffset.
     * 
     * @returns The correct spawn position.
     */
    #findSpawn(): Vector3 {
        const { x, z } = PLAYER_SPAWN_POSITION;
        const freeSpot = this.#world.findSPawnPosition(x, z);

        return freeSpot.add(this.#getPlayerPositionOffset());
    }

    /**
     * Computes the player Y-offset needed to calculate actual position.
     * 
     * - Player's position is offset by half his height.
     * - Also includes the block Offset as its position is centered.
     * 
     * @returns The player's position offset.
     */
    #getPlayerPositionOffset(): Vector3 {
        return new Vector3(0, (PLAYER_DIMENSIONS.height / 2) + (DEFAULT_BLOCK_SIZE / 2), 0);
    }

    /**
     * Creates and returns a `THREE.Mesh` representing the player.
     *
     * - Generates a box-shaped mesh using predefined dimensions.
     *
     * @returns A `THREE.Mesh` representing the player.
     */
    #createPlayer(): Mesh {
        const playerGeometry = new BoxGeometry(PLAYER_DIMENSIONS.width, PLAYER_DIMENSIONS.height, PLAYER_DIMENSIONS.depth);
        const playerMaterial = new MeshBasicMaterial({ color: 0x0000ff });
        return new Mesh(playerGeometry, playerMaterial);
    }
}

export default Player;
