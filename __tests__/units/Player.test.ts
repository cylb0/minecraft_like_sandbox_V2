import { PLAYER_DIMENSIONS, PLAYER_SPAWN_POSITION } from "@/constants/player";
import Player from "@/units/Player";
import World from "@/world/World";
import { BoxGeometry, Mesh, PerspectiveCamera, Scene } from "three";

jest.mock("@/world/World");
jest.mock("three/examples/jsm/math/SimplexNoise");

describe("Player class", () => {
    let camera: PerspectiveCamera;
    let player: Player;
    let scene: Scene;
    let world: World;
    const seed = 0;

    beforeEach(() => {
        scene = new Scene();
        console.log(scene)
        camera = new PerspectiveCamera();
        world = new World(seed);
        player = new Player(scene, camera, world);
    });

    it("should create a player object and add it to the scene", () => {
        expect(scene.children).toContain(player);
    });

    it("should create a player mesh with correct dimension", () => {
        const mesh = player.children[1] as Mesh;
        expect(mesh).toBeDefined();
        expect(BoxGeometry).toHaveBeenCalledWith(PLAYER_DIMENSIONS.width, PLAYER_DIMENSIONS.height, PLAYER_DIMENSIONS.depth);
        expect((mesh.geometry as any).parameters).toEqual({
            width: PLAYER_DIMENSIONS.width,
            height: PLAYER_DIMENSIONS.height,
            depth: PLAYER_DIMENSIONS.depth,
        })

        const geometry = mesh.geometry as BoxGeometry;
        expect(geometry.parameters.width).toBe(PLAYER_DIMENSIONS.width);
        expect(geometry.parameters.height).toBe(PLAYER_DIMENSIONS.height);
        expect(geometry.parameters.depth).toBe(PLAYER_DIMENSIONS.depth);
    });

    it("should position the player at spawn position", () => {
        expect(player.position.x).toBe(PLAYER_SPAWN_POSITION.x);
        expect(player.position.y).toBe(PLAYER_SPAWN_POSITION.y);
        expect(player.position.z).toBe(PLAYER_SPAWN_POSITION.z);
    });

    it("should add the camera to the player's object3D", () => {
        expect(player.children).toContain(camera);
    });
});
