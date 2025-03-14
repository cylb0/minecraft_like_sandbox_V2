import { TextureLoader, Texture, SRGBColorSpace, NearestFilter } from "three";

const textureLoader = new TextureLoader();

export const fallbackTexture = new Texture();

/**
 * Loads a textures from a given path and applies settings.
 * 
 * @param url - The path of the texture file.
 * @returns The loaded texture with SRGB color space and nearest-neighbor filtering or `null` if an error occured during loading.
 */
export function loadTexture(url: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
        textureLoader.load(
            url,
            (data) => {
                data.colorSpace = SRGBColorSpace;
                data.minFilter = NearestFilter;
                data.magFilter = NearestFilter;
                resolve(data);
            },
            undefined,
            (err) => {
                console.error(`Failed to load texture: ${url}`);
                resolve(fallbackTexture);
            }
        );
    });
}

export const TEXTURES_PATHS = {
    bedrock: "textures/bedrock.png",
    coal_ore: "textures/coal_ore.png",
    dirt: "textures/dirt.png",
    gold_ore: "textures/gold_ore.png",
    grass_top: "textures/grass_top.png",
    grass_side: "textures/grass_side.png",
    iron_ore: "textures/iron_ore.png",
    sand: "textures/sand.png",
    snow: "textures/snow.png",
    stone: "textures/stone.png",
}

/**
 * A collection of pre-loaded textures used for `BLOCKS` rendering.
 */
export const TEXTURES: { [key: string]: Texture } = {};

export async function preloadTextures() {
    const entries = Object.entries(TEXTURES_PATHS);
    const promises = entries.map(async ([key, url]) => {
        TEXTURES[key] = await loadTexture(url);
    });

    await Promise.all(promises);
}
