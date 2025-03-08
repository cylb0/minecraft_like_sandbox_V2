import { PLAYER_DIMENSIONS, PLAYER_SPAWN_POSITION } from "@/constants/player";
import IMovable from "@/interfaces/IMovable";
import World from "@/world/World";
import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Object3D, PerspectiveCamera, Scene, Vector3 } from "three";

class Player implements IMovable {
    #camera: PerspectiveCamera
    #object: Object3D;
    #scene: Scene;
    #world: World;

    /**
     * Creates a new `Player` instance.
     * 
     * - Initializes movement, camera and event listeners.
     * - Calls `render()` to create the player model.
     *
     * @param camera - The `THREE.Camera` attached to the player.
     * @param world - The `World` instance managing chunks and blocks.
     */
    constructor(scene: Scene, camera: PerspectiveCamera, world: World) {
        this.#camera = camera;
        this.#scene = scene;
        this.#world = world;

        const playerGroup = new Group();
        const playerModel = this.#createPlayer();
        playerGroup.add(playerModel);

        this.#object = playerGroup;
        this.#object.position.copy(new Vector3(PLAYER_SPAWN_POSITION.x, PLAYER_SPAWN_POSITION.y, PLAYER_SPAWN_POSITION.z));
        this.#object.add(camera)

        this.#addToScene();
    }

    move(): void {
        throw new Error("Method not implemented.");
    }

    moveDirection(direction: Vector3, multiplier: number): void {
        throw new Error("Method not implemented.");
    }

    get object(): Object3D {
        return this.#object;
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
        const playerMaterial = new MeshStandardMaterial({ color: 0x0000ff });
        return new Mesh(playerGeometry, playerMaterial);
    }

    /**
     * Adds the player to the scene.
     */
    #addToScene(): void {
        if (!this.#scene.children.includes(this.object)) {
            this.#scene.add(this.object);
        }
    } 
}

export default Player;
