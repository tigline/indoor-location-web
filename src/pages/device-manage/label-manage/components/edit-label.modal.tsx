import { updateBeacon } from '@/services/swagger/shebeiguanli';
import { pageFence } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Form, notification } from 'antd';
import React from 'react';

interface IProps {
  // children: JSX.Element;
  record: API.BeaconInfo;
  refresh?: () => void;
}

/**
 * 功能 模态框
 *
 * @export
 * @param {IProps} props
 * @return {JSX.Element}
 */
export function EditLabelModal(props: IProps): JSX.Element {
  const [form] = Form.useForm();
  const intl = useIntl();
  const { run, data } = useRequest(pageFence, {
    manual: true,
    formatResult(res) {
      return res.data?.items?.map((item) => ({
        label: item.name,
        value: item.fenceId,
      }));
    },
  });
  React.useEffect(() => {
    run({ current: `1`, size: `100` });
  }, []);
  return (
    <ModalForm<API.UpdateBeacon>
      title={<FormattedMessage id="app.edit" defaultMessage="编辑" />}
      layout="horizontal"
      form={form}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      width={550}
      onFinish={({ name, type, fenceIds }) => {
        return updateBeacon(
          { deviceId: props.record.deviceId! },
          { name: name!, type, fenceIds },
        ).then((res) => {
          if (res.code === OK) {
            notification.success({
              message: intl.formatMessage({ id: 'app.edit.success', defaultMessage: '更新成功' }),
            });
          }
          props.refresh?.();
          return res.code === OK;
        });
      }}
      onVisibleChange={(e) => {
        if (!e) {
          form.resetFields();
        }
      }}
      trigger={
        <Button type="link" size="small">
          {intl.formatMessage({
            id: 'pages.device-manage.label.device.edit',
            defaultMessage: '更新标签',
          })}
        </Button>
      }
    >
      <ProFormText
        width="lg"
        name="name"
        initialValue={props.record.mac}
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.mac',
          defaultMessage: '物理地址',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.device-manage.label.device.mac.required.failure',
              defaultMessage: '物理地址必填',
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
      <ProFormSelect
        name="type"
        label={intl.formatMessage({ id: 'pages.device-manage.label.type', defaultMessage: '类型' })}
        initialValue={props.record.type}
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
      />
      <ProFormSelect
        name="fenceIds"
        initialValue={props.record.fenceIds}
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.fence',
          defaultMessage: '绑定围栏',
        })}
        options={data}
        // mode="multiple"
      />
    </ModalForm>
  );
}
