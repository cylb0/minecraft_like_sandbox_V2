const OrbitControlsMock = jest.fn().mockImplementation(() => ({
    target: {
        set: jest.fn(),
    },
    update: jest.fn(),
}));

export { OrbitControlsMock as OrbitControls }
export default OrbitControlsMock;