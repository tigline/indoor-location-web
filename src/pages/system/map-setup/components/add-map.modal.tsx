import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { addMap } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Form, notification } from 'antd';
import { UploadFile } from 'antd/es/upload';
import { first } from 'lodash';
interface IProps {
  buildingId?: string;
  refresh?: () => void;
}
/**
 * 功能 模态框
 *
 * @export
 * @param {IProps} props
 * @return {JSX.Element}
 */
export function AddMapModal(props: IProps): JSX.Element {
  const intl = useIntl();
  const { buildingId } = props;
  const [form] = Form.useForm();

  return (
    <ModalForm<API.AddOrUpdateMapInfo & { picture: UploadFile[] }>
      title={<FormattedMessage id="pages.system.map-setup.map.add" defaultMessage="添加地图" />}
      layout="horizontal"
      form={form}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      disabled={!buildingId}
      onFinish={(values) => {
        const picture = first(values.picture)?.response;
        return addMap({ ...values, buildingId: buildingId!, picture }).then((res) => {
          props.refresh?.();
          notification.success({
            message: intl.formatMessage({
              id: 'app.add.success',
              defaultMessage: '新建成功',
            }),
          });
          return res.code === OK;
        });
      }}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          {intl.formatMessage({ id: 'app.action', defaultMessage: '新建' })}
        </Button>
      }
    >
      <ProFormText
        width="lg"
        name="name"
        label={intl.formatMessage({
          id: 'pages.system.map-setup.map.name',
          defaultMessage: '地图名称',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.map.name.required.failure',
              defaultMessage: '建筑名必填',
            }),
          },
        ]}
      />
      <ProFormText
        width="lg"
        name="floor"
        label={intl.formatMessage({
          id: 'pages.system.map-setup.map.floor',
          defaultMessage: '楼层',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.map.floor.required.failure',
              defaultMessage: '楼层必填',
            }),
          },
        ]}
      />
      <ImageUploadFormItem
        width="lg"
        name="picture"
        accept="image/svg+xml"
        label={intl.formatMessage({
          id: 'pages.system.map-setup.building.picture',
          defaultMessage: '示意图',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.building.address.required.failure',
              defaultMessage: '示意图必填',
            }),
          },
        ]}
      />
    </ModalForm>
  );
}
