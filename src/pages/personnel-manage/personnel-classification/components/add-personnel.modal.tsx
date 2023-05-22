import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { addPersonnelType } from '@/services/swagger/renyuanguanli';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, Form, notification } from 'antd';
interface IProps {
  refresh?: () => void;
}
/**
 * 添加人员类型
 *
 * @export
 * @param {IProps} props
 * @return {*}
 */
export function AddPersonnelModal(props: IProps) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { run } = useRequest(addPersonnelType, {
    manual: true,
    onSuccess(data) {
      if (data) {
        props.refresh?.();
        notification.success({
          message: intl.formatMessage({ id: 'app.add.success', defaultMessage: '新建成功' }),
        });
      }
    },
  });
  return (
    <ModalForm<API.AddOrUpdatePersonnelType>
      title={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.type.add',
        defaultMessage: '添加人员类型',
      })}
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          {intl.formatMessage({ id: 'app.add', defaultMessage: '新建' })}
        </Button>
      }
      form={form}
      layout="horizontal"
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      onFinish={(value) => {
        return run(value);
      }}
    >
      <ProFormText
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.type.name',
          defaultMessage: '人员类型名称',
        })}
        name="typeName"
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.personnel-manage.organization.department.person.type.name.required.failure',
              defaultMessage: '人员类型名称必填',
            }),
          },
        ]}
      />
      <ImageUploadFormItem
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.type.icon',
          defaultMessage: '图标',
        })}
        name="picture"
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.personnel-manage.organization.department.person.type.icon.required.failure',
              defaultMessage: '请上传图标',
            }),
          },
        ]}
      />
    </ModalForm>
  );
}
