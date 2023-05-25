import { addBeacon } from '@/services/swagger/shebeiguanli';
import { OK } from '@/utils/global.utils';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Form, notification } from 'antd';
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
      title={<FormattedMessage id="pages.device-manage.label.device.add" defaultMessage="添加标签" />}
      layout="horizontal"
      form={form}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      width={550}
      onFinish={(values) => {
        return addBeacon({ ...values, name: values.name, deviceId: values.deviceId! }).then((res) => {
          props.refresh?.();
          if (res.code === OK) {
            notification.success({
              message: intl.formatMessage({ id: 'app.add.success', defaultMessage: '新建成功' }),
            });
          }
          return res.code === OK;
        });
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          {intl.formatMessage({
            id: 'app.action.add',
            defaultMessage: '添加',
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
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.device-manage.label.device.deviceId.required.failure',
              defaultMessage: '设备ID必填',
            }),
          },
          {
            pattern: /^[0-9a-fA-F,]+$/,
            message: intl.formatMessage({
              id: 'pages.device-manage.label.device.mac.hex.failure',
              defaultMessage: '物理地址必填',
            }),
          },
        ]}
      />
      <ProFormText
        width="lg"
        name='name'
        //initialValue={props.record.name}
        label={intl.formatMessage({
          id: 'pages.device-manage.base-station.device.name',
          defaultMessage: '名称',
        })}
      />
      <ProFormSelect
        name="type"
        label={intl.formatMessage({ id: 'pages.device-manage.label.type', defaultMessage: '类型' })}
        initialValue={'Equipment'}
        valueEnum={{
          Equipment: intl.formatMessage({
            id: 'pages.device-manage.label.type.equipment',
            defaultMessage: '设备',
          }),
          Personnel: intl.formatMessage({
            id: 'pages.device-manage.label.type.personnel',
            defaultMessage: '人员',
          }),
          Vehicle: intl.formatMessage({
            id: 'pages.device-manage.label.type.vehicle',
            defaultMessage: '工具',
          }),
          Stuff: intl.formatMessage({
            id: 'pages.device-manage.label.type.stuff',
            defaultMessage: '材料',
          }),
        }}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.device-manage.label.type.required.failure',
              defaultMessage: '类型必填',
            }),
          },
        ]}
      ></ProFormSelect>
    </ModalForm>
  );
}
