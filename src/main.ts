import Camera from "@/core/scene/Camera";
import Game from "@/core/Game";
import Scene from "@/core/scene/GameScene";
import World from "@/world/World";
import Player from "./units/Player";
import GameHelper from "@/helpers/GameHelper";
import Renderer from "@/core/scene/Renderer";
import UI from "./helpers/Ui";
import { Vector3 } from "three";
import { preloadTextures } from "./blocks/textures";

await preloadTextures();

const scene = Scene.scene;
const seed = 0;
const world = new World(seed);
world.generate();
world.addLighting();
scene.add(world);

// const player = new Player(scene, playerCamera, world);

Camera.addOrbitControls(new Vector3(64, 64, 64));

const game = new Game(world);

GameHelper.displayAxesHelper();

game.start();

UI.startWorldUi(world);