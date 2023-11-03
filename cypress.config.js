const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    responseTimeout: 100000,
    pageLoadTimeout: 100000
  },
});
