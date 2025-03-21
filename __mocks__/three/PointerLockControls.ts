const PointerLockControlsMock = jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    lock: jest.fn(),
}));

export { PointerLockControlsMock as PointerLockControls }
export default PointerLockControlsMock;
