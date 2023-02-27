import { deleteThingType, pageThingType } from '@/services/swagger/wupinguanli';
import { fmtPage } from '@/utils/global.utils';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, Image, notification } from 'antd';
import { AddGoodsTypeModal } from './components/add-goods-type.modal';
import { EditGoodsTypeModal } from './components/edit-goods-type.modal';

export default function Page() {
  const intl = useIntl();
  const { run: remove, fetches } = useRequest(deleteThingType, {
    manual: true,
    fetchKey: (o) => o.typeId + '',
    onSuccess(data) {
      if (data) {
        notification.success({
          message: intl.formatMessage({ id: 'app.remove.success', defaultMessage: '删除成功' }),
        });
      }
    },
  });
  const columns: ProColumns<API.ThingTypeInfo>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.goods-manage.goods.info.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'typeName',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.goods-manage.goods.info.icon',
        defaultMessage: '图标',
      }),
      search: false,
      dataIndex: 'picture',
      render(_, record) {
        return <Image width={100} height={100} src={record.picture!} />;
      },
    },
    {
      title: intl.formatMessage({ id: 'app.createTime', defaultMessage: '创建时间' }),
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'app.action', defaultMessage: '操作' }),
      search: false,
      render(_, record, __, action) {
        return (
          <Button.Group>
            <EditGoodsTypeModal key="edit" record={record} refresh={action?.reload} />
            <Button
              size="small"
              type="link"
              disabled={!record.typeId}
              loading={fetches?.[record.typeId!]?.loading}
              onClick={() => remove({ typeId: record.typeId! }).then(() => action?.reload())}
            >
              {intl.formatMessage({ id: 'app.remove', defaultMessage: '删除' })}
            </Button>
          </Button.Group>
        );
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable
        columns={columns}
        request={(param) => {
          const { current, pageSize, ...rest } = param;
          return pageThingType({ current: current + '', size: pageSize + '', ...rest }).then(
            (res) => fmtPage(res),
          );
        }}
        toolBarRender={(action) => [<AddGoodsTypeModal key="add" refresh={action?.reload} />]}
      ></ProTable>
    </PageContainer>
  );
}
