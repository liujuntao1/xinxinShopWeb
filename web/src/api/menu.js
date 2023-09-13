import request from '@/utils/request'

// 分页列表
export function list(data) {
  return request({
    url: '/sysMenu/pageList',
    method: 'post',
    data
  })
}

// 新增数据
export function insert(data) {
  return request({
    url: '/sysMenu/insert',
    method: 'post',
    data
  })
}

// 修改数据
export function update(data) {
  return request({
    url: '/sysMenu/update',
    method: 'post',
    data
  })
}

// 删除单个数据
export function deleteById(id) {
  return request({
    url: '/sysMenu/deleteById?id=' + id,
    method: 'get'
  })
}

// 获取菜单列表
export function getMenuList() {
  return request({
    url: '/sysMenu/list',
    method: 'get'
  })
}

// 获取菜单树
export function getMenuTreeListList() {
  return request({
    url: '/sysMenu/treeList',
    method: 'get'
  })
}




