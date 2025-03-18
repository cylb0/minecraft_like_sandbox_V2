const MathUtilsMock = jest.fn().mockImplementation(() => ({
    lerp: jest.fn(),
}));

export default MathUtilsMock;