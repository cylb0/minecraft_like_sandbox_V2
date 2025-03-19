import Stats from 'three/examples/jsm/libs/stats.module.js';
import Camera from '@/core/scene/Camera';
import GameScene from '@/core/scene/GameScene';
import Player from '@/units/Player';
import Renderer from '@/core/scene/Renderer';
import World from "@/world/World";

/**
 * Manages the game logic, rendering and utilities.
 * 
 * - Handles the game loop and rendering updates.
 * - Manages the `Player` and `World` instances.
 */
class Game {
    /** The world instance containing chunks and terrain. */
    #world: World;

    /** The player instance controlled by the user. */
    #player?: Player;

    /**
     * Creates a new game instance.
     * - If no player is provided, adds OrbitControl to the camera.
     * 
     * @param world - The `World` instance containing chunks and terrain.
     * @param player - The `Player` instance controlled by the user.
     */
    constructor(world: World, player?: Player) {
        this.#world = world;
        this.#player = player;
    }

    /**
     * Starts the game loop and begins rendering the scene.
     * 
     * - Renders the scene using `Renderer singleton`.
     * - Uses `requestAnimationFrame` to create a smooth animation loop.
     */
    start(): void {
        // const stats = new Stats();
        // document.body.append(stats.dom);

        const animate = () => {
            const canvas = Renderer.renderer.domElement;
            // stats.update();
            const camera = Renderer.useOrbitCamera ? Camera.orbitCamera : Camera.playerCamera;

            this.#world.sunLight?.update();
            this.#world.moonLight?.update();

            Renderer.renderer.render(GameScene.scene, camera);
            requestAnimationFrame(animate);
        }
        animate();
    }
}

export default Game;
