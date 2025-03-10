import Camera from "@/core/scene/Camera";
import Game from "@/core/Game";
import Scene from "@/core/scene/GameScene";
import World from "@/world/World";
import Player from "./units/Player";
import GameHelper from "./helpers/GameHelper";
import Renderer from "./core/scene/Renderer";

const camera = Camera.camera;

const scene = Scene.scene;

const renderer = Renderer.renderer;
renderer.setClearColor(0xadd8e6);

const seed = 0;

const world = new World(scene, seed);
world.generateBasicWorld();
world.addLighting();

scene.add(world);

// const player = new Player(scene, camera, world);
const game = new Game(world);

GameHelper.displayAxesHelper();

game.start();