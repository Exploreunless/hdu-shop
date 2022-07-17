import { defRequest } from '@/utils/http/request';

/**
 *添加商品到购物车 
 */

export function addCart(data: Recordable){
  return defRequest({
      url: `/cart/add`,
      method: 'post',
      data
  })
}

/**
 *清空当前会员的购物车  
 */

 export function clearCart(){
  return defRequest({
      url: `/cart/clear`,
      method: 'post',
  })
}

/**
 *删除购物车中的指定商品  
 */

export function deleteCart(params: Recordable){
  return defRequest({
      url: `/cart/delete`,
      method: 'post',
      params
  })
}

/**
 *删除购物车中的指定商品  
 */

 export function getProduct(productId: number){
  return defRequest({
      url: `/cart/getProduct/${productId}`,
      method: 'get',
  })
}

/**
 *获取当前会员的购物车列表  
 */

 export function fetchList(){
  return defRequest({
      url: `/cart/list`,
      method: 'get',
  })
}

/**
 *修改购物车中商品的规格
 */

 export function updateAttr(data: Recordable){
  return defRequest({
      url: `/cart/update/attr`,
      method: 'post',
      data
  })
}

/**
 *修改购物车中商品的规格
 */

export function updateQuantity(params: Recordable){
  return defRequest({
      url: `/cart/update/quantity`,
      method: 'get',
      params
  })
}


export default {
  addCart,
  clearCart,
  updateQuantity,
  updateAttr,
  fetchList,
  getProduct,
  deleteCart
}