import { RcFile } from 'antd/es/upload';
import { isArray, isNumber, isString } from 'lodash';
import moment, { Moment, unitOfTime } from 'moment';

/**
 * 请求返回200时表示成功
 */
export const OK = 200;

/**
 * 请求返回401时表示没有权限
 */
export const NO_AUTHOR = 401;

/**
 * 自动生成的接口会多一个header中的参数 Authorization
 * 生成时又不好手动去除，就给它填个 undefined吧
 */
export const NP = undefined as any;

export const FORMAT_DATA_TIME = 'YYYY-MM-DD HH:mm:ss';
/**
 * 将字符串日期格式化展示，默认是 YYYY-MM-DD HH:mm:ss
 * - `Mon Nov 02 2020 23:06:35 GMT+0800` -> `2020-11-02 23:06:35`
 * - `hello` -> `hello`
 * - null -> ` - `
 * @export
 * @param {string} [duration]
 * @param {string} [format]
 * @returns {string}
 */
/**
 * 将字符串日期格式化展示，默认是 YYYY-MM-DD HH:mm:ss
 * - `Mon Nov 02 2020 23:06:35 GMT+0800` -> `2020-11-02 23:06:35`
 * - `hello` -> `hello`
 * - null -> ` - `
 * @export
 * @param {(string | number | Moment | null)} [duration]
 * @param {string} [format]
 * @param {string} [defaultStr]
 * @returns {string}
 */
export function fmt(
  duration?: string | number | Moment | null,
  format?: string,
  defaultStr?: string,
): string;
/**
 * 将日期数字格式化展示，默认是 YYYY-MM-DD HH:mm:ss
 * - `1604316808661` -> 2020-11-02 19:33:28
 * - `undefined` -> ` - `
 * @export
 * @param {number} [duration]
 * @param {string} [format]
 * @returns {string}
 */
// eslint-disable-next-line no-redeclare
// export function fmt(duration?: number, format?: string): string;
/**
 * 将日期格式化展示，默认是 YYYY-MM-DD HH:mm:ss
 * - Moment -> 2020-11-02 19:33:28
 * - `undefined` -> ` - `
 * @export
 * @param {Moment} [duration]
 * @param {string} [format]
 * @return {*}  {string}
 */
// export function fmt(duration?: Moment, format?: string): string;
// eslint-disable-next-line no-redeclare
/**
 *
 * 将日期数字格式化展示，默认是 YYYY-MM-DD HH:mm:ss
 * @export
 * @param {*} [duration]
 * @param {string} [format=FORMAT_DATA_TIME]
 * @param {string} [defaultStr=' - ']
 * @returns {string}
 */
export function fmt(duration?: any, format: string = FORMAT_DATA_TIME, defaultStr = ' - '): string {
  if (!duration) {
    return defaultStr;
  }
  if (isString(duration)) {
    const time = moment(duration);
    return time.isValid() ? time.format(format) : duration;
  }
  if (moment.isMoment(duration)) {
    return duration.format(format);
  }
  if (!isNumber(duration)) {
    return duration;
  }
  return moment(duration).format(format);
}

/**
 * 将金额数字格式化展示，默认是 3位数一隔
 *
 * @export
 * @param {number} [duration] 需要格式化的数字
 * @param {string} [locales='zh-CN'] 需要格式化成哪种形式
 * @param {Intl.NumberFormatOptions} [option={ style: 'currency', currency: 'CNY' }] 需要格式化为哪种形式 参见 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
 * @return {string}  {string}
 */
export function fmt$(
  duration?: number | number[],
  locales: string = 'zh-CN',
  option: Intl.NumberFormatOptions = { style: 'currency', currency: 'CNY' },
): string {
  if (duration === undefined || duration === null) {
    return ' - ';
  }
  if (isArray(duration)) {
    return duration.map((v) => v.toLocaleString(locales, option)).join(' - ');
  }
  return duration.toLocaleString(locales, option);
}

/**
 * 1. 格式化展示文本内容,作用很简单,就是将空值展示为 ' - '
 * 2. 从对象里面获取指定value，key为空的情况下返回  ' - '
 * @export
 * @template T
 * @param {(string | number | null)} key
 * @param {Record<string, T>} [map] 在此参数不为空时从map里面获取指定value,value空的情况下返回  ' - '
 * @return {*}  {(T | number | string)}
 */
