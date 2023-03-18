import { addPersonnel } from '@/services/swagger/renyuanguanli';
import { ModalForm } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, notification } from 'antd';
import React from 'react';
import { PersonnelInfoFormFragment } from './personnel-info.form.fragment';

interface IProps {
  record: API.PersonnelFillInfo;
  refresh?: () => void;
}
export function EditPersonnelInfoModal(props: IProps) {
  const intl = useIntl();
  const [visible, setVisible] = React.useState<boolean>();
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
      onOpenChange={(val) => setVisible(val)}
      trigger={
        <Button type="link" size="small">
          {intl.formatMessage({ id: 'app.action.edit', defaultMessage: '编辑' })}
        </Button>
      }
      onFinish={(value) => {
        return run(value);
      }}
    >
      <PersonnelInfoFormFragment record={props.record} visible={visible} />
    </ModalForm>
  );
}
