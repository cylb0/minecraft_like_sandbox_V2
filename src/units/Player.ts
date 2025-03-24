import { DEFAULT_BLOCK_SIZE } from "@/constants/block";
import { PLAYER_DIMENSIONS, PLAYER_SPAWN_POSITION } from "@/constants/player";
import Camera from "@/core/scene/Camera";
import IMovable from "@/interfaces/IMovable";
import { CameraMode } from "@/types/Camera";
import World from "@/world/World";
import { Box3, BoxGeometry, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Vector3 } from "three";
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

    #keys: { [key: string]: boolean } = {};

    baseSpeed: number = 5;
    #isGrounded = false;
    #velocity: Vector3 = new Vector3();

    /** Locks pointer. */
    #onClickLock = () => {
        this.#pointerLockControls?.lock();
    }

    /** __tests__ ONLY */
    pressKey?(code: string): void;
    releaseKey?(code: string): void;

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

        this.#initListeners();

        if (process.env.NODE_ENV === "test") {
            this.pressKey = (code: string) => {
                this.#keys[code] = true;
            };
            this.releaseKey = (code: string) => {
                this.#keys[code] = false;
            }
        }
    }

    get isGrounded(): boolean {
        return this.#isGrounded;
    }

    setIsGrounded(isGrounded: boolean): void {
        this.#isGrounded = isGrounded;
    }

    get model(): Mesh {
        return this.#model;
    }

    get velocity(): Vector3 {
        return this.#velocity;
    }

    /**
     * Moves the player.
     * 
     * - Handle key inputs.
     * 
     * @param delta - The elapsed time since last render (in ms).
     */
    move(delta: number): void {
        const direction = this.#computeMovementDirection();

        if (direction.lengthSq() > 0) {
            direction.normalize().multiplyScalar(this.baseSpeed);
            this.velocity.x = direction.x;
            this.velocity.z = direction.z;

            this.position.add(this.velocity.clone().multiplyScalar(delta));
        }
    }

    jump(): void {
        throw new Error("Method not implemented.");
    }

    /**
     * Computes and returns an **axis-aligned bounding box** for the player.
     * 
     * - Overrides `getBoundingBox()` from `Collidable`.
     * - Ignores player's rotation to prevent weird collision behavior.
     * 
     * @returns The current axis-aligned bounding box of the object.
     */
    get boundingBox(): Box3 {
        const currentPosition = this.position.clone();
        return new Box3().setFromCenterAndSize(
            currentPosition,
            new Vector3(PLAYER_DIMENSIONS.width, PLAYER_DIMENSIONS.height, PLAYER_DIMENSIONS.depth)
        );
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
    #attachCamera(): void {
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
     * Computes the combined movement based on keyboard inputs.
     *
     * - Uses the camera's forward and right vectors flattend on (x, z) axes.
     * - Adds forward / right based on inputs.
     * 
     * @returns The final movement direction vector. 
     */
    #computeMovementDirection(): Vector3 {
        const forward = this.#getForwardDirection();
        forward.y = 0;
        const right = this.#getRightDirection();

        const move = new Vector3();

        if (this.#keys['KeyW']) move.add(forward);
        if (this.#keys['KeyS']) move.sub(forward);
        if (this.#keys['KeyA']) move.add(right);
        if (this.#keys['KeyD']) move.sub(right);

        return move;
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
        const playerMaterial = new MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
        return new Mesh(playerGeometry, playerMaterial);
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
     * Adds listeners for player inputs.
     */
    #initListeners(): void {
        document.addEventListener('keydown', this.#onKeyDown.bind(this));
        document.addEventListener('keyup', this.#onKeyUp.bind(this));
    }

    /**
     * Computes the forward direction based on the camera's orientation.
     *
     * @returns A normalized `THREE.Vector3` representing the forward direction.
     */
    #getForwardDirection(): Vector3 {
        return this.#camera
            .getWorldDirection(new Vector3())
            .normalize();
    }

    /**
     * Computes the right direction relative to the camera's orientation.
     * It is calculated using the cross product of the camera's up vector and the forward direction
     *
     * @returns A normalized `THREE.Vector3` representing the rightward direction.
     */
    #getRightDirection(): Vector3 {
        return new Vector3()
            .crossVectors(this.#camera.up, this.#getForwardDirection())
            .normalize();
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
     * Handles key press events by setting the corresponding key state to `true`.
     * 
     * @param event - The keyboard event containing the key code.
     */
    #onKeyDown(event: KeyboardEvent): void {
        this.#keys[event.code] = true;
    }

    /**
     * Handles key press events by setting the corresponding key state to `false`.
     *
     * @param event - The keyboard event containing the key code.
     */
    #onKeyUp(event: KeyboardEvent): void {
        this.#keys[event.code] = false;
    }

    /**
     * Sets up pointer lock controls for FPS mouse tracking.
     * Attaches a click listener to the document to lock pointer.
     */
    #setupPointerLock(): void {
        if (!this.#pointerLockControls) {
            this.#pointerLockControls = new PointerLockControls(this.#camera, document.body);
            this.#pointerLockControls.minPolarAngle = Math.PI / 4
            this.#pointerLockControls.maxPolarAngle = Math.PI * 3 / 4
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
