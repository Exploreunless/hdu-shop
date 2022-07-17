import request from '@/utils/request'

// 查询商品列表
export function fetchList(params){
    return request({
        url: '/product/list',
        method: 'get',
        params: params
    })
}

// 根据商品名称或货号模糊查询 
export function fetchSimpleList(params) {
    return request({
      url:'/product/simpleList',
      method:'get',
      params:params
    })
}

// 批量修改删除状态 
export function updateDeleteStatus(params) {
    return request({
      url:'/product/update/deleteStatus',
      method:'post',
      params:params
    })
}
// 批量设为新品 
export function updateNewStatus(params) {
    return request({
      url:'/product/update/newStatus',
      method:'post',
      params:params
    })
}
// 批量推荐商品 
export function updateRecommendStatus(params) {
    return request({
      url:'/product/update/recommendStatus',
      method:'post',
      params:params
    })
}

// 批量上下架商品 
export function updatePublishStatus(params) {
    return request({
      url:'/product/update/publishStatus',
      method:'post',
      params:params
    })
}

// 创建商品 
export function createProduct(data) {
    return request({
      url:'/product/create',
      method:'post',
      data:data
    })
}
// 更新商品 
export function updateProduct(id,data) {
    return request({
      url:'/product/update/'+id,
      method:'post',
      data:data
    })
}
// 根据商品id获取商品编辑信息 
export function getProduct(id) {
    return request({
      url:'/product/updateInfo/'+id,
      method:'get',
    })
}
  

