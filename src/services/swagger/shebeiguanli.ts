// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 分页获取标签列表 GET /api/v1/beacon */
export async function pageBeacon(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageBeaconParams,
  options?: { [key: string]: any },
) {
  return request<API.RestValuePageResultBeaconInfo>('/api/v1/beacon', {
    method: 'GET',
    params: {
      // current has a default value: 1
      current: '1',
      // size has a default value: 10
      size: '10',
      ...params,
    },
    ...(options || {}),
  });
}

/** 添加标签信息 POST /api/v1/beacon */
export async function addBeacon(body: API.AddBeaconInfo, options?: { [key: string]: any }) {
  return request<API.RestValueBoolean>('/api/v1/beacon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取网关列表 GET /api/v1/gateway */
export async function pageGateway(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageGatewayParams,
  options?: { [key: string]: any },
) {
  return request<API.RestValuePageResultGatewayInfo>('/api/v1/gateway', {
    method: 'GET',
    params: {
      // current has a default value: 1
      current: '1',
      // size has a default value: 10
      size: '10',
      ...params,
    },
    ...(options || {}),
  });
}

/** 添加网关信息 POST /api/v1/gateway */
export async function addGateway(body: API.AddGatewayInfo, options?: { [key: string]: any }) {
  return request<API.RestValueBoolean>('/api/v1/gateway', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取标签轨迹 GET /api/v1/location */
export async function listBeaconLocation(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listBeaconLocationParams,
  options?: { [key: string]: any },
) {
  return request<API.RestValueListAoaDataInfo>('/api/v1/location', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
