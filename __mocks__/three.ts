import { PerspectiveCameraMock } from "./three/Camera";
import { BoxGeometryMock } from "./three/Geometry";
import { DirectionalLightMock } from "./three/Lights";
import { TextureLoaderMock, TextureMock } from "./three/Loaders";
import { MeshBasicMaterialMock, MeshLambertMaterialMock } from "./three/Material";
import { GroupMock, MeshMock } from "./three/Object3D";
import SceneMock from "./three/Scene";
import WebGLRendererMock from "./three/WebGLRenderer";

const actualThree = jest.requireActual("three");

export const BoxGeometry = BoxGeometryMock;
export const DirectionaLight = DirectionalLightMock;
export const Group = GroupMock;
export const PerspectiveCamera = PerspectiveCameraMock;
export const Mesh = MeshMock;
export const MeshBasicMaterial = MeshBasicMaterialMock;
export const MeshLambertMaterial = MeshLambertMaterialMock;
export const Scene = SceneMock;
export const Texture = TextureMock;
export const TextureLoader = TextureLoaderMock;
export const Vector3 = actualThree.Vector3;
export const WebGLRenderer = WebGLRendererMock;

const three = {
    BoxGeometry: BoxGeometryMock,
    DirectionaLight: DirectionalLightMock,
    Group: GroupMock,
    Mesh: MeshMock,
    MeshBasicMaterial: MeshBasicMaterialMock,
    MeshLambertMaterial: MeshLambertMaterialMock,
    PerspectiveCamera: PerspectiveCameraMock,
    Scene: SceneMock,
    Texture: TextureMock,
    TextureLoader: TextureLoaderMock,
    Vector3: actualThree.Vector3,
    WebGLRenderer: WebGLRendererMock,
}

export default three;