export function fmtM<T = string>(
  key?: string | number | null,
  map?: Record<string, T>,
): T | number | string {
  if (!isNumber(key) && !key) {
    return ' - ';
  }
  if (map) {
    if (!map[key]) {
      return ' - ';
    }
    return map[key];
  }
  return key;
}
// const fontFamily = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`;
// const preStyle: CSSProperties = {
//   fontFamily,
//   marginBottom: 'auto',
//   overflow: 'hidden',
//   whiteSpace: 'normal',
//   wordBreak: 'break-all',
// };
// /**
//  * 原样展示文本内容，主要针对多个空格的情况
//  * html会将多个空格展示为一个空格，这里使用 pre 标签，强制原样展示
//  * @export
//  * @template T
//  * @param {(string | number | null)} [key]
//  * @param {Record<string, T>} [map]
//  * @return {*}
//  */
// export function fmtMP<T = string>(
//   key?: string | number | null,
//   map?: Record<string, T>,
// ): string | React.ReactNode {
//   if (!isNumber(key) && !key) {
//     return ' - ';
//   }
//   if (map) {
//     if (!map[key]) {
//       return ' - ';
//     }
//     return React.createElement('pre', { style: preStyle }, map[key]);
//   }
//   return React.createElement('pre', { style: preStyle }, key);
// }

/**
 * 这个函数的主要作用是将 moment 类型的数据转成时间戳,形如：
 * - `moment` -> `1604313636705`
 *
 * - 如果传入参数是区间的话,那么有精确的"天"的问题,
 * - 设置了format参数为'day'的情况下就会是如下情况
 * - [2020-12-11 xx:xx:xx,2020-12-11 xx:xx:xx] => [2020-12-11 00:00:00,2020-12-11 23:59:59]
 * @export
 * @param {(Moment | undefined | null)} range
 * @param {moment.unitOfTime.StartOf} format
 * @returns {(number | undefined | null)}
 */
export function fmtDate(
  range: Moment | undefined | null,
  format?: moment.unitOfTime.StartOf,
): number | undefined | null;

/**
 * 这个函数的主要作用是将 moment 类型的数据转成时间戳,形如：
 * - `[moment,moment]` -> `[1604313636705,1604313636705]`
 *
 * - 如果传入参数是区间的话,那么有精确的"天"的问题,
 * - 设置了format参数为'day'的情况下就会是如下情况
 * - [2020-12-11 xx:xx:xx,2020-12-11 xx:xx:xx] => [2020-12-11 00:00:00,2020-12-11 23:59:59]
 *
 * @export
 * @param {[Moment?, Moment?]} range
 * @param {moment.unitOfTime.StartOf} format
 * @returns {[number?, number?]}
 */
// eslint-disable-next-line no-redeclare
export function fmtDate(
  range: [Moment?, Moment?] | undefined,
  format?: moment.unitOfTime.StartOf,
): [number?, number?];

/**
 * 这个函数的主要作用是将 moment 类型的数据转成时间戳,形如：
 * - `moment` -> `1604313636705`
 * - `[moment,moment]` -> `[1604313636705,1604313636705]`
 *
 * - 如果传入参数是区间的话,那么有精确的"天"的问题,
 * - 设置了format参数为'day'的情况下就会是如下情况
 * - [2020-12-11 xx:xx:xx,2020-12-11 xx:xx:xx] => [2020-12-11 00:00:00,2020-12-11 23:59:59]
 * @export
 * @param {*} range
 * @param {unitOfTime.StartOf} [format='ms']
 * @returns {*}
 */
// eslint-disable-next-line no-redeclare
export function fmtDate(range: any, format: unitOfTime.StartOf = 'ms'): any {
  if (!range) {
    return [];
  }
  if (isArray(range)) {
    const [start, end] = range;
    return [
      moment.isMoment(start) ? start.startOf(format).valueOf() : start,
      moment.isMoment(end) ? end.endOf(format).valueOf() : end,
    ];
  }
  return moment.isMoment(range) ? range.valueOf() : range;
}

/**
 * 将文件转换为base64
 *
 * @export
 * @param {RcFile} file
 * @return {*}  {Promise<string>}
 */
export function getFileBase64(file: RcFile): Promise<string> {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      resolve(e.target?.result?.toString() ?? '');
    };
  });
}

/**
 * 将文件转换为纯文本
 *
 * @export
 * @param {RcFile} file
 * @return {*}  {Promise<string>}
 */
export function getFileText(file: RcFile): Promise<string> {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = (e) => {
      resolve(e.target?.result?.toString() ?? '');
    };
  });
}
