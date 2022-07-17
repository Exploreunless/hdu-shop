import axios from "axios"
import {ElMessage, ElMessageBox} from 'element-plus'
import store from '@/store'

const service = axios.create({
    // baseURL: 'http://admin-api.macrozheng.com',
    baseURL: 'http://10.1.124.151:8080',
    timeout: 10000
})

service.interceptors.request.use(
    config => {
        config.headers.Authorization = store.getters.token
        // console.log(store.state.sendToken)
        return config
    },
    error =>{
        console.log(error)
        return Promise.reject(error)
    }
)
service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 200) {
            ElMessage({
            message: res.message,
            type: 'error',
            duration: 3 * 1000
          })
    
          // 401:未登录;
          if (res.code === 401) {
            ElMessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              store.dispatch('FedLogOut').then(() => {
                location.reload()// 为了重新实例化vue-router对象 避免bug
              })
            })
          }
          return Promise.reject('error')
        } else {
          return response.data
        }
    },
    error =>{
        return Promise.reject(error)
    }
)

export default service