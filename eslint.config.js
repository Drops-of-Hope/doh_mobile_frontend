// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const globals = require("globals");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      "dist/*",
      "android/*",
      "ios/*",
      "graphify-out/*",
      "node_modules/*",
      "input.css",
    ],
  },
  {
    // The react-hooks v6 compiler rules flag ~90 pre-existing issues in
    // legacy screens. Keep them visible as warnings; promote back to errors
    // as the codebase is cleaned up (roadmap P2).
    rules: {
      "react-hooks/static-components": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
  {
    // Node scripts (locale checks etc.), not React Native code
    files: ["scripts/**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
