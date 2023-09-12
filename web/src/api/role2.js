import request from '@/utils/request'

// 角色分页列表
export function list(data) {
  return request({
    url: '/sysRole/pageList',
    method: 'post',
    data
  })
}

// 新增角色
export function insert(data) {
  return request({
    url: '/sysRole/insert',
    method: 'post',
    data
  })
}

// 修改角色
export function update(data) {
  return request({
    url: '/sysRole/update',
    method: 'post',
    data
  })
}

// 删除单个角色
export function deleteById(id) {
  return request({
    url: '/sysRole/deleteById?id=' + id,
    method: 'get'
  })
}

// 清空角色角色
export function deleteUserRoleById(id) {
  return request({
    url: '/sysRole/deleteUserRoleById',
    method: 'post',
    params: {id}
  })
}

// 查询角色关联的用户
export function listUserRoleById(id) {
  return request({
    url: '/sysRole/listUserRoleById',
    method: 'post',
    params: {id}
  })
}

// 新增角色角色
export function insertUserRole(data) {
  return request({
    url: '/sysRole/insertUserRole',
    method: 'post',
    data
  })
}

// 查询全部角色
export function getRoleList() {
  return request({
    url: '/sysRole/list',
    method: 'get'
  })
}
