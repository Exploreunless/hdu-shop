import {isDef} from './validate'
import {formatDate} from './date'
/**
 * 数值显示占位
 */
export function countPair(n: number | undefined | null, digits = 2, placeholder = '--') {
  return isDef(n) ? (n >= 0 ? Number(n).toFixed(digits) : placeholder) : placeholder;
}

/**
 * 数值显示占位
 */
 export function countZeroPair(n: number | undefined | null,  placeholder = '0') {
  return isDef(n) ? (n >= 0 ? Number(n) : placeholder) : placeholder;
}

/**
 * 手机号码显示加密
 */
 export function mobileShow(n: string) {
  return n.replace(n.substring(3, 7), '****');
}

/**
 * 保留小数点（原生toFixed）
 */
 export function decimalFormat(n: number | string, digits = 2) {
  const num = Number(n);
  if (Number.isNaN(num)) {
    return '';
  }
  return num.toFixed(digits);
}

/**
 * 时间转换
 */ 
export function formatTime(time: string) {
  if (time == null || time === '') {
    return '';
  }
  let date = new Date(time);
  return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
}