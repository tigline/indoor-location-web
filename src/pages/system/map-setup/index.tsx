import { RemoveButtonPopover } from '@/components/remove-button.popover';
import { deleteBuilding, listBuilding } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import { PageContainer, ProList } from '@ant-design/pro-components';
import { Link, useIntl, useRequest } from '@umijs/max';
import { Button, Image, notification } from 'antd';
import { AddBuildingModal } from './components/add-building.modal';
import { EditBuildingModal } from './components/edit-building.modal';
/**
 * 地图设置页面
 * 建筑列表页面
 * @returns
 */
export default function Page() {
  const intl = useIntl();
  const { run, fetches } = useRequest(deleteBuilding, {
    manual: true,
    fetchKey: (o) => o.buildingId,
    onSuccess(res) {
      if (res) {
        notification.success({
          message: intl.formatMessage({ id: 'app.remove.success', defaultMessage: '删除成功' }),
        });
      }
    },
  });
  return (
    <PageContainer childrenContentStyle={{padding:20}}>
      <ProList<API.BuildingInfo>
        pagination={false} // 不分页
        request={(param) => {
          return listBuilding({ name: param.name }).then((res) => {
            return {
              data: res.data,
              success: res.code === OK,
            };
          });
        }}
        search={{}}
        toolBarRender={(action) => {
          return [<AddBuildingModal key="add" refresh={action?.reload} />];
        }}
        itemLayout="vertical"
        metas={{
          title: {
            dataIndex: 'name',
            title: intl.formatMessage({
              id: 'pages.system.map-setup.building.name',
              defaultMessage: '建筑名',
            }),
            render: (_, record) => record.name,
          },
          description: {
            render: (_, record) => record.address,
            search: false,
          },
          actions: {
            cardActionProps: 'extra',
            render: (_, record, __, action) => [
              <EditBuildingModal
                key="add"
                disabled={!record.buildingId}
                record={record}
                refresh={action?.reload}
              />,
              <Button key="view">
                <Link to={`/system/map-setup/floor-manager.page/${record.buildingId}`}>
                  {intl.formatMessage({ id: 'app.view', defaultMessage: '查看' })}
                </Link>
              </Button>,
              <RemoveButtonPopover
                key="remove"
                size="middle"
                type="default"
                disabled={!record.buildingId}
                onClick={() =>
                  run({ buildingId: record.buildingId! }).then(() => {
                    action?.reload();
                  })
                }
                loading={fetches?.[record.buildingId!]?.loading}
              />,
            ],
          },
          content: {
            render: () => ' ',
            search: false,
          },
          extra: {
            search: false,
            render: (_: any, record: API.BuildingInfo) => (
              <Image width={400} height={200} alt="logo" src={record.picture} />
            ),
          },
        }}
      ></ProList>
    </PageContainer>
  );
}
