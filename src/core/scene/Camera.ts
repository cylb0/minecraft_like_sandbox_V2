import { CAMERA_FAR, CAMERA_FOV, CAMERA_NEAR, getCameraAspect } from '@/constants/camera';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PerspectiveCamera, Vector3 } from 'three';
import Renderer from '@/core/scene/Renderer';
import { DEFAULT_CHUNK_DIMENSIONS } from '@/constants/world';
import { CameraMode } from '@/types/Camera';

/**
 * Singleton class representing the main camera used by the player in game.
 *
 * - Uses `THREE.PerspectiveCamera` for 3D projection.
 * - Provides a global camera instance that can be accessed from anywhere in the game.
 */
class Camera {
    /** The `THREE.PerspectiveCamera` instance used by the player. */
    static #camera: PerspectiveCamera = new PerspectiveCamera(
        CAMERA_FOV,
        getCameraAspect(),
        CAMERA_NEAR,
        CAMERA_FAR
    );

    /** The current camera mode. */
    static #mode: CameraMode = CameraMode.FPS;

    /** Stores OrbitControls for `CameraMode.ORBIT` mode. */
    static #controls: OrbitControls | null = null;

    /** Offset for TPS mode. */
    static #tpsOffset: Vector3 = new Vector3(0, 1.5, 1);

    /**
     * @returns The singleton `THREE.PerspectiveCamera` instance.
     */
    static get camera(): PerspectiveCamera {
        return this.#camera;
    }

    /**
     * @returns The active camera mode.
     */
    static get mode(): CameraMode {
        return this.#mode;
    }

    /**
     * @returns the active `OrbitControls` instance or `null` if disabled.
     */
    static get controls(): OrbitControls | null {
        return this.#controls;
    }

    /**
     * @returns the TPS offset.
     */
    static get tpsOffset(): Vector3 {
        return this.#tpsOffset;
    }

    /**
     * Switches between camera modes.
     * 
     * @param mode - The `Camera` mode to switch to.
     */
    static switchCamera(mode: CameraMode) {
        this.#mode = mode;

        if (mode === CameraMode.ORBIT) {
            this.#addOrbitControls();
        } else {
            this.#removeOrbitControls();
        }
    }

    /** Updates the camera's aspect and projection matrix for when window resizes. */
    static updateAspectRatio(): void {
        this.#camera.aspect = getCameraAspect();
        this.#camera.updateProjectionMatrix();
    }

    /**
     * Adds `THREE.OrbitControls` to the camera enabling mouse-based rotation around the scene.
     */
    static #addOrbitControls(): void {
        this.#controls = new OrbitControls(this.#camera, Renderer.renderer.domElement);
        this.#controls.target.set(0, DEFAULT_CHUNK_DIMENSIONS.depth / 2, 0);
        this.#controls.enableZoom = true;
        this.#controls.update();
    }

    /** Removes the OrbitControls when switching to another mode. */
    static #removeOrbitControls(): void {
        if (this.#controls) {
            this.#controls.dispose();
            this.#controls = null;
        }
    }
}

export default Camera;
