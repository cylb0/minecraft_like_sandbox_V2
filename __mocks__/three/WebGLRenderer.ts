const WebGLRendererMock = jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    domElement: document.createElement("div"),
    render: jest.fn(),
}));

export default WebGLRendererMock;
