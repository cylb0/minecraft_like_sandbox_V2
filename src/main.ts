import Camera from "@/core/scene/Camera";
import Game from "@/core/Game";
import Scene from "@/core/scene/GameScene";
import World from "@/world/World";
import Player from "./units/Player";
import GameHelper from "./helpers/GameHelper";

const camera = Camera.camera;
const scene = Scene.scene;
const seed = 0;

const world = new World(scene, seed);
world.addLighting();

// const player = new Player(scene, camera, world);
const game = new Game(world);

GameHelper.displayExampleCube();
GameHelper.displayAxesHelper();

game.start();