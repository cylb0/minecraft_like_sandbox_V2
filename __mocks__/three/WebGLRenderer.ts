const WebGLRendererMock = jest.fn().mockImplementation(() => ({
    domElement: document.createElement("div"),
    shadowMap: {
        enabled: false,
    },
    render: jest.fn(),
    setClearColor: jest.fn(),
    setSize: jest.fn(),
}));

export default WebGLRendererMock;
