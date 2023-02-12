import { addBeacon } from '@/services/swagger/shebeiguanli';
import { OK } from '@/utils/global.utils';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Form } from 'antd';
import { FormattedMessage } from 'umi';
interface IProps {
  // children: JSX.Element;
  refresh?: () => void;
}
/**
 * 功能 模态框
 *
 * @export
 * @param {IProps} props
 * @return {JSX.Element}
 */
export function AddLabelModal(props: IProps): JSX.Element {
  const [form] = Form.useForm();
  const intl = useIntl();

  return (
    <ModalForm<API.AddBeaconInfo>
      title={<FormattedMessage id="app.action" defaultMessage="新建" />}
      layout="horizontal"
      form={form}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      onFinish={(values) => {
        return addBeacon(values).then((res) => {
          props.refresh?.();
          return res.code === OK;
        });
      }}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          {intl.formatMessage({
            id: 'pages.device-manage.label.device.add',
            defaultMessage: '新建标签',
          })}
        </Button>
      }
    >
      <ProFormText
        width="lg"
        name="deviceId"
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.deviceId',
          defaultMessage: '设备ID',
        })}
      />
      <ProFormText
        width="lg"
        name="name"
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.name',
          defaultMessage: '设置名称',
        })}
      />
      <ProFormText
        width="lg"
        name="mac"
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.mac',
          defaultMessage: '物理地址',
        })}
      />
      <ProFormText
        width="lg"
        name="gateway"
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.gateway',
          defaultMessage: '网关',
        })}
      />
      <ProFormText
        width="lg"
        name="productName"
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.productName',
          defaultMessage: '产品名称',
        })}
      />
      {/* FIXME: 需要更新地图选择器 */}
      <ProFormText
        width="lg"
        name="mapId"
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.map',
          defaultMessage: '地图',
        })}
      />
    </ModalForm>
  );
}
