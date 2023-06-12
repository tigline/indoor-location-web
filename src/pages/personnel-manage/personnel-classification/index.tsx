import { RemoveButtonPopover } from '@/components/remove-button.popover';
import { deletePersonType, pagePersonnelType } from '@/services/swagger/renyuanguanli';
import { fmtPage } from '@/utils/global.utils';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, notification } from 'antd';
import { AddPersonnelModal } from './components/add-personnel.modal';
import { EditPersonnelModal } from './components/edit-personnel.modal';

export default function Page() {
  const intl = useIntl();
  const { run: query } = useRequest(pagePersonnelType, {
    manual: true,
    formatResult(res) {
      return fmtPage(res);
    },
  });

  const { run: remove, fetches } = useRequest(deletePersonType, {
    manual: true,
    fetchKey: (o) => o.typeId + '',
    onSuccess(data) {
      if (data) {
        notification.success({
          message: intl.formatMessage({ id: 'app.remove.success', defaultMessage: '删除成功' }),
        });
      }
    },
  });

  const columns: ProColumns<API.PersonnelTypeInfo>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.type.name',
        defaultMessage: '人员类型名称',
      }),
      dataIndex: 'typeName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.type.icon',
        defaultMessage: '图标',
      }),
      // width: 100,
      dataIndex: 'picture',
      valueType: 'image',
    },
    {
      title: intl.formatMessage({ id: 'app.createTime', defaultMessage: '创建时间' }),
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({ id: 'app.action', defaultMessage: '操作' }),
      render(_, record, __, action) {
        return (
          <Button.Group>
            <EditPersonnelModal record={record} refresh={action?.reload} />
            <RemoveButtonPopover
              disabled={!record.typeId}
              onClick={() => remove({ typeId: record.typeId! }).then(() => action?.reload())}
              loading={fetches?.[record.typeId!]?.loading}
            />
          </Button.Group>
        );
      },
    },
  ];
  return (
    <PageContainer childrenContentStyle={{padding:20}}>
      <ProTable
        columns={columns}
        search={false}
        toolBarRender={(action) => [<AddPersonnelModal key="add" refresh={action?.reload} />]}
        request={(parma) => {
          const { current, pageSize, ...rest } = parma;
          return query({ current: current + '', size: pageSize + '', ...rest });
        }}
        options={{ setting: false }}
      />
    </PageContainer>
  );
}
