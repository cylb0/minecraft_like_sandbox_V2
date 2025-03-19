jest.unmock("three");
jest.unmock("@/world/World");

import { getDefaultWorldConfig } from "@/config";
import SunLight from "@/world/lights/SunLight";
import World from "@/world/World";
import { AmbientLight } from "three";

describe("World class", () => {
    let world: World;
    let seed = 0;
    let config = getDefaultWorldConfig();

    beforeEach(() => {
        world = new World(seed, config);
    });
    
    it("should create a World instance", () => {
        expect(world).toBeDefined();
        expect(world.seed).toBe(seed);
        expect(world.config).toBe(config);
    });

    it("should initialize World as a Group", () => {
        expect(world).toHaveProperty("children");
        expect(Array.isArray(world.children)).toBe(true);
    })

    describe("addLighting", () => {
        it("should add ambient and sun lights to the world", () => {
            const ambientBefore = world.children.filter(child => child instanceof AmbientLight).length;
            const sunBefore = world.children.filter(child => child instanceof SunLight).length;
            world.addLighting();
            const ambientAfter = world.children.filter(child => child instanceof AmbientLight).length;
            const sunAfter = world.children.filter(child => child instanceof SunLight).length;

            expect(ambientBefore).toBe(0);
            expect(sunBefore).toBe(0);
            expect(ambientAfter).toBe(1);
            expect(sunAfter).toBe(1);
        });
    });
});