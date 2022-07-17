import { defRequest } from '@/utils/http/request';

/**
 *添加商品收藏  
 */

export function addCollection(data: Recordable){
  return defRequest({
      url: `/member/productCollection/add`,
      method: 'post',
      data
  })
}

/**
 *清空当前用户商品收藏列表
 */

 export function clearCollection(){
  return defRequest({
      url: `/member/productCollection/clear`,
      method: 'post',
  })
}

/**
 *删除商品收藏 
 */

 export function deleteCollection(data){
  return defRequest({
      url: `/member/productCollection/delete`,
      method: 'post',
      data
  })
}

/**
 *显示商品收藏详情 
 */

 export function getCollectionDetail(params: Recordable){
  return defRequest({
      url: `/member/productCollection/detail`,
      method: 'get',
      params
  })
}

/**
 *显示当前用户商品收藏列表 
 */

 export function fetchCollection(params?: Recordable){
  return defRequest({
      url: `/member/productCollection/list`,
      method: 'get',
      params
  })
}

export default {
  addCollection,
  fetchCollection,
  getCollectionDetail,
  deleteCollection,
  clearCollection
}