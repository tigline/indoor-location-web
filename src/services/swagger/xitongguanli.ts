// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取地图列表 GET /api/v1/maps */
export async function listMaps(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listMapsParams,
  options?: { [key: string]: any },
) {
  return request<API.RestValueListMapInfo>('/api/v1/maps', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 添加地图 POST /api/v1/maps */
export async function addMap(body: API.AddOrUpdateMapInfo, options?: { [key: string]: any }) {
  return request<API.RestValueBoolean>('/api/v1/maps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑地图信息 POST /api/v1/maps/${param0} */
export async function updateMap(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateMapParams,
  body: API.AddOrUpdateMapInfo,
  options?: { [key: string]: any },
) {
  const { mapId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/maps/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除地图 DELETE /api/v1/maps/${param0} */
export async function deleteMap(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMapParams,
  options?: { [key: string]: any },
) {
  const { mapId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/maps/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
