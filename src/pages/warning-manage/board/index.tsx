import { dealWithAlarm, deleteAlarm, pageAlarm } from '@/services/swagger/gaojingguanli';
import { fmt, OK } from '@/utils/global.utils';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Dropdown, notification } from 'antd';
import * as dayjs from 'dayjs';

export default function Page() {
  const intl = useIntl();
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
  const { run: deal, fetches: dealFetches } = useRequest(dealWithAlarm, {
    manual: true,
    fetchKey: (o) => o.alarmId + '',
    formatResult: (res) => res,
    onSuccess(res) {
      if (res.code === OK) {
        notification.success({
          message: intl.formatMessage({
            id: 'pages.system.warning-manage.board.deal.success',
            defaultMessage: '处理警告成功',
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
            id: 'pages.system.warning-manage.board.Unprocessed',
            defaultMessage: '未处理',
          }),
          status: 'Error',
        },
        Processed: {
          text: intl.formatMessage({
            id: 'pages.system.warning-manage.board.Processed',
            defaultMessage: '已处理',
          }),
          status: 'Success',
        },
        Ignored: {
          text: intl.formatMessage({
            id: 'pages.system.warning-manage.board.Ignored',
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
          <Dropdown
            menu={{
              onClick: ({ key }) => {
                deal({
                  alarmId: record.alarmId!,
                  status: key as API.dealWithAlarmParams['status'],
                });
              },
              items: [
                {
                  key: 'Unprocessed',
                  label: intl.formatMessage({
                    id: 'pages.system.warning-manage.board.Unprocessed',
                    defaultMessage: '未处理',
                  }),
                },
                {
                  key: 'Processed',
                  label: intl.formatMessage({
                    id: 'pages.system.warning-manage.board.Processed',
                    defaultMessage: '已处理',
                  }),
                },
                {
                  key: 'Ignored',
                  label: intl.formatMessage({
                    id: 'pages.system.warning-manage.board.Ignored',
                    defaultMessage: '忽略',
                  }),
                },
              ],
            }}
          >
            <Button
              disabled={!record.alarmId}
              loading={dealFetches?.[record.alarmId!]?.loading}
              type="link"
              onClick={(e) => e.preventDefault()}
            >
              <FormattedMessage
                id="pages.system.warning-manage.board.deal"
                defaultMessage="处理警告"
              />
            </Button>
          </Dropdown>
          <Button
            type="link"
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
          return pageAlarm({
            current: current + '',
            size: pageSize + '',
            ...rest,
          }).then((res) => {
            return {
              data: res.data?.items,
              total: res.data?.total,
              success: res.code === OK,
            };
          });
        }}
      ></ProTable>
    </PageContainer>
  );
}
