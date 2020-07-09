import axios from 'axios'
// 会导致跨域，请求失败
// axios.defaults.withCredentials = true

// import { baseURL } from '../config'

class HttpRequest {
  // eslint-disable-next-line no-undef
  constructor(baseUrl = baseURL) {
    // 如果传入参数就用传入的，没有就用baseURL
    this.baseUrl = baseUrl
    // 队列中有请求时，显示loading界面，反之同理
    this.queue = {}
  }

  // 统一添加请求参数
  getInsideConfig() {
    const config = {
      // axios.create 参数 baseUrl将被添加到`url`前面，除非`url`是绝对的
      baseURL: this.baseUrl,
      headers: {
        // 添加统一的header 如JWT登录
        // COP_Authorization: 'Bearer ' + getToken()
        Authorization: window.sessionStorage.getItem('token')
      }
    }
    return config
  }

  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  // 全局响应拦截器
  interceptors(instance, url) {
    // 请求拦截器
    instance.interceptors.request.use(config => {
      // 添加全局loading...
      // Spin.show()
      // 队列中有请求时，显示Loading..
      if (!Object.keys(this.queue).length) {
        // Spin.show()
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })

    // 响应拦截器
    instance.interceptors.response.use(res => {
      // 统一添加错误提示
      this.destroy(url)
      return res.data
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      return Promise.reject(error)
    })
    // instance.interceptors.response.use(res => {
    //   this.distroy(url)
    //   // ES6解构赋值
    //   const { data, status } = res
    //   return { data, status }
    // }, error => {
    //   this.distroy(url)
    //   return Promise.reject(error)
    // })
  }

  request(options) {
    const instance = axios.create()

    // 合并为一个对象，如果有相同的key值，后者覆盖前者
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    // 执行调用
    return instance(options)
  }
}

export default HttpRequest
