import { computeOrbitPosition } from "@/helpers/MathUtils";
import { Vector3 } from "three";

describe("computeOrbitPosition", () => {
    it("should compute the correct position for a rotation", () => {
        const origin = new Vector3(0, 0, 0);
        const radius = 1;
        const angle = Math.PI;

        const result = computeOrbitPosition(origin, radius, angle);
        
        expect(result.x).toBeCloseTo(-1);
        expect(result.y).toBeCloseTo(0);
        expect(result.z).toBeCloseTo(0);
    });

    it("should compute the correct position when changing origin", () => {
        const origin = new Vector3(1, 1, 1);
        const radius = 1;
        const angle = Math.PI;

        const result = computeOrbitPosition(origin, radius, angle);
        
        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(1);
        expect(result.z).toBeCloseTo(1);
    });

    it("should compute the correct position when changing radius", () => {
        const origin = new Vector3(0, 0, 0);
        const radius = 2;
        const angle = Math.PI;

        const result = computeOrbitPosition(origin, radius, angle);
        
        expect(result.x).toBeCloseTo(-2);
        expect(result.y).toBeCloseTo(0);
        expect(result.z).toBeCloseTo(0);
    });

    it("should compute the correct position when changing angle", () => {
        const origin = new Vector3(0, 0, 0);
        const radius = 1;
        const angle = Math.PI / 2;

        const result = computeOrbitPosition(origin, radius, angle);
        
        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(1);
        expect(result.z).toBeCloseTo(0);
    });
});
