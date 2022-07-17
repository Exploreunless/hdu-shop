import request from '@/utils/request'
// 根据商品ID及sku编码模糊搜索sku库存 
export function fetchSkuList(pid,params) {
  return request({
    url:'/sku/'+pid,
    method:'get',
    params:params
  })
}
// 批量更新sku库存信息 
export function updateSku(pid,data) {
  return request({
    url:'/sku/update/'+pid,
    method:'post',
    data:data
  })
}
