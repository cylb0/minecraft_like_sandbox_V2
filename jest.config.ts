export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!three/).+\\.js$",
  ],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "^three/examples/jsm/libs/stats.module": "<rootDir>/__mocks__/three/stats.module.ts",
    "^three/examples/jsm/controls/OrbitControls": "<rootDir>/__mocks__/three/OrbitControls.ts",
    "^three/examples/jsm/math/SimplexNoise": "<rootDir>/__mocks__/three/SimplexNoise.ts",
    "^three/src/math/MathUtils": "<rootDir>/__mocks__/three/MathUtils.ts",
  },
};
