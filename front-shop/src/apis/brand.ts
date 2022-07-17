import { defRequest } from '@/utils/http/request';

/**
 *获取品牌详情 
 */

export function getBrandDetail(brandId:number){
  return defRequest({
    url: `/brand/detail/${brandId}`,
    method: 'get',
  })
}

/**
 *分页获取品牌相关商品
 */
export function fetchBrandProduct(params:Recordable){
  return defRequest({
    url: `/brand/productList`,
    method: 'get',
    params
  })
}

/**
 *分页获取推荐品牌 
 */
 export function fetchBrand(params?:Recordable){
  return defRequest({
    url: `/brand/recommendList`,
    method: 'get',
    params
  })
}

/**
 *添加品牌关注 
 */
 export function addBrandFocus(data:Recordable){
  return defRequest({
    url: `/member/attention/add`,
    method: 'post',
    data
  })
}

/**
 *清空当前用户品牌关注列表  
 */
export function clearBrandFocus(){
  return defRequest({
    url: `/member/attention/clear`,
    method: 'post',
  })
}

/**
 *取消品牌关注  
 */
 export function deleteBrandFocus(data: Recordable){
  return defRequest({
    url: `/member/attention/delete`,
    method: 'post',
    data
  })
}

/**
 *显示品牌关注详情 
 */
 export function getBrandFocusDetail(params: Recordable){
  return defRequest({
    url: `/member/attention/detail`,
    method: 'get',
    params
  })
}

/**
 *显示当前用户品牌关注列表 
 */
 export function fetchBrandFocusList(params?: Recordable){
  return defRequest({
    url: `/member/attention/list`,
    method: 'get',
    params
  })
}


export default {
  fetchBrand,
  fetchBrandProduct,
  getBrandDetail,
  fetchBrandFocusList,
  getBrandFocusDetail,
  deleteBrandFocus,
  clearBrandFocus,
  addBrandFocus

}