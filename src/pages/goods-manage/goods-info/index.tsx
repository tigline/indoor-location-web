import { pageThing, pageThingType } from '@/services/swagger/wupinguanli';
import { fmtPage } from '@/utils/global.utils';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { AddGoodsModal } from './components/add-goods.modal';

export default function Page() {
  const intl = useIntl();
  const { run: queryType } = useRequest(pageThingType, {
    manual: true,
    formatResult(res) {
      return (
        fmtPage(res).data?.map((item) => ({
          label: item.typeName,
          value: item.typeId,
        })) ?? []
      );
    },
  });
  const { run: query } = useRequest(pageThing, {
    manual: true,
    formatResult(res) {
      return fmtPage(res);
    },
  });
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
      request: () => queryType({ current: '1', size: '1000' }),
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
      valueType: 'dateTime',
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
          return query({ current: current + '', size: pageSize + '', ...rest });
        }}
        toolBarRender={(action) => [<AddGoodsModal key="add" refresh={action?.reload} />]}
      ></ProTable>
    </PageContainer>
  );
}
