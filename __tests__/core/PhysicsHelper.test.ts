jest.unmock("three");

import { DEFAULT_BLOCK_SIZE } from "@/constants/block"
import { getBlockBoundingBox, getBlockRange } from "@/helpers/PhysicsHelper";
import { Box3, Vector3 } from "three";

describe("PhysicsHelper", () => {

    describe("getBlockBoundingBox", () => {
        it("should return a Box3 with correct settings", () => {
            const position = new Vector3(1, 2, 3);
            const box = getBlockBoundingBox(1, 2, 3);
    
            expect(box.getCenter(new Vector3())).toEqual(position);
            expect(box.getSize(new Vector3())).toEqual(new Vector3(DEFAULT_BLOCK_SIZE, DEFAULT_BLOCK_SIZE, DEFAULT_BLOCK_SIZE));
        });
    });

    describe("getBlockRange", () => {
        it("should compute a correct block range", () => {
            const box = new Box3(new Vector3(1.5, 2, 3.5), new Vector3(2, 3.5, 4));
            const range = getBlockRange(box);

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
            const range = getBlockRange(box);

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