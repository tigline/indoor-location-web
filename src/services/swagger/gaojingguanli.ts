// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 分页获取告警信息 GET /api/v1/alarms */
export async function pageAlarm(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageAlarmParams,
  options?: { [key: string]: any },
) {
  return request<API.RestValuePageResultAlarmInfo>('/api/v1/alarms', {
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

/** (批量)删除告警 DELETE /api/v1/alarms */
export async function deleteAlarm(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAlarmParams,
  options?: { [key: string]: any },
) {
  return request<API.RestValueBoolean>('/api/v1/alarms', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 告警处理 PUT /api/v1/alarms/${param0}/${param1} */
export async function dealWithAlarm(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dealWithAlarmParams,
  options?: { [key: string]: any },
) {
  const { alarmId: param0, status: param1, ...queryParams } = params;
  return request<API.RestValueBoolean>(`/api/v1/alarms/${param0}/${param1}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}
