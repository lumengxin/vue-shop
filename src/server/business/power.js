import HttpRequest from '../util/request'
import config from '../config'

const http = new HttpRequest(config.baseUrl)

// 添加角色
export const addRole = (params) => {
  return http.request({
    url: 'api/private/v1/' + 'roles',
    method: 'post',
    params
  })
}

// 根据角色:id, 获取角色信息
// export function getRoleInfo(RoleId) {
//   return http.request.get(`api/private/v1/${RoleId}`)
// }
export const getRoleInfo = (RoleId) => {
  return http.request({
    url: 'api/private/v1/' + `roles/${RoleId}`,
    method: 'get'
  })
}

// 编辑提交角色信息
export const editRoles = (RoleId) => {
  return http.request({
    url: 'api/private/v1/' + `roles/${RoleId}`,
    method: 'put'
  })
}

// 删除角色
export const deleteRoles = (RoleId) => {
  return http.request({
    url: 'api/private/v1/' + `roles/${RoleId}`,
    method: 'delete'
  })
}
