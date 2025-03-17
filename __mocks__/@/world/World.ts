const WorldMock = jest.fn().mockImplementation((seed) => ({
    seed: seed,
    sunLight: {
        update: jest.fn(),
    },
}));

export default WorldMock;
