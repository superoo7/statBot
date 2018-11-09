module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  testEnvironment: 'node',
  "transform": {
    "^.+\\.ts$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)$",
  "moduleFileExtensions": ["ts", "js", "json"]
};