import Stats from 'three/examples/jsm/libs/stats.module.js';
import Camera from '@/core/scene/Camera';
import GameScene from '@/core/scene/GameScene';
import Player from '@/units/Player';
import Renderer from '@/core/scene/Renderer';
import World from "@/world/World";
import Physics from './Physics';
import { Scene } from 'three';

/** Time step between physics updates (in seconds = 60fps). */
const FIXED_TIME_STEP = 0.016

/** To clamp deltas (in seconds). */
const MAX_FRAME_TIME = 0.05

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
    #player: Player;

    #physics: Physics;

    /**
     * Creates a new game instance.
     * - If no player is provided, adds OrbitControl to the camera.
     * 
     * @param world - The `World` instance containing chunks and terrain.
     * @param player - The `Player` instance controlled by the user.
     */
    constructor(world: World, player: Player, scene: Scene) {
        this.#world = world;
        this.#player = player;
        this.#physics = new Physics(scene);
    }

    /**
     * Starts the game loop and begins rendering the scene.
     * 
     * - Adds FPS stats if needed.
     * - Uses fixed timestep updates to decouple physics updates from framerate.
     * - Updates player inputs and physics.
     * - Renders the scene using `Renderer singleton`.
     * - Uses `requestAnimationFrame` to create a smooth animation loop.
     * 
     * @param monitor - Wether or not to display performance monitoring.
     */
    start(monitor: boolean = false): void {
        let stats: Stats;

        if (monitor) {
            stats = new Stats();
            document.body.append(stats.dom);
        }

        let previousRenderTime = performance.now();
        let accumulator = 0

        const animate = () => {
            const currentRenderTime = performance.now();
            let delta = (currentRenderTime - previousRenderTime) / 1000;

            delta = Math.min(delta, MAX_FRAME_TIME)

            accumulator += delta
            
            this.#player.update();

            while(accumulator>= FIXED_TIME_STEP) {
                this.#physics.update(this.#player, this.#world, FIXED_TIME_STEP);
                accumulator -= FIXED_TIME_STEP
            }

            this.#world.update();
            
            Renderer.renderer.render(GameScene.scene, Camera.camera);

            if (monitor) {
                stats.update();
            }
            
            previousRenderTime = currentRenderTime;
            requestAnimationFrame(animate);
        }
        animate();
    }
}

export default Game;
