jest.unmock("three");

import { DEFAULT_BLOCK_SIZE, getBlocks } from "@/constants/block"
import { getBlockBoundingBox, getBlockRange, isBlockSolid, sortCollisionsByOverlap } from "@/helpers/PhysicsHelper";
import { BlockType } from "@/types/Blocks";
import Player from "@/units/Player";
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

    describe("sortCollisionsByOverlap", () => {
        const boxMock = new Box3(
            new Vector3(-.5, -1, -.5),
            new Vector3(.5, 1, .5) 
        );

        const playerMock = {
            position: new Vector3(0, 0, 0),
            get boundingBox() {
                return boxMock;
            },
        } as Player;

        it("should sort collisions correctly from smallest to largest overlap", () => {
            const smallOverlapCollision = new Box3(
                new Vector3(-.1, -.1, -.1),
                new Vector3(.1, .1, .1)
            );

            const mediumOverlapCollision = new Box3(
                new Vector3(-.2, -.2, -.2),
                new Vector3(.2, .2, .2)
            );

            const largeOverlapCollision = new Box3(
                new Vector3(-.4, -.5, -.4),
                new Vector3(.4, .4, .4)
            );

            const sortedCollisions = sortCollisionsByOverlap(playerMock, [
                largeOverlapCollision,
                mediumOverlapCollision,
                smallOverlapCollision,
            ]);

            expect(sortedCollisions).toEqual([
                smallOverlapCollision,
                mediumOverlapCollision,
                largeOverlapCollision
            ]);
        });

        it("should handle equal collisions correctly", () => {
            const mediumOverlapCollision1 = new Box3(
                new Vector3(-.2, -.2, -.2),
                new Vector3(.2, .2, .2)
            );

            const mediumOverlapCollision2 = new Box3(
                new Vector3(-.2, -.2, -.2),
                new Vector3(.2, .2, .2)
            );

            const sortedCollisions = sortCollisionsByOverlap(playerMock, [
                mediumOverlapCollision2,
                mediumOverlapCollision1
            ]);

            expect(sortedCollisions).toEqual([
                mediumOverlapCollision2,
                mediumOverlapCollision1
            ]);
        });
    });

    describe("isBlockSolid", () => {
        let getBlocksMock: jest.SpyInstance;

        beforeAll(() => {
            getBlocksMock = jest.spyOn(require("@/constants/block"), "getBlocks").mockReturnValue({
                [BlockType.Sand]: {},
                [BlockType.Stone]: { solid: true },
                [BlockType.Water]: { solid: false },
            });
        });

        afterAll(() => {
            getBlocksMock.mockRestore();
        });

        it("should correctly find solid blocks with explicit solid value", () => {
            expect(isBlockSolid(BlockType.Stone)).toBe(true);
        });

        it("should correctly find solid blocks with no explicit solid value", () => {
            expect(isBlockSolid(BlockType.Sand)).toBe(true);
        });

        it("should find non-solid blocks", () => {
            expect(isBlockSolid(BlockType.Water)).toBe(false);
        })
    });
})