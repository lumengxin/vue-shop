import HttpRequest from '../util/request'
import config from '../config'

const http = new HttpRequest(config.baseUrl)

// 添加角色
export const addRole = (params) => {
  return http.request({
    url: 'api/private/v1/' + 'roles',
    methods: 'post',
    params
  })
}
