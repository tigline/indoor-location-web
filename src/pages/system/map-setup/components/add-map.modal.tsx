import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { SelectVendor } from '@/components/select-personnel-tag.select';
import { addMap } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useModel } from '@umijs/max';
import { Button, Form, notification } from 'antd';
import { UploadFile } from 'antd/es/upload';
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
  const { run } = useModel('mapModel');
  return (
    <ModalForm<API.AddOrUpdateMapInfo & { picture: UploadFile[] }>
      title={<FormattedMessage id="pages.system.map-setup.map.add" defaultMessage="添加地图" />}
      layout="horizontal"
      form={form}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      disabled={!buildingId}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      onFinish={(values) => {
        return addMap({ ...values, buildingId: buildingId! }).then((res) => {
          props.refresh?.();
          // 强制刷新缓存
          run(true);
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
          {intl.formatMessage({ id: 'app.add', defaultMessage: '新建' })}
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
      <ProFormDigit
        width="lg"
        name="width"
        label={intl.formatMessage({
          id: 'pages.system.map-setup.map.width',
          defaultMessage: '实际宽度',
        })}
        addonAfter={intl.formatMessage({ id: 'app.unit.m', defaultMessage: '米' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.map.width.required.failure',
              defaultMessage: '实际宽度必填',
            }),
          },
        ]}
      ></ProFormDigit>
      <ProFormDigit
        width="lg"
        name="length"
        addonAfter={intl.formatMessage({ id: 'app.unit.m', defaultMessage: '米' })}
        label={intl.formatMessage({
          id: 'pages.system.map-setup.map.length',
          defaultMessage: '实际长度',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.map.length.required.failure',
              defaultMessage: '实际长度必填',
            }),
          },
        ]}
      ></ProFormDigit>
      <SelectVendor
        width="lg"
        name='companyCode'
        label={intl.formatMessage({
          id: 'pages.device-manage.base-vendor.name',
          defaultMessage: '部署厂商',
        })}
        rules={[
          {
            required: true,
          }
        ]}
      />
      <ProFormSelect
        width="lg"
        name="coordinateType"
        initialValue={'Cartesian'}
        label={intl.formatMessage({ id: 'pages.system.map-setup.coordinate.type', defaultMessage: '坐标类型' })}
        valueEnum={{
          Cartesian: intl.formatMessage({
            id: 'pages.system.map-setup.coordinate.type.cartesian',
            defaultMessage: '笛卡尔坐标',
          }),
          World: intl.formatMessage({
            id: 'pages.system.map-setup.coordinate.type.world',
            defaultMessage: '世界坐标',
          })
        }}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.coordinate.type.required.failure',
              defaultMessage: '坐标类型必填',
            }),
          },
        ]}
      ></ProFormSelect>
      <ImageUploadFormItem
        width="lg"
        name="picture"
        // accept="image/svg+xml"
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
