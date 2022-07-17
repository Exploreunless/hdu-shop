import request from '@/utils/request'
// 分页查询商品分类
export function fetchList(parentId,params) {
  return request({
    url:'/productCategory/list/'+parentId,
    method:'get',
    params:params
  })
}
// 删除商品分类 
export function deleteProductCate(id) {
  return request({
    url:'/productCategory/delete/'+id,
    method:'post'
  })
}
// 添加商品分类 
export function createProductCate(data) {
  return request({
    url:'/productCategory/create',
    method:'post',
    data:data
  })
}
// 修改商品分类 
export function updateProductCate(id,data) {
  return request({
    url:'/productCategory/update/'+id,
    method:'post',
    data:data
  })
}
// 根据id获取商品分类 
export function getProductCate(id) {
  return request({
    url:'/productCategory/'+id,
    method:'get',
  })
}
// 修改显示状态 
export function updateShowStatus(data) {
  return request({
    url:'/productCategory/update/showStatus',
    method:'post',
    data:data
  })
}
// 修改导航栏显示状态
export function updateNavStatus(data) {
  return request({
    url:'/productCategory/update/navStatus',
    method:'post',
    data:data
  })
}
// 查询所有一级分类及子分类 
export function fetchListWithChildren() {
  return request({
    url:'/productCategory/list/withChildren',
    method:'get'
  })
}
