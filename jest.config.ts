export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!three/examples/jsm/controls/OrbitControls\\.js).+\\.js$",
    "/node_modules(?!three/examples/jsm/libs/stats.module\\.js).+\\.js$",
  ],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "^three/examples/jsm/libs/stats.module": "<rootDir>/__mocks__/three/stats.module.ts",
    "^three/examples/jsm/controls/OrbitControls": "<rootDir>/__mocks__/three/OrbitControls",
  },
};
