import { pageThing } from '@/services/swagger/wupinguanli';
import { fmtPage } from '@/utils/global.utils';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { AddGoodsTypeModal } from '../goods-type/components/add-goods-type.modal';

export default function Page() {
  const intl = useIntl();
  const columns: ProColumns<API.ThingInfo>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.goods-manage.goods.info.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.goods-manage.goods.info.type',
        defaultMessage: '物品类型',
      }),
      dataIndex: 'typeId',
    },
    {
      title: intl.formatMessage({
        id: 'pages.goods-manage.goods.info.icon',
        defaultMessage: '图标',
      }),
      dataIndex: 'picture',
    },
    {
      title: intl.formatMessage({
        id: 'pages.goods-manage.goods.info.label',
        defaultMessage: '绑定标签',
      }),
      dataIndex: 'tag',
    },
    {
      title: intl.formatMessage({ id: 'app.createTime', defaultMessage: '创建时间' }),
      dataIndex: 'createtime',
    },
    {
      title: intl.formatMessage({
        id: 'pages.goods-manage.goods.info.deviceId',
        defaultMessage: '设备编码',
      }),
      dataIndex: 'thingId',
    },
  ];
  return (
    <PageContainer>
      <ProTable
        columns={columns}
        request={(param) => {
          const { current, pageSize, ...rest } = param;
          return pageThing({ current: current + '', size: pageSize + '', ...rest }).then((res) =>
            fmtPage(res),
          );
        }}
        toolBarRender={(action) => [<AddGoodsTypeModal key="add" refresh={action?.reload} />]}
      ></ProTable>
    </PageContainer>
  );
}
