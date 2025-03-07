// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const path = require("path");

const root = path.resolve(__dirname, ".");
const threePackagePath = path.resolve(root, "node_modules/three");

const extraConfig = {
  watchFolders: [root],
  resolver: {
    extraNodeModules: {
      three: threePackagePath,
    },
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName.startsWith("three/addons/")) {
        return {
          filePath: path.resolve(
            threePackagePath,
            "examples/jsm/" + moduleName.replace("three/addons/", "") + ".js"
          ),
          type: "sourceFile",
        };
      }
      if (moduleName === "three" || moduleName === "three/webgpu") {
        return {
          filePath: path.resolve(threePackagePath, "build/three.webgpu.js"),
          type: "sourceFile",
        };
      }
      if (moduleName === "three/tsl") {
        return {
          filePath: path.resolve(threePackagePath, "build/three.tsl.js"),
          type: "sourceFile",
        };
      }
      // Let Metro handle other modules
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

config.watchFolders = [...config.watchFolders, ...extraConfig.watchFolders];
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  ...extraConfig.resolver.extraNodeModules,
};
config.resolver.resolveRequest = extraConfig.resolver.resolveRequest;
config.resolver.assetExts.push("glb", "gltf", "jpg", "bin", "hdr");

module.exports = config;
