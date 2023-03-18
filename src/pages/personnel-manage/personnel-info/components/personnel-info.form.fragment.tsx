import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { SelectDepartmentCascader } from '@/components/select-department.cascader';
import { SelectPersonnelTagSelect } from '@/components/select-personnel-tag.select';
import { SelectPersonnelTypeSelect } from '@/components/select-personnel-type.select';
import { ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { UploadFile } from 'antd';
import React from 'react';

interface IProps {
  record?: API.PersonnelFillInfo;
  visible?: boolean;
}

export function PersonnelInfoFormFragment(props: IProps) {
  const intl = useIntl();
  const imageInitialValue = props.record
    ? ([
        {
          uid: Date.now() + '',
          response: props.record?.avatar,
          thumbUrl: props.record?.avatar,
        },
      ] as UploadFile<any>[])
    : undefined;
  return (
    <React.Fragment>
      <ProFormText
        name="name"
        initialValue={props.record?.name}
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
        initialValue={props.record?.sex}
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
        initialValue={props.record?.tag}
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.tag',
          defaultMessage: '绑定标签',
        })}
        // rules={[
        //   {
        //     required: true,
        //     message: intl.formatMessage({
        //       id: 'pages.personnel-manage.organization.department.person.tag.required.failure',
        //       defaultMessage: '请选择绑定标签',
        //     }),
        //   },
        // ]}
      />
      <SelectPersonnelTypeSelect
        name="typeId"
        initialValue={props.record?.typeId}
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
        visible={props.visible}
        initialValue={props.record?.depId}
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
        initialValue={imageInitialValue}
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
    </React.Fragment>
  );
}
