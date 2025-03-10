import Camera from "@/core/scene/Camera"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Renderer from "@/core/scene/Renderer";
import { Vector3 } from "three";

jest.mock("three");
jest.mock("three/examples/jsm/controls/OrbitControls.js");
jest.mock("@/core/scene/Renderer");

describe("Camera singleton", () => {
    test("should return the same instance of Camera", () => {
        const camera1 = Camera.camera;
        const camera2 = Camera.camera;
        expect(camera1).toBe(camera2);
    });

    test("should return a valid `THREE.PerspectiveCamera`", () => {
        const camera = Camera.camera;
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

            (Renderer as any).renderer = { domElement: document.createElement("div") };
        });

        test("should create OrbitControls instance", () => {
            Camera.addOrbitControls(new Vector3());
            expect(orbitControlsMock).toHaveBeenCalledWith(Camera.camera, Renderer.renderer.domElement);
        });

        test("should set the camera position", () => {
            const position = new Vector3(2, 0, 2);
            const setSpy = jest.spyOn(Camera.camera.position, "copy");

            Camera.addOrbitControls(position);

            expect(setSpy).toHaveBeenCalledWith(position);
            expect(Camera.camera.lookAt).toHaveBeenCalledWith(0, 0, 0);
            expect(Camera.camera.position).toEqual(expect.objectContaining({
                x: position.x,
                y: position.y,
                z: position.z,
            }));
        })
    });
});
