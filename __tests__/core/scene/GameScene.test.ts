import GameScene from '@/core/scene/GameScene';
import { Mesh, Scene } from 'three';

jest.unmock("three");

describe("GameScene singleton", () => {
    test("should return the same instance of Scene", () => {
        const scene1 = GameScene.scene;
        const scene2 = GameScene.scene;
        expect(scene1).toBe(scene2);
    });

    test("should return a valid `THREE.Scene`", () => {
        const scene = GameScene.scene;
        expect(scene).toBeInstanceOf(Scene);
    })

    test("should reset the scene correctly", () => {
        const sceneBeforeReset = GameScene.scene;
        const mesh = new Mesh();
        sceneBeforeReset.add(mesh);
        expect(sceneBeforeReset.children.length).toBe(1);
        GameScene.reset();
        const sceneAfterReset = GameScene.scene;
        expect(sceneAfterReset.children.length).toBe(0);
        expect(sceneBeforeReset).toBe(sceneAfterReset);
    })
});
