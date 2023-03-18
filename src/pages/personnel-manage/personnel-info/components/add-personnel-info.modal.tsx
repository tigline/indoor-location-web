import { addPersonnel } from '@/services/swagger/renyuanguanli';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, notification } from 'antd';
import React from 'react';
import { PersonnelInfoFormFragment } from './personnel-info.form.fragment';

interface IProps {
  refresh?: () => void;
}
export function AddPersonnelInfoModal(props: IProps) {
  const intl = useIntl();
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
  return (
    <ModalForm<API.AddOrUpdatePersonnel>
      title={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.info.add',
        defaultMessage: '添加人员',
      })}
      layout="horizontal"
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      onOpenChange={(val) => setVisible(val)}
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
