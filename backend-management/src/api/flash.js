import request from '@/utils/request'
// 获取活动列表
export function fetchList(params) {
  return request({
    url:'/flash/list',
    method:'get',
    params:params
  })
}
// 更新活动状态
export function updateStatus(id,params) {
  return request({
    url:'/flash/update/status/'+id,
    method:'post',
    params:params
  })
}
// 删除
export function deleteFlash(id) {
  return request({
    url:'/flash/delete/'+id,
    method:'post'
  })
}
// 创建
export function createFlash(data) {
  return request({
    url:'/flash/create',
    method:'post',
    data:data
  })
}
// 更新
export function updateFlash(id,data) {
  return request({
    url:'/flash/update/'+id,
    method:'post',
    data:data
  })
}
