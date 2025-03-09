import { AxesHelper, BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import GameScene from "@/core/scene/GameScene";
import { BLOCK_SIZE } from "@/constants/block";

/**
 * A utility service for rendering game related visual helpers
 */
class GameHelper {
    /**
     * Displays an example cube in the scene.
     */
    public static displayExampleCube(): void {
        const geometry = new BoxGeometry(BLOCK_SIZE);
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
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
        const axesHelper = new AxesHelper(10);
        GameScene.scene.add(axesHelper);
    }
}

export default GameHelper;
