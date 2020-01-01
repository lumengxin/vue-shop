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
  /* 通过chainWebpack自定义打包入口 */
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')

      /* 通过externals加载外部CND资源
      *  import语法导入的第三方依赖包，会被打包合并到一个文件中，导致单文件体积过大（chunk-vendors）
      *  通过webpack的externals节点，配置加载外部CDN
      *  凡是声明在externals中的第三方依赖，都不会被打包
      *  同时，需要在public/index.html文件中，添加相应的CDN资源引用
      */
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      /* 首页内容定制 */
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      /* 首页内容定制 */
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
