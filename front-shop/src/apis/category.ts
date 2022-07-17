import { defRequest } from '@/utils/http/request';

/**
 *以树形结构获取所有商品分类 
 */

export function umsFetchCategoryList(){
  return defRequest({
      url: `/product/categoryTreeList`,
      method: 'get',
  })
}

export default {
    umsFetchCategoryList
}