import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { listUnboundBeacon } from '@/services/swagger/shebeiguanli';
import { pageThingType, updateThing } from '@/services/swagger/wupinguanli';
import { EditOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, notification, UploadFile } from 'antd';
import React from 'react';

interface IProps {
  refresh?: () => void;
  record: API.ThingInfo;
}

export function EditGoodsModal(props: IProps) {
  const intl = useIntl();
  const [open, setOpen] = React.useState<boolean>();
  const { run: beancons, data: beanconOptions } = useRequest(listUnboundBeacon, {
    manual: true,
    debounceInterval: 300,
    formatResult(res) {
      return (
        res.data
          ?.map((item) => ({
            label: item.deviceId,
            value: item.deviceId,
          }))
          // 更新页面需要添加本条数据对应的标签信息
          .concat([{ label: props.record.tag, value: props.record.tag }])
      );
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
      beancons({});
    }
  }, [open]);
  const { run } = useRequest(updateThing, {
    manual: true,
    onSuccess(data) {
      if (data) {
        notification.success({
          message: intl.formatMessage({ id: 'app.edit.success', defaultMessage: '更新成功' }),
        });
        props.refresh?.();
      }
    },
  });
  return (
    <ModalForm<API.AddOrUpdateThing>
      title={intl.formatMessage({
        id: 'pages.goods-manage.goods.info.edit',
        defaultMessage: '更新物品',
      })}
      trigger={
        <Button type="link" size="small" >
          {intl.formatMessage({
            id: 'app.edit',
            defaultMessage: '编辑',
          })}
        </Button>
      }
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      onOpenChange={(o) => setOpen(o)}
      layout="horizontal"
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      onFinish={(values) => {
        return run({ thingId: props.record.thingId! }, values);
      }}
    >
      <ProFormText
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.name',
          defaultMessage: '名称',
        })}
        name="name"
        initialValue={props.record.name}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.goods-manage.goods.info.name.required.failure',
              defaultMessage: '名称必填',
            }),
          },
        ]}
      />
      <ProFormText
        initialValue={props.record.thingId}
        name="thingId"
        readonly
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
        initialValue={props.record.tag}
        fieldProps={{
          showSearch: true,
          optionFilterProp: 'label',
        }}
        options={beanconOptions}
        name="tag"
        rules={[
          {
            required: false,
            message: intl.formatMessage({
              id: 'pages.goods-manage.goods.info.tag.required.failure',
              defaultMessage: '请选择物品标签',
            }),
          },
        ]}
      />
      <ProFormSelect
        name="typeId"
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.type',
          defaultMessage: '物品类型',
        })}
        initialValue={props.record.typeId}
        options={options}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.goods-manage.goods.info.type.required.failure',
              defaultMessage: '请输入物品类型',
            }),
          },
        ]}
      />
      <ImageUploadFormItem
        name="picture"
        initialValue={
          [
            {
              uid: Date.now() + '',
              response: props.record?.picture,
              thumbUrl: props.record?.picture,
            },
          ] as UploadFile<any>[]
        }
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.icon',
          defaultMessage: '类型图标',
        })}
      />
    </ModalForm>
  );
}
