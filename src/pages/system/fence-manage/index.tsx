import { RemoveButtonPopover } from '@/components/remove-button.popover';
import { UpdateFenceModal } from '@/pages/system/fence-manage/components/update-fence.modal';
import { deleteFence, pageFence } from '@/services/swagger/xitongguanli';
import { fmtPage } from '@/utils/global.utils';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button } from 'antd';
import { AddFenceModal } from './components/add-fence.modal';
import { SwitchFenceButton } from './components/switch-fence.button';
import { ViewFenceModal } from './components/view-fence.modal';

export default function Page() {
  const intl = useIntl();
  const STATUS_ENUM = new Map();
  STATUS_ENUM.set(
    true,
    intl.formatMessage({
      id: 'pages.system.fence-manage.fence.status.enable',
      defaultMessage: '启用',
    }),
  );
  STATUS_ENUM.set(
    false,
    intl.formatMessage({
      id: 'pages.system.fence-manage.fence.status.disable',
      defaultMessage: '禁用',
    }),
  );
  const { run: remove, fetches } = useRequest(deleteFence, {
    manual: true,
    fetchKey: (o) => o.fenceId,
  });
  const { run } = useRequest(pageFence, {
    manual: true,
    formatResult: (res) => fmtPage(res),
  });
  const columns: ProColumns<API.FenceAndMapInfo>[] = [
    // {
    //   dataIndex: 'index',
    //   valueType: 'indexBorder',
    //   width: 48,
    // },
    {
      title: intl.formatMessage({
        id: 'pages.system.fence-manage.map.name',
        defaultMessage: '地图名称',
      }),
      dataIndex: 'mapName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.fence-manage.fence.name',
        defaultMessage: '围栏名称',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.fence-manage.fence.type',
        defaultMessage: '围栏类型',
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
      title: intl.formatMessage({
        id: 'pages.system.fence-manage.fence.status',
        defaultMessage: '围栏状态',
      }),
      dataIndex: 'enabled',
      // readonly: true,
      // valueType: 'tags',
      hideInForm: true,
      valueEnum: STATUS_ENUM,
    },
    {
      title: intl.formatMessage({ id: 'app.action', defaultMessage: '操作' }),
      valueType: 'option',
      key: 'option',
      render: (_, record, __, action) => (
        <Button.Group>
          <SwitchFenceButton record={record} refresh={action?.reload} />
          <ViewFenceModal record={record} />
          <UpdateFenceModal record={record} refresh={action?.reload} />
          <RemoveButtonPopover
            disabled={!record.fenceId}
            loading={fetches?.[record.fenceId!]?.loading}
            onClick={() => remove({ fenceId: record.fenceId! }).then(() => action?.reload())}
          />
        </Button.Group>
      ),
    },
  ];
  return (
    <PageContainer childrenContentStyle={{padding:20}}>
      <ProTable
        options={{ setting: false }}
        columns={columns}
        toolBarRender={(action) => [
          <AddFenceModal key="add" refresh={action?.reload}></AddFenceModal>,
        ]}
        rowKey={(o) => o.fenceId + ''}
        request={(param) => {
          const { current, pageSize, ...rest } = param;
          return run({ current: current + '', size: pageSize + '', ...rest });
        }}
      />
    </PageContainer>
  );
}
