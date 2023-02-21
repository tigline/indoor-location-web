import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { updateBuilding } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import { EditOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Form, notification, UploadFile } from 'antd';
import { first } from 'lodash';

interface IProps {
  refresh?: () => void;
  disabled?: boolean;
  record?: API.BuildingInfo;
}
export function EditBuildingModal(props: IProps) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const buildingId = props.record?.buildingId;
  return (
    <ModalForm<API.AddOrUpdateBuilding & { picture: UploadFile[] }>
      title={
        <FormattedMessage id="pages.system.map-setup.building.add" defaultMessage="添加建筑" />
      }
      layout="horizontal"
      form={form}
      disabled={props.disabled}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      // request={()=>getbu}
      onFinish={(values) => {
        const picture = first(values.picture)?.response;
        if (!buildingId) {
          notification.error({ message: 'building id is null' });
          return Promise.resolve(false);
        }
        return updateBuilding({ buildingId }, { ...values, picture }).then((res) => {
          if (res.code === OK) {
            props.refresh?.();
            notification.success({
              message: intl.formatMessage({
                id: 'app.edit.success',
                defaultMessage: '更新成功',
              }),
            });
          }
          return res.code === OK;
        });
      }}
      trigger={
        <Button>
          <EditOutlined />
          {intl.formatMessage({ id: 'app.edit', defaultMessage: '编辑' })}
        </Button>
      }
    >
      <ProFormText
        width="lg"
        name="name"
        initialValue={props.record?.name}
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
        initialValue={props.record?.address}
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
