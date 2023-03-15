import { lngLatToMeters, metersToLngLat, Point } from '@antv/l7';

export const scale = 10;
/**
 * 厘米转经纬度，这里是虚构的CM，对应的是M
 * @export
 * @param {Point} m
 * @param {number} [width=0]
 * @return {*}
 */
export function convertCMtoL(m: Point, width: number = 0) {
  // FIXME: 需要处理 假的 cm 数据
  const [x, prevY] = m;
  const y = width - prevY;
  return metersToLngLat([x * scale, y * scale]);
}
export function convertLtoCM(l: Point, width: number = 0) {
  const [x, y] = lngLatToMeters(l);
  return [x / scale, width - y / scale];
}
