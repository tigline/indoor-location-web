import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { SelectDepartmentCascader } from '@/components/select-department.cascader';
import { SelectPersonnelTagSelect } from '@/components/select-personnel-tag.select';
import { SelectPersonnelTypeSelect } from '@/components/select-personnel-type.select';
import { addPersonnel } from '@/services/swagger/renyuanguanli';
import { ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, notification, UploadFile } from 'antd';

interface IProps {
  record: API.PersonnelFillInfo;
  refresh?: () => void;
}
export function EditPersonnelInfoModal(props: IProps) {
  const intl = useIntl();
  const { run } = useRequest(addPersonnel, {
    manual: true,
    onSuccess(data) {
      if (data) {
        props.refresh?.();
        notification.success({
          message: intl.formatMessage({ id: 'app.edit.success', defaultMessage: '更新成功' }),
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
        <Button type="link" size="small">
          {intl.formatMessage({ id: 'app.action.edit', defaultMessage: '编辑' })}
        </Button>
      }
      onFinish={(value) => {
        return run(value);
      }}
    >
      <ProFormText
        name="name"
        initialValue={props.record.name}
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
      <ProFormRadio.Group
        name="sex"
        initialValue={props.record.sex}
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.gender',
          defaultMessage: '性别',
        })}
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
        initialValue={props.record.tag}
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
        initialValue={props.record.typeId}
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
        initialValue={props.record.depId}
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
        initialValue={
          [
            {
              uid: Date.now() + '',
              response: props.record?.avatar,
              thumbUrl: props.record?.avatar,
            },
          ] as UploadFile<any>[]
        }
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
