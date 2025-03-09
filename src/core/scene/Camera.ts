import { CAMERA_FAR, CAMERA_FOV, CAMERA_NEAR, getCameraAspect } from '@/constants/camera';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PerspectiveCamera } from 'three';
import Renderer from './Renderer';

/**
 * Singleton class representing the main camera used by the player in game.
 *
 * - Uses `THREE.PerspectiveCamera` for 3D projection.
 * - Provides a global camera instance that can be accessed from anywhere in the game.
 */
class Camera {
    /** The `THREE.PerspectiveCamera` instance used in the scene. */
    static #camera: PerspectiveCamera = new PerspectiveCamera(
        CAMERA_FOV,
        getCameraAspect(),
        CAMERA_NEAR,
        CAMERA_FAR
    );

    /**
     * Retrieves the `THREE.PerspectiveCamera` instance.
     *
     * @returns The singleton `THREE.PerspectiveCamera` instance.
     */
    public static get camera(): PerspectiveCamera {
        return this.#camera;
    }

    /**
     * Adds `THREE.OrbitControls` to the camera enabling mouse-based rotation around the scene.
     */
    public static addOrbitControls(): void {
        const controls = new OrbitControls(Camera.camera, Renderer.renderer.domElement);
        Camera.camera.position.set(2, 0, 2);
    }
}

export default Camera;
