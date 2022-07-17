import { defRequest } from '@/utils/http/request';

/**
 *领取指定优惠券 
 */

export function umsGetCoupon(couponId:number){
  return defRequest({
    url: `/member/coupon/add/${couponId}`,
    method: 'post',
  })
}

/**
 *获取会员优惠券列表 
 {
			"amount": 0,
			"code": "",
			"count": 0,
			"enableTime": "",
			"endTime": "",
			"id": 0,
			"memberLevel": 0,
			"minPoint": 0,
			"name": "",
			"note": "",
			"perLimit": 0,
			"platform": 0,
			"publishCount": 0,
			"receiveCount": 0,
			"startTime": "",
			"type": 0,
			"useCount": 0,
			"useType": 0
		}
 */
export function umsFetchCouponList(params?:Recordable){
  return defRequest({
    url: `/member/coupon/list`,
    method: 'get',
    params: params
  })
}


/**
 *获取登录会员购物车的相关优惠券
 {
			"categoryRelationList": [
				{
					"couponId": 0,
					"id": 0,
					"parentCategoryName": "",
					"productCategoryId": 0,
					"productCategoryName": ""
				}
			],
			"coupon": {
				"amount": 0,
				"code": "",
				"count": 0,
				"enableTime": "",
				"endTime": "",
				"id": 0,
				"memberLevel": 0,
				"minPoint": 0,
				"name": "",
				"note": "",
				"perLimit": 0,
				"platform": 0,
				"publishCount": 0,
				"receiveCount": 0,
				"startTime": "",
				"type": 0,
				"useCount": 0,
				"useType": 0
			},
			"couponCode": "",
			"couponId": 0,
			"createTime": "",
			"getType": 0,
			"id": 0,
			"memberId": 0,
			"memberNickname": "",
			"orderId": 0,
			"orderSn": "",
			"productRelationList": [
				{
					"couponId": 0,
					"id": 0,
					"productId": 0,
					"productName": "",
					"productSn": ""
				}
			],
			"useStatus": 0,
			"useTime": ""
		}
 */
export function umsFetchCartCoupon(type:0 | 1){
  return defRequest({
    url: `/member/coupon/list/cart/${type}`,
    method: 'get',
  })
}

/**
 *获取会员优惠券历史列表  
 {
			"couponCode": "",
			"couponId": 0,
			"createTime": "",
			"getType": 0,
			"id": 0,
			"memberId": 0,
			"memberNickname": "",
			"orderId": 0,
			"orderSn": "",
			"useStatus": 0,
			"useTime": ""
		}
 */

export function umsFetchHistoryCoupons(params?:Recordable){  // useStatus
  return defRequest({
    url: `/member/coupon/listHistory`,
    method: 'get',
    params
  })
}

export default {
	umsGetCoupon,
	umsFetchHistoryCoupons,
	umsFetchCartCoupon,
	umsFetchCouponList
}