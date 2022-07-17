import {Notify} from 'vant';
import {router} from '@/router'
import deviceModel from '@/utils/helpers/deviceModel';
import {toRouteType} from '@/router/types'
import { useAppStoreWithOut } from '@/store/modules/app';
import { useUserStoreWithOut } from '@/store/modules/user';

let appLoadedFlag: boolean;

const whitePathList: string[] = [
  '/',
  '/home',
  'category',
  '/cart',
  '/mine',
  '/login',
  '/register',
  '/resetPwd',
  '/test',
  '/theme',
]

router.beforeEach(async (to: toRouteType, from, next) =>{
  
  const title = to.meta?.title;
  if (title) {
    document.title = title;
  }
  if(!appLoadedFlag){
    appLoadedFlag = true;
    if(deviceModel() === 'PC' && document.documentElement.clientWidth >= 750){
      Notify({
        color: '#ed6a0c',
        background: '#fffbe8',
        message: '请使用移动设备访问或者pc 上F12打开,获取最佳使用体验',
      });
    }
    const appStore = useAppStoreWithOut();
    await appStore.updateTheme();
  }
  const userStore = useUserStoreWithOut();
  const token = userStore.getToken;
  if(!(token || whitePathList.includes(to.path))){
    const redirect = to.path || '/'
    next({
      path: '/login',
      query: {
        ...to.query,
        redirect,
      }
    });
    return ;
  }
  next();
})

