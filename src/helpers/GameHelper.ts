import { AxesHelper, BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import GameScene from "@/core/scene/GameScene";
import { DEFAULT_BLOCK_SIZE } from "@/constants/block";

/**
 * A utility service for rendering game related visual helpers
 */
class GameHelper {
    /**
     * Displays an example cube in the scene.
     */
    public static displayExampleCube(): void {
        const geometry = new BoxGeometry(DEFAULT_BLOCK_SIZE);
        const material = new MeshLambertMaterial({ color: 0x00ff00 });
        const cube = new Mesh(geometry, material);
        GameScene.scene.add(cube);
    }

    /**
     * Displays a `THREE.AxesHelper` in the scene.
     * 
     * - Helper indicates the X (red), Y (green) and Z (blue) axes.
     * - Size is determined by the largest world dimension.
     */
    public static displayAxesHelper(): void {
        const axesHelper = new AxesHelper(100);
        GameScene.scene.add(axesHelper);
    }
}

export default GameHelper;
