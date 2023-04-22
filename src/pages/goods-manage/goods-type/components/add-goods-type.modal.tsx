import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { addThingType } from '@/services/swagger/wupinguanli';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, Form, notification, UploadFile } from 'antd';

interface IProps {
  refresh?: () => void;
}

export function AddGoodsTypeModal(props: IProps) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { run } = useRequest(addThingType, {
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
    <ModalForm<API.AddOrUpdateThingType & { picture: UploadFile[] }>
      title={intl.formatMessage({
        id: 'pages.goods-manage.goods.type.add',
        defaultMessage: '添加物品类型',
      })}
      form={form}
      layout="horizontal"
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      onVisibleChange={(e) => {
        if (!e) {
          form.resetFields();
        }
      }}
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          {intl.formatMessage({ id: 'app.action.add', defaultMessage: '新建' })}
        </Button>
      }
      onFinish={(values) => {
        return run(values);
      }}
    >
      <ProFormText
        name="typeName"
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.type.name',
          defaultMessage: '类型名称',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.goods-manage.goods.info.type.required.failure',
              defaultMessage: '请输入物品类型',
            }),
          },
        ]}
      ></ProFormText>
      <ImageUploadFormItem
        name="picture"
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.type.icon',
          defaultMessage: '类型图标',
        })}
      />
    </ModalForm>
  );
}
