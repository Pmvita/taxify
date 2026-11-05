// Metro config for the mobile app (Expo workspaces monorepo).
// @expo/metro-config v0.20.x does not export createExpoMetroConfig, so we use
// getDefaultConfig. Adds @taxify/core and react-native internals so the bundler
// resolves the shared core and the react-native src/ Flow files.
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: false,
});

module.exports = {
  ...config,
  transformer: {
    ...config.transformer,
    extraBabelPlugins: [
      '@babel/plugin-transform-flow-strip-types',
    ],
    extraBabelPresets: [
      '@babel/preset-flow',
      '@babel/preset-typescript',
    ],
  },
};
