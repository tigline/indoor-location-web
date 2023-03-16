import { addGateway } from '@/services/swagger/shebeiguanli';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Form, notification } from 'antd';
import { BaseStationFormFragment } from './form.fragment';
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
export function AddBaseStationModal(props: IProps): JSX.Element {
  const [form] = Form.useForm();
  const intl = useIntl();
  const { run } = useRequest(addGateway, {
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
    <ModalForm<API.AddGatewayInfo & { mapId: number[] }>
      title={
        <FormattedMessage
          id="pages.device-manage.base-station.device.add"
          defaultMessage="添加基站"
        />
      }
      layout="horizontal"
      form={form}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      onFinish={(values) => {
        // mapId 由级联菜单选出，表单项中是一个数组
        const [, mapId] = values.mapId;
        return run({ ...values, mapId });
      }}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          {intl.formatMessage({ id: 'app.action.add', defaultMessage: '新建' })}
        </Button>
      }
    >
      <BaseStationFormFragment />
    </ModalForm>
  );
}
