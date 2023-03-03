import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { SelectDepartmentCascader } from '@/components/select-department.cascader';
import { SelectPersonnelTagSelect } from '@/components/select-personnel-tag.select';
import { SelectPersonnelTypeSelect } from '@/components/select-personnel-type.select';
import { addPersonnel } from '@/services/swagger/renyuanguanli';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, notification } from 'antd';

interface IProps {
  refresh?: () => void;
}
export function AddPersonnelInfoModal(props: IProps) {
  const intl = useIntl();
  const { run } = useRequest(addPersonnel, {
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
    <ModalForm<API.AddOrUpdatePersonnel>
      title={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.info.add',
        defaultMessage: '添加人员',
      })}
      layout="horizontal"
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          {intl.formatMessage({ id: 'app.action.add', defaultMessage: '新建' })}
        </Button>
      }
      onFinish={(value) => {
        return run(value);
      }}
    >
      <ProFormText
        name="name"
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.name',
          defaultMessage: '姓名',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.personnel-manage.organization.department.person.name.required.failure',
              defaultMessage: '姓名必填',
            }),
          },
        ]}
      />
      {/* <ProFormText
        name=""
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.phone',
          defaultMessage: '手机号',
        })}
      /> */}
      {/* <ProFormText
        name=""
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.id',
          defaultMessage: '身份证',
        })}
      /> */}
      <ProFormRadio.Group
        name="sex"
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.gender',
          defaultMessage: '性别',
        })}
        initialValue="Male"
        valueEnum={{
          Male: intl.formatMessage({
            id: 'pages.personnel-manage.organization.department.person.gender.male',
            defaultMessage: '男',
          }),
          Female: intl.formatMessage({
            id: 'pages.personnel-manage.organization.department.person.gender.female',
            defaultMessage: '女',
          }),
        }}
      />
      <SelectPersonnelTagSelect
        name="tag"
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.tag',
          defaultMessage: '绑定标签',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.personnel-manage.organization.department.person.tag.required.failure',
              defaultMessage: '请选择绑定标签',
            }),
          },
        ]}
      />
      <SelectPersonnelTypeSelect
        name="typeId"
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.type',
          defaultMessage: '人员类型',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.personnel-manage.organization.department.person.type.required.failure',
              defaultMessage: '请选择人员类型',
            }),
          },
        ]}
      />
      <SelectDepartmentCascader
        name="depId"
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.parent',
          defaultMessage: '所属部门',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.personnel-manage.organization.department.parent.required.failure',
              defaultMessage: '请选择所属部门',
            }),
          },
        ]}
      />
      <ImageUploadFormItem
        name="avatar"
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.icon',
          defaultMessage: '头像',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.personnel-manage.organization.department.person.icon.required.failure',
              defaultMessage: '请选择头像',
            }),
          },
        ]}
      />
    </ModalForm>
  );
}
