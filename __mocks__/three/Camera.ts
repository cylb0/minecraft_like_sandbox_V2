import { Vector3 } from "three";

const PerspectiveCameraMock = jest.fn().mockImplementation(() => ({
    position: new Vector3(),
    lookAt: jest.fn(),
}));

export {
    PerspectiveCameraMock,
};
