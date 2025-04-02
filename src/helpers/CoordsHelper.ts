import { modulo } from "./MathUtils";

/**
 * Operations to convert coordinates from reference frame to another.
 */
class CoordsHelper {
    /**
     * Converts world {x, z} coordinates to the indexes of the chunk that contains this point.
     * 
     * @param worldX - The world x-coordinate.
     * @param worldZ - The world z-coordinate.
     * @param chunkWidth - The width of a chunk.
     * @returns An object containing chunk x and z indexes in world grid.
     */
    static worldToChunkCoords(worldX: number, worldZ: number, chunkWidth: number): {
        xIndex: number,
        zIndex: number
    } {
        return {
            xIndex: Math.floor(worldX / chunkWidth),
            zIndex: Math.floor(worldZ / chunkWidth),
        }
    }

    /**
     * Converts world {x, y, z} coordinates to local (in-chunk) coordinates.
     * 
     * @param worldX - The world x-coordinate.
     * @param worldY - The world y-coordinate.
     * @param worldZ - The world z-coordinate.
     * @param chunkWidth - The width of a chunk.
     * @returns An object containing chunk x and z indexes in world grid.
     */
    static worldToLocalCoords(worldX: number, worldY: number, worldZ: number, chunkWidth: number): {
        x: number,
        y: number,
        z: number
    } {
        return {
            x: modulo(worldX, chunkWidth),
            y: worldY,
            z: modulo(worldZ, chunkWidth),
        }
    }
}

export default CoordsHelper;
