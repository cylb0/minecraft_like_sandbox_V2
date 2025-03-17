jest.mock("three", () => ({
    ...jest.requireActual("three"),
    WebGLRenderer: require("../../__mocks__/three/WebGLRenderer").default,
}));

jest.mock("three/examples/jsm/libs/stats.module");
jest.mock("three/examples/jsm/controls/OrbitControls");

jest.mock("@/units/Player");
jest.mock("@/world/World");

import Camera from "@/core/scene/Camera";
import Game from "@/core/Game";
import GameScene from "@/core/scene/GameScene";
import Player from "@/units/Player";
import World from "@/world/World";


describe("Game class", () => {
    let game: Game;
    let worldMock: World;
    let playerMock: Player;

    beforeEach(() => {
        worldMock = new World(0);
        console.log(worldMock);
        playerMock = new Player(GameScene.scene, Camera.playerCamera, worldMock);
        game = new Game(worldMock, playerMock);
    });

    it("should create a Game instance", () => {
        expect(game).toBeDefined();
    });

    // it("should append stats.dom to document.body", () => {
    //     const domSpy = jest.spyOn(document.body, 'append');
    //     game.start();
    //     expect(domSpy).toHaveBeenCalled();
    //     domSpy.mockRestore();
    // });

    it("should call requestAnimationFrame", () => {
        const requestSpy = jest.spyOn(window, "requestAnimationFrame");
        game.start();
        expect(requestSpy).toHaveBeenCalled();
        requestSpy.mockRestore();
    })
});
