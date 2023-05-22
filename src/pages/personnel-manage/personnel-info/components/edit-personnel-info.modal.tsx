import { updatePersonnel } from '@/services/swagger/renyuanguanli';
import { ModalForm } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, Form, notification } from 'antd';
import React from 'react';
import { PersonnelInfoFormFragment } from './personnel-info.form.fragment';
import { listUnboundBeacon } from '@/services/swagger/shebeiguanli';

interface IProps {
  record: API.PersonnelFillInfo;
  refresh?: () => void;
}
export function EditPersonnelInfoModal(props: IProps) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState<boolean>();
  
  const { run } = useRequest(updatePersonnel, {
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
  React.useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);
  return (
    <ModalForm<API.AddOrUpdatePersonnel>
      title={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.info.edit',
        defaultMessage: '编辑人员',
      })}
      layout="horizontal"
      form={form}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      //onOpenChange={(val) => setVisible(val)}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}

      trigger={
        <Button type="link" size="small">
          {intl.formatMessage({ id: 'app.action.edit', defaultMessage: '编辑' })}
        </Button>
      }
      onFinish={(value) => {
        const params = {personnelId: props.record.personnelId || 0};
        const body = value;
        return run(params, body);
      }}
    >
      <PersonnelInfoFormFragment record={props.record} visible={visible} />
    </ModalForm>
  );
}
