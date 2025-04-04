jest.mock("three");
jest.mock("three/examples/jsm/controls/OrbitControls.js");

import Camera from "@/core/scene/Camera"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Renderer from "@/core/scene/Renderer";
import { Vector3, WebGLRenderer } from "three";
import { CameraMode } from "@/types/Camera";

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

    describe("switchCamera", () => {
        const positionMock = new Vector3(1, 2, 3);

        beforeEach(() => {
            (Renderer as any).renderer = new WebGLRenderer();
        });

        test("should create OrbitControls instance when switching to ORBIT mode", () => {
            Camera.switchCamera(CameraMode.ORBIT)
            expect(Camera.controls).toBeDefined();
            expect(OrbitControls).toHaveBeenCalledWith(Camera.camera, Renderer.renderer.domElement);
        });

        test("should dispose of OrbitControls when switching to another mode", () => {
            Camera.switchCamera(CameraMode.ORBIT);

            expect(Camera.controls).toBeDefined();

            const disposeSpy = jest.spyOn(Camera.controls!, "dispose");

            Camera.switchCamera(CameraMode.FPS);

            expect(disposeSpy).toHaveBeenCalledTimes(1);
            
            disposeSpy.mockRestore();
        });
    });
});
