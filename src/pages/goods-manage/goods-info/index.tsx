import { RemoveButtonPopover } from '@/components/remove-button.popover';
import { EditGoodsModal } from '@/pages/goods-manage/goods-info/components/edit-goods.modal';
import { deleteThing, pageThing, pageThingType } from '@/services/swagger/wupinguanli';
import { fmtPage } from '@/utils/global.utils';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, notification } from 'antd';
import React from 'react';
import { AddGoodsModal } from './components/add-goods.modal';

export default function Page() {
  const intl = useIntl();
  const { run: queryType, data } = useRequest(pageThingType, {
    manual: true,
    formatResult(res) {
      return (
        fmtPage(res).data?.map((item) => ({
          key: item.typeId,
          label: item.typeName,
          value: item.typeId,
        })) ?? []
      );
    },
  });
  React.useEffect(() => {
    queryType({ current: '1', size: '1000' });
  }, []);
  const { run: query } = useRequest(pageThing, {
    manual: true,
    formatResult(res) {
      return fmtPage(res);
    },
  });
  const { run: remove, fetches } = useRequest(deleteThing, {
    manual: true,
    onSuccess: (data) => {
      if (data) {
        notification.success({
          message: intl.formatMessage({ id: 'app.remove.success', defaultMessage: '删除成功' }),
        });
      }
    },
  });
  const columns: ProColumns<API.ThingInfo>[] = [

    // {
    //   title: intl.formatMessage({
    //     id: 'pages.goods-manage.goods.info.deviceId',
    //     defaultMessage: '物品ID',
    //   }),
    //   search: false,
    //   dataIndex: 'thingId',
    // },
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
      search: false,
      dataIndex: 'typeId',
      valueEnum: data?.reduce((prev, next) => ({ ...prev, [next.key!]: next.label }), {}),
      render(_, record) {
        return data?.find((f) => f.key === record.typeId)?.label ?? '';
      },
    },
    // {
    //   title: intl.formatMessage({
    //     id: 'pages.goods-manage.goods.info.icon',
    //     defaultMessage: '图标',
    //   }),
    //   search: false,
    //   dataIndex: 'picture',
    //   valueType: 'image',
    // },
    {
      title: intl.formatMessage({
        id: 'pages.goods-manage.goods.info.label',
        defaultMessage: '绑定标签',
      }),
      search: false,
      dataIndex: 'tag',
    },
    // {
    //   title: intl.formatMessage({ id: 'app.createTime', defaultMessage: '创建时间' }),
    //   dataIndex: 'createtime',
    //   valueType: 'dateRange',
    //   render(_, entity) {
    //     return fmt(entity.createtime);
    //   },
    // },
    
    {
      title: intl.formatMessage({
        id: 'app.action',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      key: 'option',
      render: (_, record, __, action) => (
        <Button.Group>
          <EditGoodsModal record={record} refresh={action?.reload} />

          <RemoveButtonPopover
            disabled={!record.thingId}
            onClick={() => remove({ thingId: record.thingId! }).then(() => action?.reload())}
            loading={fetches?.[record.thingId!]?.loading}
          />
        </Button.Group>
      ),
    },
  ];
  return (
    <PageContainer childrenContentStyle={{padding:20}}>
      <ProTable
        columns={columns}
        rowKey={(o) => o.thingId + ''}
        request={(param) => {
          const { current, pageSize, ...rest } = param;
          return query({ current: current + '', size: pageSize + '', ...rest });
        }}
        toolBarRender={(action) => [<AddGoodsModal key="add" refresh={action?.reload} />]}
        options={{ setting: false }}
      />
    </PageContainer>
  );
}
