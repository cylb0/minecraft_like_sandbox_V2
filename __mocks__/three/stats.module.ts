const StatsMock = jest.fn().mockImplementation(() => ({
    dom: document.createElement("div")
}));

export default StatsMock;
