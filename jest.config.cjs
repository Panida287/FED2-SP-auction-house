module.exports = {
    testEnvironment: "jest-environment-jsdom", // Set the test environment
    transform: {
      "^.+\\.jsx?$": "babel-jest", // Use Babel to transform JavaScript files
    },
    moduleFileExtensions: ["js", "jsx"],
  };
  