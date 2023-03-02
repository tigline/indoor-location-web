import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { updatePersonnel } from '@/services/swagger/renyuanguanli';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, notification, UploadFile } from 'antd';
import React from 'react';
import type { NodeType } from '..';

interface IProps {
  record: API.PersonnelFillInfo;
  treeData: NodeType[];
  refresh?: () => void;
}
/**
 * 更新人员信息
 *
 * @export
 * @param {IProps} props
 * @return {*}
 */
export function EditPersonnelModal(props: IProps) {
  const intl = useIntl();
  const { run: update } = useRequest(updatePersonnel, {
    manual: true,
    onSuccess(data) {
      if (data) {
        notification.success({
          message: intl.formatMessage({ id: 'app.edit.success', defaultMessage: '更新成功' }),
        });
      }
    },
  });
  React.useEffect(() => {}, []);

  return (
    <ModalForm<API.AddOrUpdatePersonnel>
      width={520}
      layout="horizontal"
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      title={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.edit',
        defaultMessage: '更换部门',
      })}
      trigger={
        <Button size="small" type="link">
          {intl.formatMessage({
            id: 'pages.personnel-manage.organization.department.person.update',
            defaultMessage: '更新人员信息',
          })}
        </Button>
      }
      onFinish={(values) => {
        return update({ personnelId: props.record.personnelId! }, values);
      }}
    >
      <ImageUploadFormItem
        name="avatar"
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.icon',
          defaultMessage: '头像',
        })}
        initialValue={
          [
            {
              uid: Date.now() + '',
              response: props.record?.avatar,
              thumbUrl: props.record?.avatar,
            },
          ] as UploadFile<any>[]
        }
      />
      <ProFormTreeSelect
        request={() => Promise.resolve(props.treeData)}
        name="depId"
        fieldProps={{
          treeDefaultExpandedKeys: [],
        }}
        initialValue={props.record.depId}
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.parent',
          defaultMessage: '所属部门',
        })}
      />
      <ProFormText
        name="name"
        initialValue={props.record.name}
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.name',
          defaultMessage: '姓名',
        })}
      />
      <ProFormSelect
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.gender',
          defaultMessage: '性别',
        })}
        name="sex"
        initialValue={props.record.sex}
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
      {/* TODO: 需要完善人员类型后填充 */}
      <ProFormText
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.type',
          defaultMessage: '人员类型',
        })}
        name="typeId"
      />
    </ModalForm>
  );
}
