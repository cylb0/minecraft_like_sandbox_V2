import { ORES } from '@/constants/block';
import { BlockType } from '@/types/Blocks';
import World from '@/world/World';
import GUI from 'lil-gui';

class UI {
    static startWorldUi(world: World) {
        const gui = new GUI();

        gui.add

        const dimensionsFolder = gui.addFolder("Dimensions");
        dimensionsFolder.add(world.config.size, 'worldSize', 1, 16, 1).name('Size');
        dimensionsFolder.add(world.config.size, 'chunkWidth', 1, 16, 1).name('Chunk width');
        dimensionsFolder.add(world.config.size, 'chunkDepth', 1, 256, 1).name('Chunk depth');
        dimensionsFolder.add(world.config.size, 'renderRadius', 0, 10, 1).name('Render radius');

        const terrainFolder = gui.addFolder('Terrain');
        terrainFolder.add(world.config.terrain, 'amplitude', 0, 2, .1).name('Amplitude');
        terrainFolder.add(world.config.terrain, 'scale', 0, 200, 10).name('Scale');

        const oresFolder = gui.addFolder("Ores");
        for (const ore in ORES) {
            const blockType = Number(ore) as BlockType;
            const oreData = ORES[blockType];
            const oreFolder = oresFolder.addFolder(ore);
            oreFolder.add(oreData, 'rarity', 0, 1, 0.01).name("Rarity");

            const scaleFolder = oreFolder.addFolder('Scale');
            scaleFolder.add(oreData.scale, 'x', 1, 200).name('X scale');
            scaleFolder.add(oreData.scale, 'y', 1, 200).name('Y scale');
            scaleFolder.add(oreData.scale, 'z', 1, 200).name('Z scale');
        }

        gui.onChange(() => world.generate());
    } 
}

export default UI;
