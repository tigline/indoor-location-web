import { ILocation } from '@/models/messageSocket';
import { deleteAlarm, pageAlarm } from '@/services/swagger/gaojingguanli';
import { fmt, fmtPage, OK } from '@/utils/global.utils';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useModel, useRequest } from '@umijs/max';
import { ReadyState } from 'ahooks/lib/useWebSocket';
import { Button, notification, Space } from 'antd';
import * as dayjs from 'dayjs';
import React from 'react';
import { v4 } from 'uuid';
import { DealAlarmModal } from './components/deal-alarm.modal';

export default function Page() {
  const intl = useIntl();
  const [open, setOpen] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<API.AlarmInfo>();
  const [api, contextHolder] = notification.useNotification();
  const { readyState, connect, data } = useModel('messageSocket');
  React.useEffect(() => {
    if (ReadyState.Closed === readyState) {
      connect?.();
    }
  }, [readyState]);
  React.useEffect(() => {
    const key = v4();
    if (data) {
      const res = JSON.parse(data) as ILocation;
      if (res.type === 'Alarm') {
        const alarm = res.data as API.AlarmInfo;
        api.warning({
          message: intl.formatMessage({
            id: 'pages.system.warning-manage.board.title',
            defaultMessage: '围栏告警',
          }),
          key,
          description: alarm.content,
          // description: 'hello 非法闯入',
          btn: (
            <Space>
              <Button type="link" size="small" onClick={() => api.destroy()}>
                {intl.formatMessage({
                  id: 'pages.system.warning-manage.board.ignored',
                  defaultMessage: '忽略',
                })}
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  api.destroy(key);
                  setOpen(true);
                  setSelected(alarm);
                }}
              >
                {intl.formatMessage({
                  id: 'pages.system.warning-manage.board.deal',
                  defaultMessage: '处理告警',
                })}
              </Button>
            </Space>
          ),
          placement: 'bottomRight',
          duration: 100,
        });
      }
    }
  }, [data]);
  const { run: remove, fetches } = useRequest(deleteAlarm, {
    manual: true,
    fetchKey: (o) => o.alarmIds.join('-'),
    formatResult: (res) => res,
    onSuccess(res) {
      if (res.code === OK) {
        notification.success({
          message: intl.formatMessage({
            id: 'app.remove.success',
            defaultMessage: '删除成功',
          }),
        });
      }
    },
  });
  const columns: ProColumns<API.AlarmInfo>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.system.warning-manage.board.fence',
        defaultMessage: '标签',
      }),
      dataIndex: 'fenceId',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.warning-manage.board.content',
        defaultMessage: '内容',
      }),
      ellipsis: true,
      dataIndex: 'content',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.warning-manage.board.status',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      valueEnum: {
        Unprocessed: {
          text: intl.formatMessage({
            id: 'pages.system.warning-manage.board.unprocessed',
            defaultMessage: '未处理',
          }),
          status: 'Error',
        },
        Processed: {
          text: intl.formatMessage({
            id: 'pages.system.warning-manage.board.processed',
            defaultMessage: '已处理',
          }),
          status: 'Success',
        },
        Ignored: {
          text: intl.formatMessage({
            id: 'pages.system.warning-manage.board.ignored',
            defaultMessage: '忽略',
          }),
          status: 'Default',
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.warning-manage.board.type',
        defaultMessage: '类型',
      }),
      dataIndex: 'type',
      valueEnum: {
        In: intl.formatMessage({
          id: 'pages.system.fence-manage.fence.type.in',
          defaultMessage: '进入',
        }),
        Out: intl.formatMessage({
          id: 'pages.system.fence-manage.fence.type.out',
          defaultMessage: '离开',
        }),
      },
    },
    {
      title: intl.formatMessage({ id: 'app.createTime', defaultMessage: '创建时间' }),
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      render(_, record) {
        return fmt(record.createTime);
      },
    },
    {
      title: intl.formatMessage({ id: 'app.updateTime', defaultMessage: '更新时间' }),
      dataIndex: 'updateTime',
      valueType: 'dateTimeRange',
      search: false,
      render(_, record) {
        return fmt(record.createTime);
      },
    },
    {
      title: intl.formatMessage({ id: 'app.action', defaultMessage: '操作' }),
      valueType: 'option',
      key: 'option',
      render: (_, record, __, action) => (
        <Button.Group>
          <DealAlarmModal record={record} />
          <Button
            type="link"
            size="small"
            disabled={!record.alarmId}
            onClick={() => remove({ alarmIds: [record.alarmId!] }).then(() => action?.reload())}
            loading={fetches?.[record.alarmId!]?.loading}
          >
            <FormattedMessage id="app.remove" defaultMessage="删除" />
          </Button>
        </Button.Group>
      ),
    },
  ];
  return (
    <PageContainer>
      {contextHolder}
      <DealAlarmModal open={open} setOpen={setOpen} record={selected} />
      <ProTable<
        API.AlarmInfo,
        API.pageAlarmParams & { createTime: [dayjs.ConfigType, dayjs.ConfigType] }
      >
        columns={columns}
        beforeSearchSubmit={(values) => {
          const { createTime, ...rest } = values;
          const [startTime, endTime] = createTime ?? [];
          return {
            ...rest,
            startTime: startTime?.valueOf(),
            endTime: endTime?.valueOf(),
          };
        }}
        request={(param) => {
          const { current, pageSize, ...rest } = param ?? {};
          return pageAlarm({ current: current + '', size: pageSize + '', ...rest }).then((res) => {
            return fmtPage(res);
          });
        }}
      ></ProTable>
    </PageContainer>
  );
}
