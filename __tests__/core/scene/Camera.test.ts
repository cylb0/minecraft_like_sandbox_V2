import Camera from "@/core/scene/Camera"
import { PerspectiveCamera } from "three";

describe("Camera singleton", () => {
    test("should return the same instance of Camera", () => {
        const camera1 = Camera.camera;
        const camera2 = Camera.camera;
        expect(camera1).toBe(camera2);
    });

    test("should return a valid `THREE.PerspectiveCamera`", () => {
        const camera = Camera.camera;
        expect(camera).toBeInstanceOf(PerspectiveCamera);
    });
});
