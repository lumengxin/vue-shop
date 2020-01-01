import HttpRequest from '../util/request'
import config from '../config'

const http = new HttpRequest(config.baseUrl)

export function getGoodsInfoById(goodId) {
  return http.request({
    url: 'api/private/v1/' + `goods/${goodId}`,
    method: 'get'
  })
}

export function upDateGoodsInfoById(id, data) {
  return http.request({
    url: 'api/private/v1/' + `goods/${id}`,
    method: 'put',
    data
  })
}
