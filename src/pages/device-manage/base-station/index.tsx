import { RemoveButtonPopover } from '@/components/remove-button.popover';
import { deleteGateway, pageGateway } from '@/services/swagger/shebeiguanli';
import { fmt, fmtPage } from '@/utils/global.utils';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, notification, Tag } from 'antd';
import React from 'react';
import { AddBaseStationModal } from './components/add-base-station.modal';

export default function Page() {
  const actionRef = React.useRef<ActionType>();
  const intl = useIntl();
  const { run: remove } = useRequest(deleteGateway, {
    manual: true,
    onSuccess(data) {
      if (data) {
        notification.success({
          message: intl.formatMessage({ id: 'app.remove.success', defaultMessage: '删除成功' }),
        });
      }
    },
  });
  const columns: ProColumns<API.GatewayInfo>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device-manage.base-station.device.code',
        defaultMessage: '编号',
      }),
      dataIndex: 'gateway',
      copyable: true,
      ellipsis: true,
      // tip: '标题过长会自动收缩',
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.device-manage.base-station.device.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      // tip: '标题过长会自动收缩',
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
    },

    {
      disable: true,
      title: intl.formatMessage({
        id: 'pages.device-manage.base-station.device.type',
        defaultMessage: '类型',
      }),
      dataIndex: 'type',
      search: false,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record) => <Tag>{record.type}</Tag>,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device-manage.base-station.device.time',
        defaultMessage: '加入时间',
      }),
      key: 'showTime',
      dataIndex: 'updateTime',
      valueType: 'dateTimeRange',
      sorter: true,
      hideInSearch: true,
      render(_, entity) {
        return fmt(entity.updateTime);
      },
    },
    {
      disable: true,
      title: intl.formatMessage({
        id: 'pages.device-manage.base-station.device.state',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      ellipsis: true,
      search: false,
      valueType: 'select',
      valueEnum: {
        Online: intl.formatMessage({
          id: 'pages.device-manage.base-station.device.status.online',
          defaultMessage: '在线',
        }),
        Offline: intl.formatMessage({
          id: 'pages.device-manage.base-station.device.status.offline',
          defaultMessage: '离线',
        }),
      },
    },
    {
      title: intl.formatMessage({ id: 'app.action', defaultMessage: '操作' }),
      valueType: 'option',
      key: 'option',
      render: (_, record, __, action) => (
        <Button.Group>
          <Button type="link">
            <FormattedMessage id="app.copy" defaultMessage="复制" />
          </Button>
          <RemoveButtonPopover
            disabled={!record.gateway}
            onClick={() => remove({ gateway: record.gateway! }).then(() => action?.reload())}
          />
        </Button.Group>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={({ current, pageSize, ...rest }) => {
          return pageGateway({ current: '' + current, size: '' + pageSize, ...rest }).then(
            (res) => {
              return fmtPage(res);
            },
          );
        }}
        toolBarRender={(action) => [
          <AddBaseStationModal key="add" refresh={action?.reload}></AddBaseStationModal>,
          <Button key="batch" type="primary">
            <FormattedMessage id="app.batch.action" defaultMessage="批量操作" />
          </Button>,
        ]}
      />
    </PageContainer>
  );
}
