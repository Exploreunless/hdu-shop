import { defRequest } from '@/utils/http/request';


/**
 *获取前台商品详情 
 */

export function umsGetGoodDetail(id:number){
  return defRequest({
    url: `/product/detail/${id}`,
    method: 'get',
  })
}

/**
 *综合搜索、筛选、排序  
 */

 export function umsGoodSearch(params:Recordable){
  return defRequest({
    url: `/product/search`,
    method: 'get',
    params
  })
}

export default {
  umsGetGoodDetail,
  umsGoodSearch
}