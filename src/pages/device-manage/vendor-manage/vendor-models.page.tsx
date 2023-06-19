import { RemoveButtonPopover } from '@/components/remove-button.popover';
import { deleteMap, listMaps } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useIntl, useMatch, useRequest, Link } from '@umijs/max';
import { Button, notification } from 'antd';

import { EditCompanyModal } from './components/edit-vendor.modal';
// import { EditMapModal } from './components/edit-map.modal';


/**
 * @export
 * @return {*}
 */
export default function VendorModelPage() {
  const match = useMatch<'CompanyId', string>('/device-manage/vendor-manage/vendor-models/:CompanyId');
  const CompanyId = match?.params.CompanyId;
  const intl = useIntl();

  // const { run, loading } = useRequest(deleteMap, {
  //   manual: true,
  //   fetchKey(params) {
  //     return params.mapId;
  //   },
  //   onSuccess(res) {
  //     if (res) {
  //       notification.success({
  //         message: intl.formatMessage({ id: 'app.remove.success', defaultMessage: '删除成功' }),
  //       });
  //     }
  //   },
  // });

  const columns: ProColumns<API.TSLModelInfo>[] = [

    {
      title: intl.formatMessage({
        id: 'pages.device-manage.vendor-manage.company.code',
        defaultMessage: '物模型编码',
      }),
      dataIndex: 'modelCode',
    },

    {
      title: intl.formatMessage({
        id: 'pages.device-manage.vendor-manage.company.name',
        defaultMessage: '公司名称',
      }),
      dataIndex: 'companyName',
    },

    {
      title: intl.formatMessage({
        id: 'pages.device-manage.vendor-manage.company.createTime',
        defaultMessage: '创建时间',
      }),
      dataIndex: 'createTime',
    },

    {
      title: intl.formatMessage({
        id: 'pages.device-manage.vendor-manage.company.active',
        defaultMessage: '激活状态',
      }),
      dataIndex: 'active',
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
          {/* <EditMapModal disabled={!record.mapId} record={record}></EditMapModal>
          <ViewMapModal record={record}></ViewMapModal> */}
          {/* <RemoveButtonPopover
            disabled={!record.CompanyId}
            loading={loading}
            onClick={() =>
              run({ mapId: record.companyId! }).then(() => {
                action?.reload();
              })
            }
          /> */}
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
        toolBarRender={(action) => [

          <Button key="add">
            <Link to={`/device-manage/vendor-manage/thing-models-manage/add-thing-model`}>
              {intl.formatMessage({ id: 'app', defaultMessage: '+ 添加' })}
            </Link>
          </Button>

        ]}

      // request={(param) =>
      // //   listMaps({ buildingId: buildingId!, name: param.name }).then((res) => {
      // //     return {
      // //       data: res.data,
      // //       success: res.code === OK,
      // //     };
      // //   })
      // }
      ></ProTable>
    </PageContainer>
  );
}
