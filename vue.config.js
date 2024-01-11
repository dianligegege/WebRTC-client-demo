const { defineConfig } = require('@vue/cli-service');
const fs = require('fs');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    https: {
      key: fs.readFileSync('./src/assets/localhost+2-key.pem'),
      cert: fs.readFileSync('./src/assets/localhost+2.pem'),
    },
  },
});
