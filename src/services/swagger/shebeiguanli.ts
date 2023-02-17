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

/** 修改标签信息 PUT /api/v1/beacon/${param0} */
export async function updateBeacon(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateBeaconParams,
  body: API.UpdateBeacon,
  options?: { [key: string]: any },
) {
  const { deviceId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/beacon/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除标签 DELETE /api/v1/beacon/${param0} */
export async function deleteBeacon(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBeaconParams,
  options?: { [key: string]: any },
) {
  const { deviceId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/beacon/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
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

/** 删除网关 DELETE /api/v1/gateway/${param0} */
export async function deleteGateway(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteGatewayParams,
  options?: { [key: string]: any },
) {
  const { gateway: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/gateway/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 编辑网关信息 PUT /api/v1/gateway${param0} */
export async function updateGateway(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateGatewayParams,
  body: API.UpdateGateway,
  options?: { [key: string]: any },
) {
  const { gateway: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/gateway${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
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
