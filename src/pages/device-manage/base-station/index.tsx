import { RemoveButtonPopover } from '@/components/remove-button.popover';
import { deleteGateway, pageGateway } from '@/services/swagger/shebeiguanli';
import { fmt, fmtPage } from '@/utils/global.utils';
import { FormattedMessage } from '@@/exports';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Link, useIntl, useRequest } from '@umijs/max';
import { Button, notification, Tag } from 'antd';
import qs from 'qs';
import React from 'react';
import { AddBaseStationModal } from './components/add-base-station.modal';
import { EditBaseStationModal } from './components/edit-base-station.modal';

export default function Page() {
  const actionRef = React.useRef<ActionType>();
  const intl = useIntl();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
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
  const { run: batchRemove, loading } = useRequest(
    (param: { gateways: string[] }) => Promise.resolve(param),
    {
      manual: true,
      onSuccess(res) {
        if (res) {
          notification.success({
            message: intl.formatMessage({ id: 'app.remove.success', defaultMessage: '删除成功' }),
          });
        }
      },
    },
  );
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
          <EditBaseStationModal record={record} refresh={action?.reload} />
          {record.status === 'Online' && (
            <Button type="link" size="small">
              <Link
                to={`/position-manage/real-time-location${qs.stringify(
                  {
                    gateway: record.gateway,
                    mapId: record.mapId,
                  },
                  { addQueryPrefix: true },
                )}`}
              >
                {intl.formatMessage({ id: 'app.view', defaultMessage: '查看' })}
              </Link>
            </Button>
          )}
          <RemoveButtonPopover
            disabled={!record.gateway}
            onClick={() => remove({ gateway: record.gateway! }).then(() => action?.reload())}
            title={intl.formatMessage({
              id: 'pages.searchTable.batchDeletion',
              defaultMessage: '你确定要删除此项吗?',
            })}
          />
        </Button.Group>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable
        options={{ setting: false }}
        actionRef={actionRef}
        columns={columns}
        request={({ current, pageSize, ...rest }) => {
          return pageGateway({ current: '' + current, size: '' + pageSize, ...rest }).then(
            (res) => {
              return fmtPage(res);
            },
          );
        }}
        rowKey={(o) => `${o.gateway}`}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        tableAlertRender={({ selectedRowKeys }) => (
          <RemoveButtonPopover
            onClick={() =>
              batchRemove({ gateways: selectedRowKeys.map((item) => `${item}`) }).then(() =>
                actionRef.current?.reload(),
              )
            }
            loading={loading}
          >
            <Button type="link">
              <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
            </Button>
          </RemoveButtonPopover>
        )}
        toolBarRender={(action) => [
          <AddBaseStationModal key="add" refresh={action?.reload}></AddBaseStationModal>,
        ]}
      />
    </PageContainer>
  );
}
