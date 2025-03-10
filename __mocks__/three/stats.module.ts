const StatsMock = jest.fn().mockImplementation(() => ({
    dom: document.createElement("div"),
    update: jest.fn(),
}));

export default StatsMock;
