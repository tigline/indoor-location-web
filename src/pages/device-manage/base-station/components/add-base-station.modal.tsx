import { SelectMapCascader } from '@/components/select-map.cascader';
import { addGateway } from '@/services/swagger/shebeiguanli';
import { OK } from '@/utils/global.utils';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Form } from 'antd';
import { first } from 'lodash';
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
export function AddBaseStationModal(props: IProps): JSX.Element {
  const [form] = Form.useForm();
  const intl = useIntl();

  return (
    <ModalForm<API.AddGatewayInfo>
      title={
        <FormattedMessage
          id="pages.device-manage.base-station.device.add"
          defaultMessage="新建标签"
        />
      }
      layout="horizontal"
      form={form}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      onFinish={(values) => {
        // mapId 由级联菜单选出，表单项中是一个数组
        const { mapId, ...rest } = values;
        return addGateway({ mapId: first(mapId), ...rest }).then((res) => {
          props.refresh?.();
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
          id: 'pages.device-manage.label.device.name',
          defaultMessage: '设置名称',
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
      <ProFormDigit
        width="lg"
        name="setX"
        max={9999}
        fieldProps={{
          precision: 2,
        }}
        label={intl.formatMessage({
          id: 'pages.device-manage.base-station.device.setX',
          defaultMessage: '基站X坐标',
        })}
      ></ProFormDigit>
      <ProFormDigit
        width="lg"
        name="setY"
        max={9999}
        fieldProps={{
          precision: 2,
        }}
        label={intl.formatMessage({
          id: 'pages.device-manage.base-station.device.setY',
          defaultMessage: '基站Y坐标',
        })}
      ></ProFormDigit>
      <ProFormDigit
        width="lg"
        name="setZ"
        max={9999}
        fieldProps={{
          precision: 2,
        }}
        label={intl.formatMessage({
          id: 'pages.device-manage.base-station.device.setZ',
          defaultMessage: '基站Z坐标',
        })}
      ></ProFormDigit>
      <SelectMapCascader></SelectMapCascader>
    </ModalForm>
  );
}
