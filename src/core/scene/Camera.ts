import { CAMERA_FAR, CAMERA_FOV, CAMERA_NEAR, getCameraAspect } from '@/constants/camera';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PerspectiveCamera, Vector3 } from 'three';
import Renderer from '@/core/scene/Renderer';
import { DEFAULT_CHUNK_DIMENSIONS } from '@/constants/world';

/**
 * Singleton class representing the main camera used by the player in game.
 *
 * - Uses `THREE.PerspectiveCamera` for 3D projection.
 * - Provides a global camera instance that can be accessed from anywhere in the game.
 */
class Camera {
    /** The `THREE.PerspectiveCamera` instance used by the player. */
    static #playerCamera: PerspectiveCamera = new PerspectiveCamera(
        CAMERA_FOV,
        getCameraAspect(),
        CAMERA_NEAR,
        CAMERA_FAR
    );

    /** The orbit controls camera. */
    static #orbitCamera: PerspectiveCamera = new PerspectiveCamera(
        CAMERA_FOV,
        getCameraAspect(),
        CAMERA_NEAR,
        CAMERA_FAR
    );

    /**
     * @returns The singleton `THREE.PerspectiveCamera` instance.
     */
    static get playerCamera(): PerspectiveCamera {
        return this.#playerCamera;
    }

    /**
     * @returns The singleton `THREE.PerspectiveCamera` instance.
     */
    static get orbitCamera(): PerspectiveCamera {
        return this.#playerCamera;
    }

    /**
     * Adds `THREE.OrbitControls` to the camera enabling mouse-based rotation around the scene.
     * 
     * - Creates a new OrbitControls object.
     * - Updates the camera's position.
     * - Force camera to look at origin.
     * 
     * @param position - The `THREE.Vector3` new position of the camera.
     */
    static addOrbitControls(position: Vector3): void {
        const controls = new OrbitControls(Camera.orbitCamera, Renderer.renderer.domElement);
        Camera.orbitCamera.position.copy(position);
        controls.target.set(0, DEFAULT_CHUNK_DIMENSIONS.depth / 2, 0);
    }
}

export default Camera;
