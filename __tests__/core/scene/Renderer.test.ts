import Renderer from "@/core/scene/Renderer"

describe("Renderer singleton", () => {
    test("should return the same instance of Renderer", () => {
        const renderer1 = Renderer.renderer;
        const renderer2 = Renderer.renderer;
        expect(renderer1).toBe(renderer2);
    });

    test("should return a valid object and `WebGLRenderer`", () => {
        const renderer = Renderer.renderer;
        expect(renderer).toBeInstanceOf(Object);
    });
});
