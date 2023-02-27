import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { pageBeacon } from '@/services/swagger/shebeiguanli';
import { addThing, pageThingType } from '@/services/swagger/wupinguanli';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, notification } from 'antd';
import React from 'react';

interface IProps {
  refresh?: () => void;
}
export function EditGoodsModal(props: IProps) {
  const intl = useIntl();
  const [open, setOpen] = React.useState<boolean>();
  const { run: beancons, data: beanconOptions } = useRequest(pageBeacon, {
    manual: true,
    debounceInterval: 300,
    formatResult(res) {
      return res.data?.items?.map((item) => ({
        label: item.name,
        value: item.deviceId,
      }));
    },
  });
  const { run: query, data: options } = useRequest(pageThingType, {
    manual: true,
    formatResult(res) {
      return res.data?.items?.map((item) => ({
        label: item.typeName,
        value: item.typeId,
      }));
    },
  });
  React.useEffect(() => {
    if (open) {
      query({ current: `1`, size: `200` });
      beancons({ current: `1`, size: `200` });
    }
  }, [open]);
  const { run } = useRequest(addThing, {
    manual: true,
    onSuccess(data) {
      if (data) {
        notification.success({
          message: intl.formatMessage({ id: 'app.add.success', defaultMessage: '新建成功' }),
        });
        props.refresh?.();
      }
    },
  });
  return (
    <ModalForm<API.AddOrUpdateThing>
      title={intl.formatMessage({
        id: 'pages.goods-manage.goods.info.add',
        defaultMessage: '添加物品',
      })}
      trigger={<Button>{intl.formatMessage({ id: 'app.edit', defaultMessage: '编辑' })}</Button>}
      onOpenChange={(o) => setOpen(o)}
      onFinish={(values) => {
        return run(values);
      }}
    >
      <ProFormText
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.name',
          defaultMessage: '名称',
        })}
        name="name"
      />
      <ProFormText
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.deviceId',
          defaultMessage: '设备编码',
        })}
      />
      <ProFormSelect
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.label',
          defaultMessage: '绑定标签',
        })}
        fieldProps={{
          showSearch: true,
          onSearch(value) {
            beancons({ name: value });
          },
        }}
        options={beanconOptions}
        name="tag"
      />
      <ProFormSelect
        name="typeId"
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.type',
          defaultMessage: '物品类型',
        })}
        options={options}
      />
      <ImageUploadFormItem
        name="picture"
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.icon',
          defaultMessage: '类型图标',
        })}
      />
    </ModalForm>
  );
}
