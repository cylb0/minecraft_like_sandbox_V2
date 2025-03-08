const WebGLRendererMock = jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    domElement: document.createElement("div"),
    render: jest.fn(),
}));

const PerspectiveCameraMock = jest.fn();

const SceneMock = jest.fn();

export const PerspectiveCamera = PerspectiveCameraMock;
export const Scene = SceneMock;
export const WebGLRenderer = WebGLRendererMock;

const three = {
    PerspectiveCamera: PerspectiveCameraMock,
    Scene: SceneMock,
    WebGLRenderer: WebGLRendererMock,
}

export default three;
