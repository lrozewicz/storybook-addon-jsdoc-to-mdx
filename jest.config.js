module.exports = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  maxWorkers: "50%",
  moduleDirectories: ["node_modules", "<rootDir>/"],
  collectCoverage: true,
  coverageReporters: ["text", "html", "lcov"],
  coverageDirectory: "<rootDir>/coverage/",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.ts$": ["ts-jest"],
  },
};
