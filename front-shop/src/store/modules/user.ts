import {defineStore} from 'pinia';
import {store} from '@/store';
import storage from 'good-storage';
import API_USER from '@/apis/user';
import { router } from '@/router';
import { assets } from '@/constants';
import {isFixedData} from '@/constants';

export interface UserInfo {
  id?: number | null,
  avatarUrl?: string,
  username?: string | null,
  gender?: '男' | '女',
  phone?: string | null,
  birthday?: string | null,
  city?: string | null,
  job?: string | null,
  personalizedSignature?: string | null,
  growth?: number| null,
  memberLevelId?: number | null,
  [key: string]: any;
}

const defaultUserInfo: UserInfo = {
  id: 1000,
  avatarUrl: assets.avatar,
  username: 'lxz',
  gender: '男',
  phone: '18406599729',
  birthday: '5/25',
  city: '江西 吉安',
  job: '学生',
  growth: 0,
  memberLevelId: 1,
  personalizedSignature: null,
}

export interface UserLevel {
  id?: number;
  [key: string]: any;
}

export interface UserState {
  token: string;
  userInfo: NonNullable<UserInfo>;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: storage.get('token', ''),
    userInfo: storage.get('userInfo', {})
  }),
  getters: {
    getToken: (state): string => state.token,
    hasLogin: (state): boolean => !!state.token,
    getUserInfo: (state): UserInfo => state.userInfo,
  },
  actions: {
    // 获取用户详情
    async getUserDetail() {
      try {
        let res;
        if(isFixedData){
          res = {data: defaultUserInfo}
        }else{
          res = await API_USER.umsUserInfo();
        }
        const { userLevel} = res.data;
        this.userInfo = res.data;
        storage.set('userInfo', res.data);
        this.userLevel = userLevel;
      } catch (error) {
        console.error('获取用户详情失败', error);
      }
    },
    // 登录
    async login(payload: Recordable = {}){
      const { params } = payload;
      try{
        const res = await API_USER.umsLogin(params);
        const {token, tokenHead} = res.data;
        const tk = tokenHead + token;
        this.token = tk;
        storage.set('token', tk);
        return res.data;
      }catch (error) {
        return Promise.reject(error);
      }
    },
    // 注册
    async register(payload: Recordable = {}){
      const { params } = payload;
      try{
        const res = await API_USER.umsRegister(params);
      }catch (error) {
        return Promise.reject(error);
      }
    },
    // 重置密码
    async resetPwd(payload: Recordable = {}){
      const { params } = payload;
      try{
        const res = await API_USER.umsResetPwd(params);
      }catch (error) {
        return Promise.reject(error);
      }
    },
    // 登出
    async logout(payload: Recordable = {}) {
      const { goLogin = false } = payload;

      if (this.getToken) {
        try {
          // await API_USER.umsLoginOut();
        } catch (error) {
          console.error('退出登录失败', error);
        }
      }

      this.token = '';
      storage.set('token', '');
      this.userInfo = {};
      storage.set('userInfo', {});
      goLogin && router.push('/login');
    },
  }
})

export function useUserStoreWithOut() {
  return useUserStore(store);
}