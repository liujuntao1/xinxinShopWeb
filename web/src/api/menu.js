import request from '@/utils/request'

// 角色分页列表
export function list(data) {
  return request({
    url: '/sysMenu/pageList',
    method: 'post',
    data
  })
}

// 新增角色
export function insert(data) {
  return request({
    url: '/sysMenu/insert',
    method: 'post',
    data
  })
}

// 修改角色
export function update(data) {
  return request({
    url: '/sysMenu/update',
    method: 'post',
    data
  })
}

// 删除单个角色
export function deleteById(id) {
  return request({
    url: '/sysMenu/deleteById?id=' + id,
    method: 'get'
  })
}

// 清空角色角色
export function deleteUserRoleById(id) {
  return request({
    url: '/sysMenu/deleteUserRoleById',
    method: 'post',
    params: {id}
  })
}

// 查询角色关联的角色
export function listUserRoleById(id) {
  return request({
    url: '/sysMenu/listUserRoleById',
    method: 'post',
    params: {id}
  })
}

// 新增角色角色
export function insertUserRole(data) {
  return request({
    url: '/sysMenu/insertUserRole',
    method: 'post',
    data
  })
}

// 新增角色角色
export function getMenuList() {
  return request({
    url: '/sysMenu/list',
    method: 'get'
  })
}
