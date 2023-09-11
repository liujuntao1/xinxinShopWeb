import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sysLogin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/sysLogin/getUserInfo',
    method: 'get',
    params: {token}
  })
}

export function logout() {
  return request({
    url: '/sysLogin/logout',
    method: 'post'
  })
}
