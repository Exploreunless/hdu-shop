import { defRequest } from '@/utils/http/request';

/**
 *展示订单列表 
 */

export function fetchOrderList(params:Recordable){
  return defRequest({
    url: `/order/list`,
    method: 'get',
    params
  })
}

/**
 *用户取消订单
 */

export function orderCancel(data:Recordable){
  return defRequest({
    url: `/order/cancelUserOrder`,
    method: 'post',
    data
  })
}

/**
 *用户删除订单
 */

 export function orderDelete(data:Recordable){
  return defRequest({
    url: `/order/deleteOrder`,
    method: 'post',
    data
  })
}

/**
 *用户确认收货
 */

 export function orderConfirmReceive(data:Recordable){
  return defRequest({
    url: `/order/confirmReceiveOrder`,
    method: 'post',
    data
  })
}

/**
 *获取订单详情
 */

export function orderDetail(orderId:number){
  return defRequest({
    url: `/order/detail/${orderId}`,
    method: 'get',
  })
}

/**
 *自动取消超时订单
 */
export function cancelTimeOutOrder(){
  return defRequest({
    url: `/order/cancelTimeOutOrder`,
    method: 'post',
  })
}

/**
 *取消超时订单
 */
 export function cancelOutOrder(data:Recordable){
  return defRequest({
    url: `/order/cancelOrder`,
    method: 'post',
    data
  })
}

/**
 *根据购物车信息生成确认单 
 */
 export function generateConfirmOrder(data){
  return defRequest({
    url: `/order/generateConfirmOrder`,
    method: 'post',
    data
  })
}

/**
 *根据购物车信息生成订单 
 */
export function generateOrder(data:Recordable){
  return defRequest({
    url: `/order/generateOrder`,
    method: 'post',
    data
  })
}

/**
 *用户支付成功的回调 
 */
 export function paySuccess(data:Recordable){
  return defRequest({
    url: `/order/paySuccess`,
    method: 'get',
    params: data
  })
}

/**
 *申请退货  
 */
 export function returnApply(data:Recordable){
  return defRequest({
    url: `/returnApply/create`,
    method: 'post',
    data
  })
}



export default {
  fetchOrderList,
  orderCancel,
  orderDelete,
  orderConfirmReceive,
  orderDetail,
  cancelTimeOutOrder,
  cancelOutOrder,
  generateConfirmOrder,
  generateOrder,
  paySuccess,
  returnApply
}