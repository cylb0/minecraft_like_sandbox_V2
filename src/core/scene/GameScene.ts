import { Scene } from 'three';

/**
 * Singleton class responsible for managing the `THREE.Scene`.
 *
 * - Uses the `THREE.Scene` to hold all objects.
 * - Provides a global renderer instance that can be accessed from anywhere.
 * - Allows resetting the scene when needed.
 */
class GameScene {
    /** The `THREE.Scene` instance used to render the scene. */
    static #scene: Scene = new Scene();

    /**
     * Retrieves the `THREE.Scene` instance.
     *
     * @returns The `THREE.WebGLRenderer` instance.
     */
    static get scene(): Scene {
        return this.#scene;
    }
    
    /**
     * Resets the scene by clearing all objects.
     */
    static reset(): void {
        const scene = GameScene.scene;
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
    }
}
    
export default GameScene;
