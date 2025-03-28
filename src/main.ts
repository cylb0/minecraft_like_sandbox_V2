import Camera from "@/core/scene/Camera";
import Game from "@/core/Game";
import Scene from "@/core/scene/GameScene";
import World from "@/world/World";
import Player from "./units/Player";
import { preloadTextures } from "@/blocks/textures";
import HUD from "@/ui/HUD";

await preloadTextures();

const scene = Scene.scene;
const seed = 0;
const world = new World(seed);
world.generate();

scene.add(world);

const camera = Camera.camera;

const player = new Player(scene, camera, world);

const game = new Game(world, player, scene);

HUD.initialize();

game.start();
