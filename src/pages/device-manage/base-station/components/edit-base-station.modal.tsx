import { updateGateway } from '@/services/swagger/shebeiguanli';
import { ModalForm } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Form, notification } from 'antd';

import { BaseStationFormFragment } from './form.fragment';

interface IProps {
  // children: JSX.Element;
  refresh?: () => void;
  record: API.GatewayInfo;
}

/**
 * 功能 模态框
 *
 * @export
 * @param {IProps} props
 * @return {JSX.Element}
 */
export function EditBaseStationModal(props: IProps): JSX.Element {
  const [form] = Form.useForm();
  const intl = useIntl();
  const { run } = useRequest(updateGateway, {
    manual: true,
    onSuccess(res) {
      if (res) {
        notification.success({
          message: intl.formatMessage({ id: 'app.add.success', defaultMessage: '新建成功' }),
        });
        props.refresh?.();
      }
    },
  });
  return (
    <ModalForm<API.AddGatewayInfo>
      title={
        <FormattedMessage
          id="pages.device-manage.base-station.device.edit"
          defaultMessage="编辑基站"
        />
      }
      layout="horizontal"
      form={form}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      onFinish={(values) => {
        const { mapId, name, groupId,...rest } = values;
        return run({ gateway: props.record.gateway! }, { mapId: mapId!, name: name!, group:groupId, ...rest });
      }}
      // onChange={(e) => {
      //   if (!e) {
      //     form.resetFields();
      //   }
      // }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      trigger={
        <Button type="link" size="small">
          {intl.formatMessage({ id: 'app.action.edit', defaultMessage: '编辑' })}
        </Button>
      }
    >
      <BaseStationFormFragment record={props.record} isEdit = {true} />
    </ModalForm>
  );
}
