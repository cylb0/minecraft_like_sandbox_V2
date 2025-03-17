import { computeOrbitPosition } from "@/helpers/MathUtils";
import { DayNightLightConfig } from "@/types/Config";
import DayNightLight from "@/world/lights/DayNightLight";
import { CameraHelper, Object3D, Vector3 } from "three";

jest.unmock("three");

jest.mock("@/helpers/MathUtils");

describe("DayNightLight", () => {

    let container: Object3D;
    let config: DayNightLightConfig;
    let center: Vector3;
    let positionMock: Vector3;

    beforeEach(() => {
        container = new Object3D;
        config = {
            color: 0xffffff,
            dayDuration: 60,
            intensity: 1,
            radius: 10,
            shadow: {
                frustum: 10,
                mapSize: 1024,
            },
        };
        center = new Vector3(0, 0, 0);
        positionMock = new Vector3(1, 2, 3);
        (computeOrbitPosition as jest.Mock).mockReturnValue(positionMock);
    });

    it("should add light to the container", () => {
        const light = new DayNightLight(container, config, center, false);
        expect(container.children).toContain(light);
    });

    it("should add a CameraHelper to the container when helper is set to true", () => {
        const light = new DayNightLight(container, config, center, true);
        expect(container.children.find(child => child instanceof CameraHelper)).toBeDefined();
    });

    it("should set shadow properties correctly", () => {
        const light = new DayNightLight(container, config, center, false);
        expect(light.shadow.camera.left).toBe(-config.shadow.frustum);
        expect(light.shadow.camera.top).toBe(config.shadow.frustum);
        expect(light.shadow.camera.right).toBe(config.shadow.frustum);
        expect(light.shadow.camera.bottom).toBe(-config.shadow.frustum);
        expect(light.shadow.mapSize.height).toBe(config.shadow.mapSize);
        expect(light.shadow.mapSize.width).toBe(config.shadow.mapSize);
        expect(light.castShadow).toBe(true);
    });

    it("should update the light's position", () => {
        const light = new DayNightLight(container, config, center, false);
        light.update();
        expect(computeOrbitPosition).toHaveBeenCalled();
        expect(light.position).toEqual(positionMock);
    });

    it("should update the angle based on time", () => {
        const light = new DayNightLight(container, config, center, false);
        const timeMock = new Date(2024, 3, 17, 12, 50, 0);
        jest.spyOn(global.Date, 'now').mockReturnValue(timeMock.getTime());
        light.update();
        expect(light.angle).toBeCloseTo(- (Math.PI / 2));
    });
});