// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更改用户角色 PUT /api/v1/user/role */
export async function updateUserRole(body: API.UpdateUserRole, options?: { [key: string]: any }) {
  return request<API.RestValueBoolean>('/api/v1/user/role', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户信息 GET /api/v1/userInfo */
export async function getUserInfo(options?: { [key: string]: any }) {
  return request<API.RestValueUserInfo>('/api/v1/userInfo', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新用户信息 PUT /api/v1/userInfo/${param0} */
export async function updateUserInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateUserInfoParams,
  body: API.UpdateUserInfo,
  options?: { [key: string]: any },
) {
  const { userId: param0, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/userInfo/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取用户列表 GET /api/v1/users */
export async function pageUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageUserParams,
  options?: { [key: string]: any },
) {
  return request<API.RestValuePageResultUserInfo>('/api/v1/users', {
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
