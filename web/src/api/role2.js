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


// 角色关联菜单
export function insertRoleMenu(data) {
  return request({
    url: '/sysRole/insertRoleMenu',
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
