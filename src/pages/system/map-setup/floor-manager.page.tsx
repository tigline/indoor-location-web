import { RemoveButtonPopover } from '@/components/remove-button.popover';
import { deleteMap, listMaps } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useIntl, useMatch, useRequest } from '@umijs/max';
import { Button, notification } from 'antd';
import { AddMapModal } from './components/add-map.modal';
import { EditMapModal } from './components/edit-map.modal';
import { ViewMapModal } from './components/view-map.modal';

/**
 * 地图管理
 * 每个楼层应该只有一张地图，因此 楼层就是地图
 * @export
 * @return {*}
 */
export default function FloorManagerPage() {
  const match = useMatch<'buildingId', string>('/system/map-setup/floor-manager.page/:buildingId');
  const buildingId = match?.params.buildingId;
  const intl = useIntl();
  const { run, loading } = useRequest(deleteMap, {
    manual: true,
    fetchKey(params) {
      return params.mapId;
    },
    onSuccess(res) {
      if (res) {
        notification.success({
          message: intl.formatMessage({ id: 'app.remove.success', defaultMessage: '删除成功' }),
        });
      }
    },
  });
  const columns: ProColumns<API.MapInfo>[] = [
    // {
    //   dataIndex: 'index',
    //   valueType: 'indexBorder',
    //   width: 48,
    // },
    {
      title: intl.formatMessage({
        id: 'pages.system.map-setup.map.name',
        defaultMessage: '地图名称',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.map-setup.map.floor',
        defaultMessage: '楼层',
      }),
      dataIndex: 'floor',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.map-setup.map.id',
        defaultMessage: '唯一标识',
      }),
      search: false,
      dataIndex: 'mapId',
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
          <EditMapModal disabled={!record.mapId} record={record}></EditMapModal>
          <ViewMapModal record={record}></ViewMapModal>
          <RemoveButtonPopover
            disabled={!record.mapId}
            loading={loading}
            onClick={() =>
              run({ mapId: record.mapId! }).then(() => {
                action?.reload();
              })
            }
          />
        </Button.Group>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.MapInfo>
        options={{ setting: false }}
        pagination={false}
        columns={columns}
        toolBarRender={(action) => {
          return [<AddMapModal buildingId={buildingId} key="add" refresh={action?.reload} />];
        }}
        request={(param) =>
          listMaps({ buildingId: buildingId!, name: param.name }).then((res) => {
            return {
              data: res.data,
              success: res.code === OK,
            };
          })
        }
      ></ProTable>
    </PageContainer>
  );
}
