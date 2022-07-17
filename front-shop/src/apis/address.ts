import { defRequest } from '@/utils/http/request';

/**
 *添加收货地址 
 请求数据：address:{
	"city": "",
	"defaultStatus": 0,
	"detailAddress": "",
	"id": 0,
	"memberId": 0,
	"name": "",
	"phoneNumber": "",
	"postCode": "",
	"province": "",
	"region": ""
}
 */

export function umsAddAddress(data?:Recordable){
  return defRequest({
    url: `/member/address/add`,
    method: 'post',
    data
  })
}

/**
 *删除收货地址 
 */

export function umsDeleteAddress(id:number){
  return defRequest({
    url: `/member/address/delete/${id}`,
    method: 'post',
  })
}

/**
 *显示所有收货地址
 [
		{
			"city": "",
			"defaultStatus": 0,
			"detailAddress": "",
			"id": 0,
			"memberId": 0,
			"name": "",
			"phoneNumber": "",
			"postCode": "",
			"province": "",
			"region": ""
		}
	],  
 */
 export function umsFetchAddress(){
  return defRequest({
    url: `/member/address/list`,
    method: 'get',
  })
}


/**
 *修改收货地址  
 */
 export function umsUpdateAddress(id:number, data: Recordable){
  return defRequest({
    url: `/member/address/update/${id}`,
    method: 'post',
    data
  })
}

/**
 *获取收货地址详情   
 {
		"city": "",
		"defaultStatus": 0,
		"detailAddress": "",
		"id": 0,
		"memberId": 0,
		"name": "",
		"phoneNumber": "",
		"postCode": "",
		"province": "",
		"region": ""
	},
 */
 export function umsGetAddressDetail(id:number){
  return defRequest({
    url: `/member/address/${id}`,
    method: 'get',
  })
}


export default {
// ums
	umsGetAddressDetail,
	umsUpdateAddress,
	umsFetchAddress,
	umsDeleteAddress,
	umsAddAddress,
};
  