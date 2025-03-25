import Camera from "@/core/scene/Camera";
import Game from "@/core/Game";
import Scene from "@/core/scene/GameScene";
import World from "@/world/World";
import Player from "./units/Player";
import GameHelper from "@/helpers/GameHelper";
import UI from "./helpers/Ui";
import { preloadTextures } from "@/blocks/textures";
import { CameraMode } from "./types/Camera";

await preloadTextures();

const scene = Scene.scene;
const seed = 0;
const world = new World(seed);
world.generate();

scene.add(world);

const camera = Camera.camera;

const player = new Player(scene, camera, world);

const game = new Game(world, player, scene);

// Camera.switchCamera(CameraMode.ORBIT)

GameHelper.displayAxesHelper();

game.start();

UI.startWorldUi(world);