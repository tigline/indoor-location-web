import { SelectMapSelect } from '@/components/select-map.select';
import { updateGateway } from '@/services/swagger/shebeiguanli';
import { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Form, notification } from 'antd';
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
        const { mapId, name, ...rest } = values;
        return run({ gateway: props.record.gateway! }, { mapId: mapId!, name: name!, ...rest });
      }}
      trigger={
        <Button type="link" size="small">
          {intl.formatMessage({ id: 'app.action.edit', defaultMessage: '编辑' })}
        </Button>
      }
    >
      <ProFormText
        width="lg"
        name="name"
        initialValue={props.record?.name}
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.name',
          defaultMessage: '设置名称',
        })}
      />
      <ProFormText
        width="lg"
        name="gateway"
        initialValue={props.record?.gateway}
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.gateway',
          defaultMessage: '基站',
        })}
      />
      <ProFormText
        width="lg"
        name="productName"
        initialValue={props.record?.productName}
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.productName',
          defaultMessage: '产品名称',
        })}
      />
      <ProFormDigit
        width="lg"
        name="setX"
        max={9999}
        initialValue={props.record?.setX}
        fieldProps={{ precision: 2 }}
        label={intl.formatMessage({
          id: 'pages.device-manage.base-station.device.setX',
          defaultMessage: '基站X坐标',
        })}
      ></ProFormDigit>
      <ProFormDigit
        width="lg"
        name="setY"
        max={9999}
        initialValue={props.record?.setY}
        fieldProps={{ precision: 2 }}
        label={intl.formatMessage({
          id: 'pages.device-manage.base-station.device.setY',
          defaultMessage: '基站Y坐标',
        })}
      ></ProFormDigit>
      <ProFormDigit
        width="lg"
        name="setZ"
        max={9999}
        initialValue={props.record?.setZ}
        fieldProps={{ precision: 2 }}
        label={intl.formatMessage({
          id: 'pages.device-manage.base-station.device.setZ',
          defaultMessage: '基站Z坐标',
        })}
      ></ProFormDigit>
      <SelectMapSelect
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.map',
          defaultMessage: '地图',
        })}
        initialValue={props.record.mapId}
      />
    </ModalForm>
  );
}
