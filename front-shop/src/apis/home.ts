import { defRequest } from '@/utils/http/request';

/**
 *首页内容信息展示 
 */

export function umsHomeContent(){
  return defRequest({
    url: `/home/content`,
    method: 'get',
  })
}

/**
 *分页获取人气推荐商品 
 */
export function umsHomeHotProductList(params: Recordable){
  return defRequest({
    url: `/home/hotProductList`,
    method: 'get',
    params
  })
}

/**
 *分页获取新品推荐商品 
 */
 export function umsHomeNewProductList(params: Recordable){
  return defRequest({
    url: `/home/newProductList`,
    method: 'get',
    params
  })
}

/**
 *获取首页商品分类
 */
 export function umsHomeProductCateList(parentId: number){
  return defRequest({
    url: `/home/productCateList/${parentId}`,
    method: 'get',
  })
}

/**
 *分页获取推荐商品 
 */
 export function umsHomeProductList(params: Recordable){
  return defRequest({
    url: `/home/recommendProductList`,
    method: 'get',
    params
  })
}

/**
 *根据分类获取专题  
 */
 export function umsHomeSubjectList(params: Recordable){
  return defRequest({
    url: `/home/subjectList`,
    method: 'get',
    params
  })
}

export default {
  umsHomeSubjectList,
  umsHomeProductList,
  umsHomeProductCateList,
  umsHomeNewProductList,
  umsHomeContent,
  umsHomeHotProductList
}