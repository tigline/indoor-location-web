import { addDepartment } from '@/services/swagger/renyuanguanli';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, Form, notification } from 'antd';

interface FormType extends API.DepartmentTree {
  parentName: string;
  name: string;
}
interface IProps {
  parentId?: string;
  parentName?: string;
  refresh?: () => void;
}
/**
 * 添加部门弹框
 *
 * @export
 * @param {IProps} props
 * @return {*}
 */
export function AddDepartmentModal(props: IProps) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { run } = useRequest(addDepartment, {
    manual: true,
    onSuccess(data) {
      if (data) {
        notification.success({
          message: intl.formatMessage({ id: 'app.add.success', defaultMessage: '新建成功' }),
        });
        props.refresh?.();
      }
    },
  });
  return (
    <ModalForm<FormType>
      trigger={
        <Button size="small" type="link">
          {intl.formatMessage({ id: 'app.action.add', defaultMessage: '新建' })}
        </Button>
      }
      title={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.add',
        defaultMessage: '添加部门',
      })}
      form={form}
      width={520}
      layout="horizontal"
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      onVisibleChange={(e) => {
        if (!e) {
          form.resetFields();
        }
      }}
      onFinish={(values) => {
        const { name, parentId } = values;
        return run({ name, parentId });
      }}
    >
      <ProFormText hidden name="parentId" initialValue={props.parentId} />
      <ProFormText
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.name',
          defaultMessage: '部门名称',
        })}
        readonly
        initialValue={props.parentName}
        name="parentName"
      />
      <ProFormText
        name="name"
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.name',
          defaultMessage: '部门名称',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.personnel-manage.organization.department.name.required.failure',
              defaultMessage: '部门名称必填',
            }),
          },
        ]}
      />
    </ModalForm>
  );
}
