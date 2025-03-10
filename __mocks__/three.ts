const actualThree = jest.requireActual("three");

const WebGLRendererMock = jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    domElement: document.createElement("div"),
    render: jest.fn(),
}));

const PerspectiveCameraMock = jest.fn().mockImplementation(() => ({
    position: new Vector3(),
    lookAt: jest.fn(),
}));

const SceneMock = jest.fn();

export const PerspectiveCamera = PerspectiveCameraMock;
export const Scene = SceneMock;
export const Vector3 = actualThree.Vector3;
export const WebGLRenderer = WebGLRendererMock;

const three = {
    ...actualThree,
    PerspectiveCamera: PerspectiveCameraMock,
    Scene: SceneMock,
    WebGLRenderer: WebGLRendererMock,
}

export default three;
