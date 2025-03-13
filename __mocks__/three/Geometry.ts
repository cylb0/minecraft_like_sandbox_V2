const BoxGeometryMock = jest.fn().mockImplementation((width: number, height: number, depth: number) => ({
    parameters: { width, height, depth },
}));

export {
    BoxGeometryMock,
};
