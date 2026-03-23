/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const extraNodeModules = {
   "react-native-better-components": path.resolve(__dirname + "../../src"),
};
const watchFolders = [path.resolve(__dirname + "../../src")];

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
   transform: {
      experimentalImportSupport: false,
      inlineRequires: false,
   },
});

config.resolver.extraNodeModules = new Proxy(extraNodeModules, {
   get: (target, name) => (name in target ? target[name] : path.join(process.cwd(), `node_modules/${name}`)),
});

config.watchFolders = watchFolders;

module.exports = config;
