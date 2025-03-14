import { Texture } from "three";
const { NearestFilter, SRGBColorSpace } = jest.requireActual("three");

const TextureMock = jest.fn().mockImplementation(() => ({
    colorSpace: null,
    minFilter: null,
    magFilter: null,
}));

const TextureLoaderMock = jest.fn().mockImplementation(() => ({
    load: jest.fn().mockImplementation((url: string, onLoad?: (texture: Texture) => void, onProgress?: () => void, onError?: (event: ErrorEvent) => void) => {
        return new Promise<Texture>((resolve) => {
            const mockTexture = new TextureMock();

            if (url.includes("invalid")) {
                if (onError) onError(new ErrorEvent(`Texture not found ${url}`));
            }

            mockTexture.colorSpace = SRGBColorSpace;
            mockTexture.minFilter = NearestFilter;
            mockTexture.magFilter = NearestFilter;

            if (onLoad) {
                onLoad(mockTexture);
            }

            resolve(mockTexture);
        })
    }),
}));

export {
    TextureMock,
    TextureLoaderMock,
};
