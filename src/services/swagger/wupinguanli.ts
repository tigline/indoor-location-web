// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 分页获取物品 GET /api/v1/things */
export async function pageThing(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageThingParams,
  options?: { [key: string]: any },
) {
  return request<API.RestValuePageResultThingInfo>('/api/v1/things', {
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

/** 新增物品 POST /api/v1/things */
export async function addThing(body: API.AddOrUpdateThing, options?: { [key: string]: any }) {
  return request<API.RestValueBoolean>('/api/v1/things', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改物品 PUT /api/v1/things/${param0} */
export async function updateThing(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateThingParams,
  body: API.AddOrUpdateThing,
  options?: { [key: string]: any },
) {
  const { thingId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/things/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除物品 DELETE /api/v1/things/${param0} */
export async function deleteThing(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteThingParams,
  options?: { [key: string]: any },
) {
  const { thingId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/things/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 解绑物品标签 DELETE /api/v1/things/${param0}/${param1} */
export async function unbindTag(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.unbindTagParams,
  options?: { [key: string]: any },
) {
  const { thingId: param0, tag: param1, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/things/${param0}/${param1}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页获取物品分类 GET /api/v1/thingTypes */
export async function pageThingType(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageThingTypeParams,
  options?: { [key: string]: any },
) {
  return request<API.RestValuePageResultThingTypeInfo>('/api/v1/thingTypes', {
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

/** 新增物品分类 POST /api/v1/thingTypes */
export async function addThingType(
  body: API.AddOrUpdateThingType,
  options?: { [key: string]: any },
) {
  return request<API.RestValueBoolean>('/api/v1/thingTypes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改物品分类 PUT /api/v1/thingTypes/${param0} */
export async function updateThingType(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateThingTypeParams,
  body: API.AddOrUpdateThingType,
  options?: { [key: string]: any },
) {
  const { typeId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/thingTypes/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除物品分类 DELETE /api/v1/thingTypes/${param0} */
export async function deleteThingType(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteThingTypeParams,
  options?: { [key: string]: any },
) {
  const { typeId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/thingTypes/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
