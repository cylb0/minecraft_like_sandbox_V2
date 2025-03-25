import { Vector3 } from "three";

const WorldMock = jest.fn().mockImplementation((seed) => ({
    findSpawnPosition: jest.fn((x: number, z: number) => new Vector3(x, 0, z)),
    seed: seed,
    sunLight: {
        update: jest.fn(),
    },
}));

export default WorldMock;
