import { BoxGeometry, MeshBasicMaterial, Vector3 } from "three";

const GroupMock = jest.fn().mockImplementation(() => ({
    add: jest.fn(function(obj) {
        this.children.push(obj);
    }),
    position: new Vector3(),
    children: [],
}));

const MeshMock = jest.fn().mockImplementation((geometry: BoxGeometry, material: MeshBasicMaterial) => ({
    geometry,
    material,
}));

export {
    GroupMock,
    MeshMock
};
