import { DEFAULT_BLOCK_SIZE } from "@/constants/block";
import { PLAYER_DIMENSIONS, PLAYER_SPAWN_POSITION } from "@/constants/player";
import Camera from "@/core/scene/Camera";
import IMovable from "@/interfaces/IMovable";
import { CameraMode } from "@/types/Camera";
import World from "@/world/World";
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Vector3 } from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

/**
 * Represents the player.
 * @extends {Group} For easier rendering.
 */
class Player extends Group implements IMovable {
    #camera: PerspectiveCamera;
    #scene: Scene;
    #world: World;
    #model: Mesh;

    /** PointerLockControls used for FPS only. */
    #pointerLockControls?: PointerLockControls;

    /** Locks pointer. */
    #onClickLock = () => {
        this.#pointerLockControls?.lock();
    }

    /**
     * Creates a new `Player` instance.
     * 
     * @param scene - The `THREE.Scene` to render the player in.
     * @param camera - The `THREE.Camera` attached to the player.
     * @param world - The `World` instance managing chunks and blocks.
     */
    constructor(scene: Scene, camera: PerspectiveCamera, world: World) {
        super();
        this.#camera = camera;
        this.#scene = scene;
        this.#world = world;
        
        this.#model = this.#createPlayer();
        
        this.position.copy(this.#findSpawn());

        scene.add(this);

        this.#attachCamera();
        if (Camera.mode !== CameraMode.FPS) {
            this.add(this.#model);
        }
        
        this.#setupPointerLock();

        document.addEventListener("keyup", (event) => {
            if (event.code === "KeyK") this.toggleCamera();
        })
    }

    move(): void {
        throw new Error("Method not implemented.");
    }

    moveDirection(direction: Vector3, multiplier: number): void {
        throw new Error("Method not implemented.");
    }

    /**
     * Toggles player's camera mode between FPS and TPS.
     */
    toggleCamera(): void {
        const mode = Camera.mode === CameraMode.FPS ? CameraMode.TPS : CameraMode.FPS;
        this.#switchCamera(mode);
    }

    /**
     * Attaches the camera the the Player Group.
     *
     * - Moves camera's position to the player's head if FPS mode.
     * - Offsets camera's position if TPS mode.
     */
    #attachCamera() {
        if (!this.children.includes(this.#camera)) {
            this.add(this.#camera);
        }

        const mode = Camera.mode;

        if (mode === CameraMode.FPS) {
            this.#camera.position.set(0, PLAYER_DIMENSIONS.height * 3 / 4, 0);
        } else if (mode === CameraMode.TPS) {
            const offset = Camera.tpsOffset;
            this.#camera.position.set(offset.x, offset.y, offset.z);
            this.#camera.lookAt(this.position);
        }
    }

    /**
     * Disconnects pointer lock controls and removes associated event from document.
     */
    #disposePointerLock(): void {
        if (this.#pointerLockControls) {
            this.#pointerLockControls.disconnect();
        }

        document.removeEventListener("click", this.#onClickLock)
    }

    /**
     * Removes player model from the Group if it is included.
     */
    #hideModel(): void {
        if (this.children.includes(this.#model)) {
            this.remove(this.#model);
        }
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
        const freeSpot = this.#world.findSpawnPosition(x, z);

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

    /**
     * Sets up pointer lock controls for FPS mouse tracking.
     * Attaches a click listener to the document to lock pointer.
     */
    #setupPointerLock(): void {
        if (!this.#pointerLockControls) {
            this.#pointerLockControls = new PointerLockControls(this.#camera, document.body);
        }

        this.#pointerLockControls.connect();

        document.addEventListener("click", this.#onClickLock)
    }

    /**
     * Adds player model to the Group if it is not already included.
     */
    #showModel(): void {
        if (!this.children.includes(this.#model)) {
            this.add(this.#model);
        }
    }

    /**
     * Switches camera to a given `CameraMode`.
     * - Toggles player model visibility accordingly.
     */
    #switchCamera(mode: CameraMode): void {
        Camera.switchCamera(mode);

        if (mode === CameraMode.FPS) {
            this.#hideModel();
            this.#setupPointerLock();
            this.#pointerLockControls?.lock();
        } else if (mode === CameraMode.TPS) {
            this.#showModel();
            this.#setupPointerLock();
            this.#pointerLockControls?.lock();
        } else {
            this.#disposePointerLock();
        }
        this.#attachCamera();
    }
}

export default Player;
