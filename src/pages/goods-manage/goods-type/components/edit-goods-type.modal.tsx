import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { updateThingType } from '@/services/swagger/wupinguanli';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, notification, UploadFile } from 'antd';
import { first } from 'lodash';

interface IProps {
  refresh?: () => void;
  record: API.ThingTypeInfo;
}
export function EditGoodsTypeModal(props: IProps) {
  const intl = useIntl();
  const { run } = useRequest(updateThingType, {
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
    <ModalForm<API.AddOrUpdateThingType & { picture: UploadFile[] }>
      title={intl.formatMessage({
        id: 'pages.goods-manage.goods.type.add',
        defaultMessage: '添加物品类型',
      })}
      layout="horizontal"
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      trigger={
        <Button size="small" type="link">
          {intl.formatMessage({ id: 'app.action.edit', defaultMessage: '编辑' })}
        </Button>
      }
      onFinish={(values) => {
        const picture = first(values.picture)?.response;
        return run({ typeId: props.record.typeId! }, { ...values, picture });
      }}
    >
      <ProFormText
        name="typeName"
        initialValue={props.record.typeName}
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
        initialValue={
          [
            {
              uid: Date.now() + '',
              response: props.record?.picture,
              thumbUrl: props.record?.picture,
            },
          ] as UploadFile<any>[]
        }
        name="picture"
        label={intl.formatMessage({
          id: 'pages.goods-manage.goods.type.icon',
          defaultMessage: '类型图标',
        })}
      />
    </ModalForm>
  );
}
