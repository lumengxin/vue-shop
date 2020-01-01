'use strict'

// https://cli.vuejs.org/zh/config/#vue-config.js
module.exports = {
  // 是否hash值
  filenameHashing: false,
  // 生成环境是否生成sourceMap文件
  productionSourceMap: false,
  // 配置webpack-dev-server行为
  devServer: {
    host: '127.0.0.1',
    port: 8889,
    https: false,
    open: true
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:8888/api/private/v1/',
    //     changeOrigin: true
    //   }
    // }
  },
  // 通过chainWebpack自定义打包入口
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}
