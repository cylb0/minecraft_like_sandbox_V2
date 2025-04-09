import { BufferGeometry, DoubleSide, Material, MeshBasicMaterial, PlaneGeometry, Texture } from "three";
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

export function createXShapeGeometry(size: number): BufferGeometry {
    const planeGeometry = new PlaneGeometry(size, size);
    
    const plane1 = planeGeometry.clone();
    plane1.rotateY(Math.PI / 4);

    const plane2 = planeGeometry.clone();
    plane2.rotateY(-Math.PI / 4);

    const mergedGeometry = mergeGeometries([plane1, plane2]);

    return mergedGeometry;
}

export function createDoubleSidedTexture(texture: Texture): Material {
    const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: DoubleSide,
        alphaTest: .5,
    })

    return material;
}