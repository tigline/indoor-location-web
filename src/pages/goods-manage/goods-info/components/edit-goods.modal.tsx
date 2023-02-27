import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { addThing } from '@/services/swagger/wupinguanli';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, notification } from 'antd';

interface IProps {
  refresh?: () => void;
}
export function EditGoodsModal(props: IProps) {
  const intl = useIntl();
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
        id: 'pages.goods-manage.goods.type.add',
        defaultMessage: '添加物品类型',
      })}
      trigger={<Button>{intl.formatMessage({ id: 'app.edit', defaultMessage: '编辑' })}</Button>}
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
      ></ProFormText>
      <ProFormText
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.deviceId',
          defaultMessage: '设备编码',
        })}
      ></ProFormText>
      <ProFormText
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.label',
          defaultMessage: '绑定标签',
        })}
      ></ProFormText>
      <ProFormSelect
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.type',
          defaultMessage: '物品类型',
        })}
      ></ProFormSelect>
      <ImageUploadFormItem
        name="picture"
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.info.icon',
          defaultMessage: '类型图标',
        })}
      ></ImageUploadFormItem>
    </ModalForm>
  );
}
