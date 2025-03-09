import { WebGLRenderer } from 'three';
import Camera from '@/core/scene/Camera';
import { getCameraAspect } from '@/constants/camera';

/**
 * Singleton class responsible for rendering the scene.
 *
 * - Uses the `THREE.WebGLRenderer` to render 3D objects.
 * - Provides a global renderer instance that can be accessed from anywhere in the game.
 * - Handles window resiszing to maintain aspect ratio.
 */
class Renderer {
       /** The `THREE.WebGLRenderer` instance used to render the scene. */
    static #renderer: WebGLRenderer = new WebGLRenderer();

    static {
        this.#renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.#renderer.domElement);
        window.addEventListener('resize', Renderer.#onResize.bind(Renderer));
    }

    /**
     * Retrieves the `THREE.WebGLRenderer` instance.
     *
     * @returns The `THREE.WebGLRenderer` instance.
     */
    static get renderer(): WebGLRenderer {
        return this.#renderer;
    }

    /**
     * Handles the renderer and camera to match window size.
     *
     * - Updates the camera aspect ratio and projection matrix.
     * - Resizes the renderer based on the new window size.
     */
    static #onResize(): void {
        const camera = Camera.camera;
        camera.aspect = getCameraAspect();
        camera.updateProjectionMatrix();
        this.#renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export default Renderer;
