import { defRequest } from '@/utils/http/request';

/**
 *创建浏览记录  
 */

export function addHistory(data: Recordable){
  return defRequest({
      url: `/member/readHistory/create`,
      method: 'post',
      data
  })
}

/**
 *清空浏览记录 
 */

export function clearHistory(){
  return defRequest({
    url: `/member/readHistory/clear`,
    method: 'post',
  })
}

/**
 *删除浏览记录
 */

 export function deleteHistory(data: Recordable){
  return defRequest({
      url: `/member/readHistory/delete`,
      method: 'post',
      data
  })
}

/**
 *分页获取浏览记录 
 */

 export function fetchHistory(params?: Recordable){
  return defRequest({
      url: `/member/readHistory/list`,
      method: 'get',
      params
  })
}

export default {
  addHistory,
  fetchHistory,
  deleteHistory,
  clearHistory
}