import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { pageBeacon } from '@/services/swagger/shebeiguanli';
import { addThing, pageThingType } from '@/services/swagger/wupinguanli';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect } from '@ant-design/pro-components';
import { ProFormText } from '@ant-design/pro-form';
import { useIntl, useRequest } from '@umijs/max';
import { Button, Form, notification } from 'antd';
import React from 'react';

interface IProps {
  refresh?: () => void;
}

export function AddGoodsModal(props: IProps) {
  const intl = useIntl();
  const [form] = Form.useForm();
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
    } else {
      form.resetFields();
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
      form={form}
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          {intl.formatMessage({ id: 'app.action.add', defaultMessage: '新建' })}
        </Button>
      }
      onFinish={(values) => {
        return run(values);
      }}
      onOpenChange={(o) => setOpen(o)}
      layout="horizontal"
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
    >
      <ProFormText
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.name',
          defaultMessage: '名称',
        })}
        name="name"
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
        name="thingId"
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
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.goods-manage.goods.info.tag.required.failure',
              defaultMessage: '请选择物品标签',
            }),
          },
        ]}
      />
      <ProFormSelect
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.type',
          defaultMessage: '物品类型',
        })}
        options={options}
        name="typeId"
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
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.icon',
          defaultMessage: '类型图标',
        })}
      />
    </ModalForm>
  );
}
