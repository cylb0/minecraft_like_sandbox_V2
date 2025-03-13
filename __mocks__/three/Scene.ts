const SceneMock = jest.fn().mockImplementation(() => ({
    add: jest.fn(function(object) {
        this.children.push(object);
    }),
    children: [],
}));

export default SceneMock;
