import request from '@/utils/request'
// 分页获取所有商品属性分类 
export function fetchList(params) {
  return request({
    url:'/productAttribute/category/list',
    method:'get',
    params:params
  })
}
// 添加商品属性分类 
export function createProductAttrCate(data) {
  return request({
    url:'/productAttribute/category/create',
    method:'post',
    data:data
  })
}
// 删除单个商品属性分类
export function deleteProductAttrCate(id) {
  return request({
    url:'/productAttribute/category/delete/'+id,
    method:'get'
  })
}
// 修改商品属性分类 
export function updateProductAttrCate(id,data) {
  return request({
    url:'/productAttribute/category/update/'+id,
    method:'post',
    data:data
  })
}
// 获取所有商品属性分类及其下属性 
export function fetchListWithAttr() {
  return request({
    url:'/productAttribute/category/list/withAttr',
    method:'get'
  })
}
