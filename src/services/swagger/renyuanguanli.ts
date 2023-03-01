// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 添加部门 POST /api/v1/departments */
export async function addDepartment(
  body: API.AddOrUpdateDepartment,
  options?: { [key: string]: any },
) {
  return request<API.RestValueBoolean>('/api/v1/departments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑部门信息 PUT /api/v1/departments/${param0} */
export async function updateDepartment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateDepartmentParams,
  body: API.AddOrUpdateDepartment,
  options?: { [key: string]: any },
) {
  const { depId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/departments/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除部门 DELETE /api/v1/departments/${param0} */
export async function deleteDepartment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteDepartmentParams,
  options?: { [key: string]: any },
) {
  const { depId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/departments/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页获取人员信息 GET /api/v1/personnel */
export async function pagePersonnel(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pagePersonnelParams,
  options?: { [key: string]: any },
) {
  return request<API.RestValuePageResultPersonnelFillInfo>('/api/v1/personnel', {
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

/** 添加人员信息 POST /api/v1/personnel */
export async function addPersonnel(
  body: API.AddOrUpdatePersonnel,
  options?: { [key: string]: any },
) {
  return request<API.RestValueBoolean>('/api/v1/personnel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑人员信息 PUT /api/v1/personnel/${param0} */
export async function updatePersonnel(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updatePersonnelParams,
  body: API.AddOrUpdatePersonnel,
  options?: { [key: string]: any },
) {
  const { personnelId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/personnel/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除人员信息 DELETE /api/v1/personnel/${param0} */
export async function deletePersonnel(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePersonnelParams,
  options?: { [key: string]: any },
) {
  const { personnelId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/personnel/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 解绑人员标签 DELETE /api/v1/personnel/${param0}/${param1} */
export async function unbindTag1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.unbindTag1Params,
  options?: { [key: string]: any },
) {
  const { personnelId: param0, tag: param1, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/personnel/${param0}/${param1}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页获取人员类型 GET /api/v1/personnelTypes */
export async function pagePersonnelType(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pagePersonnelTypeParams,
  options?: { [key: string]: any },
) {
  return request<API.RestValuePageResultPersonnelTypeInfo>('/api/v1/personnelTypes', {
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

/** 添加人员分类 POST /api/v1/personnelTypes */
export async function addPersonnelType(
  body: API.AddOrUpdatePersonnelType,
  options?: { [key: string]: any },
) {
  return request<API.RestValueBoolean>('/api/v1/personnelTypes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑人员分类 PUT /api/v1/personnelTypes/${param0} */
export async function updatePersonnelType(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updatePersonnelTypeParams,
  body: API.AddOrUpdatePersonnelType,
  options?: { [key: string]: any },
) {
  const { typeId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/personnelTypes/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取所有部门 GET /api/v1/treeDepartment */
export async function treeDepartment(options?: { [key: string]: any }) {
  return request<API.RestValueListDepartmentTree>('/api/v1/treeDepartment', {
    method: 'GET',
    ...(options || {}),
  });
}
