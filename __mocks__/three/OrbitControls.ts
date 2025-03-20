const OrbitControlsMock = jest.fn().mockImplementation(() => ({
    dispose: jest.fn(),
    target: {
        set: jest.fn(),
    },
    update: jest.fn(),
}));

export { OrbitControlsMock as OrbitControls }
export default OrbitControlsMock;