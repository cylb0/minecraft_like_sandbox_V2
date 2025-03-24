jest.unmock("three");

import { DEFAULT_BLOCK_SIZE } from "@/constants/block"
import Physics from "@/core/Physics"
import { Box3, Scene, Vector3 } from "three";

describe("Physics", () => {
    let physics: Physics;
    let scene: Scene;

    beforeEach(() => {
        scene = new Scene();
        physics = new Physics(scene);
    })

    describe("getBlockBoundingBox", () => {
        it("should return a Box3 with correct settings", () => {
            const position = new Vector3(1, 2, 3);
            const box = physics.getBlockBoundingBox(1, 2, 3);
    
            expect(box.getCenter(new Vector3())).toEqual(position);
            expect(box.getSize(new Vector3())).toEqual(new Vector3(DEFAULT_BLOCK_SIZE, DEFAULT_BLOCK_SIZE, DEFAULT_BLOCK_SIZE));
        });
    });

    describe("getBlockRange", () => {
        it("should compute a correct block range", () => {
            const box = new Box3(new Vector3(1.5, 2, 3.5), new Vector3(2, 3.5, 4));
            const range = physics.getBlockRange(box);

            expect(range).toEqual({
                minX: 1,
                maxX: 2,
                minY: 2,
                maxY: 4,
                minZ: 3,
                maxZ: 4,
            });
        });

        it("should handle negative coordinates", () => {
            const box = new Box3(new Vector3(-1.5, -2.5, -3.5), new Vector3(1.5, 2.5, 3.5));
            const range = physics.getBlockRange(box);

            expect(range).toEqual({
                minX: -2,
                maxX: 2,
                minY: -3,
                maxY: 3,
                minZ: -4,
                maxZ: 4,
            });
        });
    });
})