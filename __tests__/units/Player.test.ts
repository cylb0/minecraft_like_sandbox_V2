jest.mock("three", () => ({
    ...jest.requireActual("three"),
    WebGLRenderer: require("../../__mocks__/three/WebGLRenderer").default,
}));
jest.mock("three/examples/jsm/math/SimplexNoise");
jest.mock("three/examples/jsm/controls/PointerLockControls");
jest.mock("@/world/World");

import { DEFAULT_BLOCK_SIZE } from "@/constants/block";
import { PLAYER_DIMENSIONS, PLAYER_SPAWN_POSITION } from "@/constants/player";
import Camera from "@/core/scene/Camera";
import { CameraMode } from "@/types/Camera";
import Player from "@/units/Player";
import World from "@/world/World";
import { BoxGeometry, Mesh, PerspectiveCamera, Scene } from "three";

describe("Player class", () => {
    let camera: PerspectiveCamera;
    let player: Player;
    let scene: Scene;
    let world: World;
    const seed = 0;

    beforeEach(() => {
        scene = new Scene();
        camera = new PerspectiveCamera();
        world = new World(seed);
        player = new Player(scene, camera, world);
    });

    it("should create a player object and add it to the scene", () => {
        expect(scene.children).toContain(player);
    });

    it("should create a player model", () => {
        expect(player.model).toBeDefined();
    });

    it("should NOT add the player model to the scene when Camera.mode is FPS", () => {
        Object.defineProperty(Camera, "mode", { get: () => CameraMode.FPS });
        player = new Player(scene, camera, world);

        const hasMesh = player.children.some(child => child instanceof Mesh);
        expect(hasMesh).toBe(false);
    });

    it("should add the player model to the scene when Camera.mode is TPS", () => {
        Object.defineProperty(Camera, "mode", { get: () => CameraMode.TPS });
        player = new Player(scene, camera, world);

        const hasMesh = player.children.some(child => child instanceof Mesh);
        expect(hasMesh).toBe(true);
    })

    it("should create a player mesh with correct dimension", () => {
        const mesh = player.children.find(child => child instanceof Mesh);
        expect(mesh).toBeDefined();
        expect(mesh!.geometry).toBeDefined();

        expect(mesh!.geometry).toHaveProperty("parameters");

        const geometry = mesh!.geometry as BoxGeometry;

        expect(geometry.parameters.width).toBe(PLAYER_DIMENSIONS.width);
        expect(geometry.parameters.height).toBe(PLAYER_DIMENSIONS.height);
        expect(geometry.parameters.depth).toBe(PLAYER_DIMENSIONS.depth);
    });

    it("should attach the camera to the player", () => {
        expect(player.children).toContain(camera);
    });

    it("should spawn at correct location", () => {
        const expectedY = (PLAYER_DIMENSIONS.height / 2) + (DEFAULT_BLOCK_SIZE / 2);

        expect(player.position.x).toBe(PLAYER_SPAWN_POSITION.x);
        expect(player.position.y).toBe(expectedY);
        expect(player.position.z).toBe(PLAYER_SPAWN_POSITION.z);
    });

    it("should update camera position for FPS mode", () => {
        Object.defineProperty(Camera, "mode", { get: () => CameraMode.FPS });
        player = new Player(scene, camera, world);
        expect(camera.position.y).toBeCloseTo(PLAYER_DIMENSIONS.height * 3 / 4);
    });

    it("should update camera position for TPS mode", () => {
        Object.defineProperty(Camera, "mode", { get: () => CameraMode.TPS });
        player = new Player(scene, camera, world);
        expect(camera.position).toEqual(Camera.tpsOffset);
    });

    it("should toggle camera mode and show / hide models", () => {
        Object.defineProperty(Camera, "mode", { get: () => CameraMode.FPS });
        player = new Player(scene, camera, world);
        
        const hasMeshBefore = player.children.some(child => child instanceof Mesh);
        expect(hasMeshBefore).toBe(false);

        player.toggleCamera();
        const hasMeshAfter = player.children.some(child => child instanceof Mesh);
        expect(hasMeshAfter).toBe(true);
    });

    it("should move the player when a movement key is pressed", () => {
        const startingPosition = player.position.clone();

        (player as any).pressKey("KeyW");
        player.move(1);

        const moved = !player.position.equals(startingPosition);
        expect(moved).toBe(true);
    });

});
