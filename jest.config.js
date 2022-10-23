/** @type {import('jest').Config} */
const config = {
  verbose: true,
  "runner": "jest-electron/runner",
  "testEnvironment": "jest-electron/environment",
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};

module.exports = config;