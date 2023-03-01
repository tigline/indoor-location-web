// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取建筑列表 GET /api/v1/buildings */
export async function listBuilding(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listBuildingParams,
  options?: { [key: string]: any },
) {
  return request<API.RestValueListBuildingInfo>('/api/v1/buildings', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 添加建筑 POST /api/v1/buildings */
export async function addBuilding(body: API.AddOrUpdateBuilding, options?: { [key: string]: any }) {
  return request<API.RestValueBoolean>('/api/v1/buildings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑建筑 PUT /api/v1/buildings/${param0} */
export async function updateBuilding(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateBuildingParams,
  body: API.AddOrUpdateBuilding,
  options?: { [key: string]: any },
) {
  const { buildingId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/buildings/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除建筑 DELETE /api/v1/buildings/${param0} */
export async function deleteBuilding(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBuildingParams,
  options?: { [key: string]: any },
) {
  const { buildingId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/buildings/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页获取电子围栏列表 GET /api/v1/fences */
export async function pageFence(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageFenceParams,
  options?: { [key: string]: any },
) {
  return request<API.RestValuePageResultFenceAndMapInfo>('/api/v1/fences', {
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

/** 添加地理围栏 POST /api/v1/fences */
export async function addFence(body: API.AddOrUpdateFenceInfo, options?: { [key: string]: any }) {
  return request<API.RestValueBoolean>('/api/v1/fences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取指定围栏信息 GET /api/v1/fences/${param0} */
export async function getFence(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFenceParams,
  options?: { [key: string]: any },
) {
  const { fenceId: param0, ...queryParams } = params;
  return request<API.RestValueFenceInfo>(`/api/v1/fences/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 编辑地理围栏 POST /api/v1/fences/${param0} */
export async function updateFence(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateFenceParams,
  body: API.AddOrUpdateFenceInfo,
  options?: { [key: string]: any },
) {
  const { fenceId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/fences/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除地理围栏 DELETE /api/v1/fences/${param0} */
export async function deleteFence(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteFenceParams,
  options?: { [key: string]: any },
) {
  const { fenceId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/fences/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 切换围栏状态 PUT /api/v1/fences/${param0}/switch */
export async function switchFenceStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.switchFenceStatusParams,
  options?: { [key: string]: any },
) {
  const { fenceId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/fences/${param0}/switch`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

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

/** 获取单个地图信息 GET /api/v1/maps/${param0} */
export async function getMap(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMapParams,
  options?: { [key: string]: any },
) {
  const { mapId: param0, ...queryParams } = params;
  return request<API.RestValueMapInfo>(`/api/v1/maps/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
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
