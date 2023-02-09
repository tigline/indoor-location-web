// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 登录 POST /api/v1/login */
export async function login(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.loginParams & {
    // header
    Authorization?: { id?: number };
  },
  body: API.LoginInfo,
  options?: { [key: string]: any },
) {
  return request<API.RestValueTokenInfo>('/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

/** 刷新token POST /api/v1/refreshToken */
export async function refreshToken(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.refreshTokenParams & {
    // header
    Authorization?: { id?: number };
  },
  options?: { [key: string]: any },
) {
  return request<API.RestValueTokenInfo>('/api/v1/refreshToken', {
    method: 'POST',
    headers: {},
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 注册 POST /api/v1/register */
export async function register(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.registerParams & {
    // header
    Authorization?: { id?: number };
  },
  body: API.RegistryInfo,
  options?: { [key: string]: any },
) {
  return request<API.RestValueBoolean>('/api/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}
