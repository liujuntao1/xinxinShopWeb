import request from '@/utils/request'

// 用户分页列表
export function list(data) {
  return request({
    url: '/sysUser/pageList',
    method: 'post',
    params: {pageNum:data.pageNum,pageSize:data.pageSize,userName:data.userName,phone:data.phone}
  })
}

// 新增用户
export function insert(data) {
  return request({
    url: '/sysUser/insert',
    method: 'post',
    data
  })
}

// 修改用户
export function update(data) {
  return request({
    url: '/sysUser/update',
    method: 'post',
    data
  })
}

// 删除单个用户
export function deleteById(id) {
  return request({
    url: '/sysUser/deleteById?id=' + id,
    method: 'get'
  })
}

// 清空用户角色
export function deleteUserRoleById(id) {
  return request({
    url: '/sysUser/deleteUserRoleById',
    method: 'post',
    params: {id}
  })
}

// 查询用户关联的角色
export function listUserRoleById(id) {
  return request({
    url: '/sysUser/listUserRoleById',
    method: 'post',
    params: {id}
  })
}

// 新增用户角色
export function insertUserRole(data) {
  return request({
    url: '/sysUser/insertUserRole',
    method: 'post',
    data
  })
}

// 新增用户角色
export function updateUserPwd(data) {
  return request({
    url: '/sysUser/updateUserPwd',
    method: 'post',
    data
  })
}
