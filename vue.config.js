const { defineConfig } = require("@vue/cli-service");
const port = process.env.port || process.env.npm_config_port || 9528;
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: port,
    proxy: {
      "/api": {
        target: "http://heima.9yuecloud.com:9988/api/private/v1/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
});
