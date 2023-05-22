import { RemoveButtonPopover } from '@/components/remove-button.popover';
import { deleteBeacon, pageBeacon } from '@/services/swagger/shebeiguanli';
import { fmtPage } from '@/utils/global.utils';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Link, useIntl, useModel, useRequest } from '@umijs/max';
import { Button } from 'antd';
import qs from 'qs';
import React from 'react';
import { AddLabelModal } from './components/add-label.modal';
import { EditLabelModal } from './components/edit-label.modal';

export default function Page() {
  const actionRef = React.useRef<ActionType>();
  const { beacons } = useModel('messageSocket');
  const intl = useIntl();
  const { run: remove, fetches } = useRequest(deleteBeacon, {
    manual: true,
    fetchKey: (o) => o.deviceId,
  });
  const columns: ProColumns<API.BeaconInfo>[] = [
    // {
    //   title: intl.formatMessage({
    //     id: 'pages.device-manage.base-station.device.code',
    //     defaultMessage: '编号',
    //   }),
    //   dataIndex: 'index',
    //   valueType: 'indexBorder',
    //   width: 48,
    // },
    {
      title: intl.formatMessage({
        id: 'pages.device-manage.base-station.device.code',
        defaultMessage: '编号',
      }),
      dataIndex: 'deviceId',
      copyable: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device-manage.base-station.device.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
    },
    {
      disable: true,
      title: intl.formatMessage({
        id: 'pages.device-manage.base-station.device.type',
        defaultMessage: '类型',
      }),
      dataIndex: 'type',
      search: false,
      valueType: 'select',
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      valueEnum: {
        Equipment: intl.formatMessage({
          id: 'pages.device-manage.label.device.equipment',
          defaultMessage: '装备',
        }),
        Personnel: intl.formatMessage({
          id: 'pages.device-manage.label.device.personnel',
          defaultMessage: '人员',
        }),
        Vehicle: intl.formatMessage({
          id: 'pages.device-manage.label.device.vehicle',
          defaultMessage: '车辆',
        }),
        Stuff: intl.formatMessage({
          id: 'pages.device-manage.label.device.stuff',
          defaultMessage: '材料',
        }),
      },
      // render: (_, record: any) => <Tag>{record.type}</Tag>,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device-manage.base-station.device.time',
        defaultMessage: '加入时间',
      }),
      key: 'updateTime',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
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
      valueType: 'select',
      search: false,
      valueEnum: {
        Bound: intl.formatMessage({
          id: 'pages.device-manage.label.device.bound',
          defaultMessage: '绑定',
        }),
        Unbound: intl.formatMessage({
          id: 'pages.device-manage.label.device.unbound',
          defaultMessage: '未绑定',
        }),
      },
    },
    {
      title: intl.formatMessage({
        id: 'app.action',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      key: 'option',
      render: (_, record, __, action) => (
        <Button.Group>
          <EditLabelModal record={record} refresh={action?.reload} />
          {/* 这个标签有实时位置的时候才展示跳转逻辑 */}
          {beacons?.[record.deviceId!] && (
            <Button hidden={!record.online} type="link" size="small">
              <Link
                to={`/position-manage/real-time-location${qs.stringify(
                  {
                    deviceId: record.deviceId,
                    mapId: record.mapId,
                  },
                  { addQueryPrefix: true },
                )}`}
              >
                {intl.formatMessage({
                  id: 'app.view',
                  defaultMessage: '查看地图',
                })}
              </Link>
            </Button>
          )}
          <RemoveButtonPopover
            disabled={!record.deviceId}
            onClick={() => remove({ deviceId: record.deviceId! }).then(() => action?.reload())}
            loading={fetches?.[record.deviceId!]?.loading}
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
        request={({ current, pageSize, ...rest }) =>
          pageBeacon({ current: '' + current, size: '' + pageSize, ...rest }).then((res) =>
            fmtPage(res),
          )
        }
        toolBarRender={(action) => [
          <AddLabelModal key="add" refresh={action?.reload} />,
          // <Button key="batch" icon={<PlusOutlined />} type="primary">
          //   <FormattedMessage id="app.batch.action" defaultMessage="批量操作" />
          // </Button>,
        ]}
      />
    </PageContainer>
  );
}
