import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { updatePersonnelType } from '@/services/swagger/renyuanguanli';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, notification, UploadFile } from 'antd';
interface IProps {
  record: API.PersonnelTypeInfo;
  refresh?: () => void;
}
/**
 * 编辑人员类型
 *
 * @export
 * @param {IProps} props
 * @return {*}
 */
export function EditPersonnelModal(props: IProps) {
  const intl = useIntl();
  const { run } = useRequest(updatePersonnelType, {
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
    <ModalForm<API.AddOrUpdatePersonnelType>
      title={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.type.edit',
        defaultMessage: '编辑人员类型',
      })}
      trigger={
        <Button disabled={!props.record.typeId} type="link" size="small">
          {intl.formatMessage({ id: 'app.edit', defaultMessage: '编辑' })}
        </Button>
      }
      layout="horizontal"
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      onFinish={(value) => {
        return run({ typeId: props.record.typeId! }, value);
      }}
    >
      <ProFormText
        label={intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.type.name',
          defaultMessage: '人员类型名称',
        })}
        initialValue={props.record.typeName}
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
        initialValue={
          [
            {
              uid: Date.now() + '',
              response: props.record?.picture,
              thumbUrl: props.record?.picture,
            },
          ] as UploadFile<any>[]
        }
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
