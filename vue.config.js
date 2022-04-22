// 通过chainWebpack自定义打包
// 使用 module.exports 向外暴露
module.exports = {
  // 使用 chainWebpack 生成节点，
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === "production", config => {
      config
        .entry("app")
        .clear()
        .add("./src/main-prod.js");
    });
    config.when(process.env.NODE_ENV === "development", config => {
      config
        .entry("app")
        .clear()
        .add("./src/main-dev.js");
    });
  }
};

// 生成项目体积大小报告
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// module.exports = {
//   configureWebpack: {
//     plugins: [
//       new BundleAnalyzerPlugin()
//     ]
//   }
// }

// module.exports = {
//   proxy正向代理方法
//   devServer: {
//     proxy: {
//       '/': {
//         target: 'http://localhost:3000',
//         changeOrigin: true
//       }
//     }
//   }
// }
