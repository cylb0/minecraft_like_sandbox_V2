import { PLAYER_DIMENSIONS, PLAYER_SPAWN_POSITION } from "@/constants/player";
import Player from "@/units/Player";
import World from "@/world/World";
import { BoxGeometry, Mesh, PerspectiveCamera, Scene } from "three";

jest.unmock("three");
jest.mock("@/world/World");

describe("Player class", () => {
    let camera: PerspectiveCamera;
    let player: Player;
    let scene: Scene;
    let worldMock: World;
    const seed = 0;

    beforeEach(() => {
        scene = new Scene();
        camera = new PerspectiveCamera();
        worldMock = new World(scene, seed);
        player = new Player(scene, camera, worldMock);
    });

    it("should create a player object and add it to the scene", () => {
        expect(player.object).toBeDefined();
        expect(scene.children).toContain(player.object);
    });

    it("should create a player mesh with correct dimension", () => {
        const mesh = player.object.children[0] as Mesh;
        expect(mesh).toBeDefined();
        expect(mesh.geometry).toBeInstanceOf(BoxGeometry);
        const geometry = mesh.geometry as BoxGeometry;
        expect(geometry.parameters.width).toBe(PLAYER_DIMENSIONS.width);
        expect(geometry.parameters.height).toBe(PLAYER_DIMENSIONS.height);
        expect(geometry.parameters.depth).toBe(PLAYER_DIMENSIONS.depth);
    });

    it("should position the player at spawn position", () => {
        expect(player.object.position.x).toBe(PLAYER_SPAWN_POSITION.x);
        expect(player.object.position.y).toBe(PLAYER_SPAWN_POSITION.y);
        expect(player.object.position.z).toBe(PLAYER_SPAWN_POSITION.z);
    });

    it("should add the camera to the player's object3D", () => {
        expect(player.object.children).toContain(camera);
    });
});
