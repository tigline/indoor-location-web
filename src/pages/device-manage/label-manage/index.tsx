import { deleteBeacon, pageBeacon } from '@/services/swagger/shebeiguanli';
import { OK } from '@/utils/global.utils';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Tag } from 'antd';
import React from 'react';
import { AddLabelModal } from './components/add-label.modal';

export default function Page() {
  const actionRef = React.useRef<ActionType>();
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
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record: any) => <Tag>{record.type}</Tag>,
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
      valueEnum: {
        all: { text: '超长'.repeat(50) },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
          disabled: true,
        },
        processing: {
          text: '解决中',
          status: 'Processing',
        },
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
          <Button type="link">
            <FormattedMessage id="app.copy" defaultMessage="复制" />
          </Button>
          <Button
            type="link"
            disabled={!record.deviceId}
            onClick={() => remove({ deviceId: record.deviceId! }).then(() => action?.reload())}
            loading={fetches?.[record.deviceId!]?.loading}
          >
            <FormattedMessage id="app.remove" defaultMessage="删除" />
          </Button>
        </Button.Group>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={({ current, pageSize, ...rest }) =>
          pageBeacon({
            current: '' + current,
            size: '' + pageSize,
            ...rest,
          }).then((res) => {
            return {
              data: res.data?.items?.map((item) => {
                // 后台保存的是10位的时间戳，前端使用的13位的时间戳，这里转换一下
                const updateTime = item.updateTime ? item.updateTime * 1000 : undefined;
                return { ...item, updateTime };
              }),
              total: res.data?.total,
              success: res.code === OK,
            };
          })
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
