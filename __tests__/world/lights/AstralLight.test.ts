jest.unmock("three");

import Clock from "@/helpers/Clock";
import * as MathUtils from "@/helpers/MathUtils";
import { AstralLightConfig } from "@/types/Config";
import AstralLight from "@/world/lights/AstralLight";
import { CameraHelper, Color, Material, Mesh, MeshBasicMaterial, PlaneGeometry, Vector3 } from "three";

class TestAstralLight extends AstralLight {
    protected createMesh(): Mesh {
        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshBasicMaterial({ color: 0xffffff });
        return new Mesh(geometry, material);
    }
}

describe("TestAstralLight", () => {
    let config: AstralLightConfig;
    let center: Vector3;
    let clock: Clock;

    beforeEach(() => {
        config = {
            angleOffset: 0,
            defaultColor: 0xffffff,
            defaultIntensity: 1,
            mesh: {
                size: 1,
            },
            radius: 10,
            shadow: {
                frustum: 10,
                mapSize: 1024,
            },
            variations: new Map(),
            visibility: { from: 0, to: 12 },
        };
        center = new Vector3(0, 0, 0);
        clock = new Clock(60);
    });

    afterEach(() => {
        config.variations = new Map();
    })

    it("should create a CameraHelper to the instance when helper is set to true", () => {
        const light = new TestAstralLight(clock, config, center, true);
        const shadowHelper = light.children.filter(child => child instanceof CameraHelper).length;

        expect(light.shadowHelper).toBeDefined();
        expect(shadowHelper).toBe(1);
    });

    it("should create a Mesh", () => {
        const light = new TestAstralLight(clock, config, center, true);
        const mesh = light.children.filter((child) => child instanceof Mesh).length;

        expect(mesh).toBe(1);
    });

    it("should set shadow properties correctly", () => {
        const light = new TestAstralLight(clock, config, center, false);

        expect(light.shadow.camera.left).toBe(-config.shadow.frustum);
        expect(light.shadow.camera.top).toBe(config.shadow.frustum);
        expect(light.shadow.camera.right).toBe(config.shadow.frustum);
        expect(light.shadow.camera.bottom).toBe(-config.shadow.frustum);
        expect(light.shadow.mapSize.height).toBe(config.shadow.mapSize);
        expect(light.shadow.mapSize.width).toBe(config.shadow.mapSize);
        expect(light.castShadow).toBe(true);
    });

    it("should update the light's position", () => {
        const light = new TestAstralLight(clock, config, center, false);
        
        const positionMock = new Vector3(1, 2, 3);
        const computeOrbitPositionSpy = jest.spyOn(MathUtils, "computeOrbitPosition");
        computeOrbitPositionSpy.mockReturnValue(positionMock);
        light.update();

        expect(computeOrbitPositionSpy).toHaveBeenCalled();
        expect(light.position).toEqual(positionMock);

        computeOrbitPositionSpy.mockRestore();
    });

    it("should update the angle based on time", () => {
        const light = new TestAstralLight(clock, config, center, false);
        const getInGameTimeInHoursSpy = jest.spyOn(clock, "getInGameTimeInHours");
        getInGameTimeInHoursSpy.mockReturnValue(12);
        light.update();

        expect(light.angle).toBeCloseTo(Math.PI);

        getInGameTimeInHoursSpy.mockRestore();
    });

    it("should interpolate color and intensity based on time variations", () => {
        config.variations!.set(0, { color: 0x000000, intensity: 1 });
        config.variations!.set(12, { color: 0xffffff, intensity: 2 });
        const light = new TestAstralLight(clock, config, center, false);

        const getInGameTimeInHoursSpy = jest.spyOn(clock, "getInGameTimeInHours");

        getInGameTimeInHoursSpy.mockReturnValue(0);
        light.update();
        expect(light.color.getHex()).toBe(0);
        expect(light.intensity).toBe(1);

        getInGameTimeInHoursSpy.mockReturnValue(6);
        light.update();
        const expectedColor = new Color().lerpColors(new Color(0x000000), new Color(0xffffff), 0.5);
        expect(light.color.getHex()).toBe(expectedColor.getHex());
        expect(light.intensity).toBe(1.5);

        getInGameTimeInHoursSpy.mockReturnValue(12);
        light.update();
        expect(light.color.getHex()).toBe(16777215);
        expect(light.intensity).toBe(2);

        getInGameTimeInHoursSpy.mockRestore();
    });

    it("should not interpolate color and intensity when there are not enough variations", () => {
        config.variations!.set(0, { color: 0x000000, intensity: 1 });

        const light = new TestAstralLight(clock, config, center, false);
        const getInGameTimeInHoursSpy = jest.spyOn(clock, "getInGameTimeInHours").mockReturnValue(6);;
        console.log("time",clock.getInGameTimeInHours())
        light.update();
        console.log("light.color.getHex", light.color.getHex())
        console.log("light.intensity", light.intensity)
        expect(light.color.getHex()).toBe(config.defaultColor);
        expect(light.intensity).toBe(config.defaultIntensity);

        getInGameTimeInHoursSpy.mockRestore();
    });

    it("should not interpolate color and intensity when there are no variations", () => {
        const light = new TestAstralLight(clock, config, center, false);
        const getInGameTimeInHoursSpy = jest.spyOn(clock, "getInGameTimeInHours").mockReturnValue(6);;

        light.update();

        expect(light.color.getHex()).toBe(config.defaultColor);
        expect(light.intensity).toBe(config.defaultIntensity);

        getInGameTimeInHoursSpy.mockRestore();
    });

    it("should dispose of all resources", () => {
        const light = new TestAstralLight(clock, config, center, false);

        const disposeGeometrySpy = jest.spyOn(light.mesh!.geometry, "dispose");
        const disposeMaterialSpy = jest.spyOn(light.mesh!.material as Material, "dispose");
        
        light.dispose();

        expect(disposeGeometrySpy).toHaveBeenCalled();
        expect(disposeMaterialSpy).toHaveBeenCalled();
        expect(light.children.length).toBe(0);
        expect(light.mesh).toBe(null);
    });
});
