import { updateDepartment } from '@/services/swagger/renyuanguanli';
import { ModalForm, ProFormText, ProFormTreeSelect } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, Form, notification } from 'antd';
import { TreeProps } from 'antd/es/tree';

interface FormType extends API.DepartmentTree {
  parentName: string;
  name: string;
}
interface IProps {
  treeData: TreeProps['treeData'];
  name: string;
  depId: number;
  parentId: string;
  refresh?: () => void;
}
/**
 * 添加部门弹框
 *
 * @export
 * @param {IProps} props
 * @return {*}
 */
export function EditDepartmentModal(props: IProps) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { run } = useRequest(updateDepartment, {
    manual: true,
    onSuccess(data) {
      if (data) {
        notification.success({
          message: intl.formatMessage({ id: 'app.edit.success', defaultMessage: '更新成功' }),
        });
        props.refresh?.();
      }
    },
  });
  return (
    <ModalForm<FormType>
      trigger={
        <Button size="small" type="link">
          <span>{intl.formatMessage({ id: 'app.edit', defaultMessage: '更新' })}</span>
        </Button>
      }
      title={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.edit',
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
        return run({ depId: props.depId }, { name, parentId });
      }}
    >
      <ProFormTreeSelect
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.parent',
          defaultMessage: '部门名称',
        })}
        allowClear
        name="parentId"
        request={() => Promise.resolve(props.treeData ?? [])}
        initialValue={props.parentId}
      />
      <ProFormText
        name="name"
        initialValue={props.name}
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
