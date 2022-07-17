import request from '@/utils/request'
// 根据品牌名称分页获取品牌列表 
export function fetchBrandList(params) {
  return request({
    url:'/brand/list',
    method:'get',
    params:params
  })
}
// 添加品牌
export function createBrand(data) {
  return request({
    url:'/brand/create',
    method:'post',
    data:data
  })
}
// 批量更新显示状态 
export function updateShowStatus(data) {
  return request({
    url:'/brand/update/showStatus',
    method:'post',
    data:data
  })
}
// 批量更新厂家制造商状态 
export function updateFactoryStatus(data) {
  return request({
    url:'/brand/update/factoryStatus',
    method:'post',
    data:data
  })
}
// 删除品牌 
export function deleteBrand(id) {
  return request({
    url:'/brand/delete/'+id,
    method:'get',
  })
}
// 根据编号查询品牌信息 
export function getBrand(id) {
  return request({
    url:'/brand/'+id,
    method:'get',
  })
}
// 更新品牌 
export function updateBrand(id,data) {
  return request({
    url:'/brand/update/'+id,
    method:'post',
    data:data
  })
}

