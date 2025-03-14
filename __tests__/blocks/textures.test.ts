jest.mock("three", () => ({
    ...jest.requireActual("three"),
    Texture: require("../../__mocks__/three/Loaders").TextureMock,
    TextureLoader: require("../../__mocks__/three/Loaders").TextureLoaderMock,
}));

import { loadTexture, preloadTextures, TEXTURES } from "@/blocks/textures";
import { NearestFilter, SRGBColorSpace } from "three";

describe("Texture loading", () => {
    it("should load a texture and add settings", async () => {
        const texture = await loadTexture("valid.png");
        expect(texture).toBeDefined();
        expect(texture.colorSpace).toEqual(SRGBColorSpace);
        expect(texture.minFilter).toEqual(NearestFilter);
        expect(texture.magFilter).toEqual(NearestFilter);
    });

    it("should return a fallback texture when loading fails", async () => {
        const fallbackTexture = await loadTexture("invalid.png");
        expect(fallbackTexture).toBeDefined();
        expect(fallbackTexture.colorSpace).toBe(null);
        expect(fallbackTexture.minFilter).toBe(null);
        expect(fallbackTexture.magFilter).toBe(null);
    })
});

describe("TEXTURES", () => {
    it("should load all textures with correct settings", async () => {
        await preloadTextures();
        
        Object.values(TEXTURES).forEach((texture) => {
            expect(texture.colorSpace).toBe(SRGBColorSpace);
            expect(texture.minFilter).toBe(NearestFilter);
            expect(texture.magFilter).toBe(NearestFilter);
        });
    });
})
