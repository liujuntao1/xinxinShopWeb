import request from '@/utils/request'

// 日志分页列表
export function list(data) {
  return request({
    url: '/sysLog/pageList',
    method: 'post',
    params: {pageNum: data.pageNum, pageSize: data.pageSize, userId: data.userId, ip: data.ip}
  })
}
