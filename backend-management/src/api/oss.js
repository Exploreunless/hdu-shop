import request from '@/utils/request'
// Oss上传签名生成 
export function policy() {
  return request({
    url:'/aliyun/oss/policy',
    method:'get',
  })
}
