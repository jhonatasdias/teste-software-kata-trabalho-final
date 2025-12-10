/** @type {import('jest').Config} */
module.exports = {
  // Ambiente padrão adequado para projetos JS sem DOM
  testEnvironment: "node",

  // Padrões de testes (funciona para *.test.js e *.spec.js)
  testMatch: [
    "**/__tests__/**/*.test.js",
    "**/?(*.)+(spec|test).js"
  ],
  testPathIgnorePatterns: [
    //".stryker-tmp/"
  ],
  // Coverage
  collectCoverage: true,
  collectCoverageFrom: [
    "src/gilded_rose.refactor.js",
    //"src/**/*.js",
    "!**/node_modules/**"
  ],

  // Obrigatório para Jest 30 + CommonJS
  extensionsToTreatAsEsm: [],
};
