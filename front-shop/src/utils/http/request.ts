import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';
import qs from 'qs';
import { Toast } from 'vant';
import { getAPI } from '@/utils';
import { ServiceResult } from './types';

import { useUserStoreWithOut } from '@/store/modules/user';



function createRequest<T = ServiceResult>(config: AxiosRequestConfig): Promise<T> {
  /**
   * 创建 axios 实例
   */
  const instance: AxiosInstance = axios.create({
    // baseURL: getAPI(),
    baseURL: 'http://10.1.124.151:8081',
    timeout: 10000,
    // transformRequest: [
    //   (data, headers) => {
    //     if (headers['Content-Type']?.includes('form-data')) {
    //       return data;
    //     } else {
    //       return qs.stringify({ ...data }); // 序列化请求参数
    //     }
    //   },
    // ],
  });

  /**
   * 请求拦截器
   */
  instance.interceptors.request.use((config: AxiosRequestConfig) => {
    // store.getters.token && (config.headers.token = store.getters.token);
    const userStore = useUserStoreWithOut();
    config.headers.Authorization = userStore.getToken
    // if (config.method === 'get') {
    //   config.params = { ...config.params};
    // }

    return config;
  });

  /**
   * 响应拦截器
   */
  // @ts-ignore
  instance.interceptors.response.use((response: AxiosResponse<any>) => {
      const userStore = useUserStoreWithOut();
      const res: ServiceResult = response.data
        if (res.code !== 200) {
            Toast({
            message: res.message,
            duration: 3 * 1000
          })
    
          // 401:未登录;
          if (res.code === 401) {
            Toast({
              message: res.message + " 请重新登录",
              duration: 3 * 1000
            })
            userStore.logout({goLogin: true});
          }
          return Promise.reject('error')
        } else {
          return res
        }
    },
    (error: AxiosError) => {
      httpErrorHandle(error);
      return Promise.reject(error);
    },
  );

  return new Promise((resolve, reject) => {
    instance
      .request<any, AxiosResponse<ServiceResult>>(config)
      .then((res: AxiosResponse<ServiceResult>) => {
        resolve(res as unknown as Promise<T>);
      })
      .catch((e: Error | AxiosError) => {
        reject(e);
      });
  });
}

/**
 * 业务错误
 * @param {*} res 业务约定的返回数据
 * @param {Number} res.code 业务约定的错误码
 * @param {String} res.msg 业务上的错误信息
 * @param {*} res.data
 */
function serviceErrorHandel(res: ServiceResult) {
  const { code, message } = res;
  if (Number(code) === 2000) {
    Toast.clear();
    const userStore = useUserStoreWithOut();
    userStore.logout({ goLogin: true });
  } else {
    Toast({
      message: message || 'Result Error',
      duration: 1000 * 3,
    });
  }
}

/**
 * HTTP 错误
 */
function httpErrorHandle(error: AxiosError) {
  // console.log('[httpErrorHandle]', error);
  // console.log('[httpErrorHandle]', error.toString());

  let msg = '';

  if (error?.response) {
    const { status } = error.response;

    switch (status) {
      case 403:
        msg = `${status} 网络请求被拒绝`;
        break;
      case 404:
        msg = `${status} 网络请求不存在`;
        break;
      case 500:
        msg = `${status} 服务器内部错误`;
        break;
      default:
        msg = `${status || error.message}`;
        break;
    }
  }

  if (error.message.includes('timeout')) {
    msg = '请求超时';
  }

  if (error.message.includes('Network Error')) {
    msg = '当前网络不可用，请检查你的网络设置';
  }

  Toast({
    message: msg || error.toString(),
    duration: 1000 * 3,
  });
}

export const defRequest = createRequest;
