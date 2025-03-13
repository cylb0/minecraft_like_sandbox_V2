import Camera from "@/core/scene/Camera"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Renderer from "@/core/scene/Renderer";
import { Vector3, WebGLRenderer } from "three";

jest.mock("three");
jest.mock("three/examples/jsm/controls/OrbitControls.js");
jest.mock("@/core/scene/Renderer");

describe("Camera singleton", () => {
    test("should return the same instance of Camera", () => {
        const camera1 = Camera.playerCamera;
        const camera2 = Camera.playerCamera;
        expect(camera1).toBe(camera2);
    });

    test("should return a valid `THREE.PerspectiveCamera`", () => {
        const camera = Camera.playerCamera;
        expect(camera).toEqual(expect.objectContaining({
            position: expect.objectContaining({
                set: expect.any(Function)
            }),
        }));
    });

    describe("addOrbitControls", () => {
        let orbitControlsMock: jest.Mock;

        beforeEach(() => {
            orbitControlsMock = OrbitControls as jest.Mock;
            orbitControlsMock.mockClear();
            (Renderer as any).renderer = new WebGLRenderer();
        });

        test("should create OrbitControls instance", () => {
            Camera.addOrbitControls(new Vector3());
            expect(orbitControlsMock).toHaveBeenCalledWith(Camera.orbitCamera, Renderer.renderer.domElement);
        });

        test("should set the camera position", () => {
            const position = new Vector3(2, 0, 2);
            const setSpy = jest.spyOn(Camera.orbitCamera.position, "copy");

            Camera.addOrbitControls(position);

            expect(setSpy).toHaveBeenCalledWith(position);
            expect(Camera.orbitCamera.position).toEqual(expect.objectContaining({
                x: position.x,
                y: position.y,
                z: position.z,
            }));
        })
    });
});
