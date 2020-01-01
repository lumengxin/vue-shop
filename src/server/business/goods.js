import HttpRequest from '../util/request'
import config from '../config'

const http = new HttpRequest(config.baseUrl)

/* 商品列表 */
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

/* 商品分类 */
export function getGoodsCategorieInfoById(id) {
  return http.request({
    url: 'api/private/v1/' + `categories/${id}`,
    method: 'get'
  })
}

export function upDateGoodsCategorieInfoById(id, data) {
  return http.request({
    url: 'api/private/v1/' + `categories/${id}`,
    method: 'put',
    data
  })
}

export function deleteGoodsCategorieInfoById(id) {
  return http.request({
    url: 'api/private/v1/' + `categories/${id}`,
    method: 'delete'
  })
}
