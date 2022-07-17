/**
 * 获取接口前缀
 */
 export function getAPI(code = 'api') {
    const host: string = import.meta.env.PROD ? import.meta.env.VITE_APP_API_HOST : location.host;
    const origin = `${location.protocol}//${host}`;
    const basePath = import.meta.env.PROD ? '/xiaochengxu' : '/dev-api';
    const api = `${origin}${basePath}`; // 基础接口
    // const src = `${origin}${process.env.VUE_APP_BASE_API}`;
  
    switch (code) {
      case 'host':
        return host;
      case 'origin':
        return origin;
      // case 'src':
      //   return src;
      default:
        return api;
    }
  }

  /**
 * rpx2px
 * @param {Number} n
 * @param {Number} destWidth 设计稿基准屏幕宽度
 */
export function rpx2px(n: number, destWidth = 375) {
  const ratio = document.documentElement.clientWidth / destWidth;

  return (n * ratio).toFixed(2);
}