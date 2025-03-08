export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
    "node_modules/three/examples/jsm/libs/stats.module.js": "babel-jest",
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1"
  },
};
