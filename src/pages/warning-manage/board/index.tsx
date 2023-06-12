import { RemoveButtonPopover } from '@/components/remove-button.popover';
import { deleteAlarm, pageAlarm } from '@/services/swagger/gaojingguanli';
import { fmt, fmtPage, OK } from '@/utils/global.utils';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useIntl, useModel, useRequest } from '@umijs/max';
import { Button, notification } from 'antd';
import dayjs from 'dayjs';
import { DealAlarmModal } from './components/deal-alarm.modal';
import { useEffect, useRef } from 'react';
import { ILocation } from '@/models/messageSocket';


export default function Page() {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const { data } = useModel('messageSocket');
  useEffect(() => {
    if (!data) return;
    const res = JSON.parse(data) as ILocation;
    if (res.type === 'Alarm') {
      actionRef.current?.reload();
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
      dataIndex: 'deviceId',
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
          <DealAlarmModal record={record} refresh={action?.reload} />
          <RemoveButtonPopover
            disabled={!record.alarmId}
            onClick={() => remove({ alarmIds: [record.alarmId!] }).then(() => action?.reload())}
            loading={fetches?.[record.alarmId!]?.loading}
          />
        </Button.Group>
      ),
    },
  ];
  return (
    <PageContainer childrenContentStyle={{padding:20}}>
      <ProTable<
        API.AlarmInfo,
        API.pageAlarmParams & { createTime: [dayjs.ConfigType, dayjs.ConfigType] }
      >
       options={{ setting: false }}
       actionRef={actionRef} 
        columns={columns}
        beforeSearchSubmit={(values) => {
          const { createTime, ...rest } = values;
          const [startTime, endTime] = createTime ?? [];
          return {
            ...rest,
            startTime: startTime ? dayjs(startTime)?.unix() : undefined,
            endTime: endTime ? dayjs(endTime)?.unix() : undefined,
          };
        }}
        rowKey={(o) => o.alarmId + ''}
        request={(param) => {
          const { current, pageSize, ...rest } = param ?? {};
          return pageAlarm({ current: current + '', size: pageSize + '', ...rest }).then((res) => {
            return fmtPage(res);
          });
        }}
      />
    </PageContainer>
  );
}
