import { TEXTURES } from "@/blocks/textures";
import AstralLight from "@/world/lights/AstralLight";
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

class SunLight extends AstralLight {
    protected createMesh(): Mesh {
        const geometry = new PlaneGeometry(this.config.mesh.size, this.config.mesh.size);
        
        const texture = TEXTURES.sun;

        const material = new MeshBasicMaterial(
            {
                color: this.color,
                map: texture,
                side: DoubleSide,
            }
        );
        const mesh = new Mesh(geometry, material);

        mesh.rotation.y = Math.PI / 2;

        return mesh;
    }

}

export default SunLight;
