// @ts-check

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
module.exports = {
  _comment:
    "Config base do Stryker. Veja: https://stryker-mutator.io/docs/stryker-js/configuration/",
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "jest",
  coverageAnalysis: "perTest",
  ignorePatterns: ["src/gilded_rose.js"],
  // Quais arquivos serão mutados
  mutate: ["src/**/*.js"],

  // Integração com Jest
  jest: {
    // Para Jest moderno (você está com 30.x), usar 'custom'
    projectType: "custom",
    // Apontar explicitamente para o jest.config
    configFile: "jest.config.cjs"
  }
};