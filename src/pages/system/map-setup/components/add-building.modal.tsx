import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { addBuilding } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Form, notification } from 'antd';
import { UploadFile } from 'antd/es/upload';
interface IProps {
  refresh?: () => void;
}
/**
 * 功能 模态框
 *
 * @export
 * @param {IProps} props
 * @return {JSX.Element}
 */
export function AddBuildingModal(props: IProps): JSX.Element {
  const intl = useIntl();
  const [form] = Form.useForm();

  return (
    <ModalForm<API.AddOrUpdateBuilding & { picture: UploadFile[] }>
      title={
        <FormattedMessage id="pages.system.map-setup.building.add" defaultMessage="添加建筑" />
      }
      layout="horizontal"
      form={form}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      onFinish={(values) => {
        return addBuilding(values).then((res) => {
          if (res.code === OK) {
            props.refresh?.();
            notification.success({
              message: intl.formatMessage({
                id: 'app.add.success',
                defaultMessage: '新建成功',
              }),
            });
          }
          return res.code === OK;
        });
      }}
      onVisibleChange={(e) => {
        if (!e) {
          form.resetFields();
        }
      }}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          {intl.formatMessage({ id: 'app.add', defaultMessage: '新建' })}
        </Button>
      }
    >
      <ProFormText
        width="lg"
        name="name"
        label={intl.formatMessage({
          id: 'pages.system.map-setup.building.name',
          defaultMessage: '建筑名',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.building.name.required.failure',
              defaultMessage: '建筑名必填',
            }),
          },
        ]}
      />
      <ProFormText
        width="lg"
        name="address"
        label={intl.formatMessage({
          id: 'pages.system.map-setup.building.address',
          defaultMessage: '地址',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.building.address.required.failure',
              defaultMessage: '地址必填',
            }),
          },
        ]}
      />
      <ImageUploadFormItem
        width="lg"
        name="picture"
        accept="image/png"
        label={intl.formatMessage({
          id: 'pages.system.map-setup.building.picture',
          defaultMessage: '示意图',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.building.picture.required.failure',
              defaultMessage: '示意图必填',
            }),
          },
        ]}
      />
    </ModalForm>
  );
}
