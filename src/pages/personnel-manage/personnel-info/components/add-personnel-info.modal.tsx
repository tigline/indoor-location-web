import { addPersonnel } from '@/services/swagger/renyuanguanli';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, Form, notification } from 'antd';
import React from 'react';
import { PersonnelInfoFormFragment } from './personnel-info.form.fragment';

interface IProps {
  refresh?: () => void;
}
export function AddPersonnelInfoModal(props: IProps) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState<boolean>();
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
  React.useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);
  return (
    <ModalForm<API.AddOrUpdatePersonnel>
      title={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.info.add',
        defaultMessage: '添加人员',
      })}
      layout="horizontal"
      form={form}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      //onOpenChange={(val) => setVisible(val)}
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          {intl.formatMessage({ id: 'app.action.add', defaultMessage: '新建' })}
        </Button>
      }
      onFinish={(value) => {
        return run(value);
      }}
    >
      <PersonnelInfoFormFragment visible={visible} />
    </ModalForm>
  );
}
