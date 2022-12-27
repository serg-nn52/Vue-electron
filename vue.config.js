const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  },
  // configureWebpack: {
  //   resolve: {
  //     fallback: {
  //       path: require.resolve("path-browserify"),
  //       os: false,
  //       fs: false,
  //       stream: require.resolve("stream-browserify"),
  //     },
  //   },
  // },
});
