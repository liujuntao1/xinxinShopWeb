import request from '@/utils/request'

// 修改个人信息
export function updateProfile(data) {
  return request({
    url: '/profile/updateProfile',
    method: 'post',
    data
  })
}

// 修改密码
export function updatePwd(data) {
  return request({
    url: '/profile/updatePwd',
    method: 'post',
    data
  })
}

