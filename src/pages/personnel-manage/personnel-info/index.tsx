import { RemoveButtonPopover } from '@/components/remove-button.popover';
import { deletePersonnel, pagePersonnel } from '@/services/swagger/renyuanguanli';
import { fmtPage } from '@/utils/global.utils';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, Image, Input, notification } from 'antd';
import { AddPersonnelInfoModal } from './components/add-personnel-info.modal';
import { EditPersonnelInfoModal } from './components/edit-personnel-info.modal';

export default function Page() {
  const intl = useIntl();
  const { run } = useRequest(pagePersonnel, {
    manual: true,
    formatResult(res) {
      return fmtPage(res);
    },
  });
  const { run: remove, fetches } = useRequest(deletePersonnel, {
    manual: true,
    fetchKey: (o) => o.personnelId + '',
    onSuccess(data) {
      if (data) {
        // refresh?.();
        notification.success({
          message: intl.formatMessage({ id: 'app.remove.success', defaultMessage: '删除成功' }),
        });
      }
    },
  });
  const columns: ProColumns<API.PersonnelFillInfo>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.name',
        defaultMessage: '姓名',
      }),
      dataIndex: 'name',
      formItemProps: {
        name: 'searchValue',
        label: null,
      },
      renderFormItem: (_, { type, defaultRender, fieldProps }: any, form) => {
        if (type === 'form') {
          return null;
        }
        const status = form.getFieldValue('state');
        if (status !== 'open') {
          return (
            // value 和 onchange 会通过 form 自动注入。
            // 组件的配置
            <Input
              {...fieldProps}
              // 自定义配置
              allowClear
              placeholder={intl.formatMessage({
                id: 'pages.personnel-manage.organization.department.person.search.value',
                defaultMessage: '输入名字，标签地址等等',
              })}
            />
          );
        }
        return defaultRender(_);
      },
      // search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.gender',
        defaultMessage: '性别',
      }),
      dataIndex: 'sex',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.tag',
        defaultMessage: '绑定标签',
      }),
      dataIndex: 'tag',
      search: false,
    },
    // {
    //   title: intl.formatMessage({
    //     id: 'pages.personnel-manage.organization.department.person.id',
    //     defaultMessage: '身份证',
    //   }),
    //   dataIndex: 'personnelId',
    //   search: false,
    // },
    {
      title: intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.type',
        defaultMessage: '人员类型',
      }),
      dataIndex: 'typeName',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.parent',
        defaultMessage: '所属部门',
      }),
      dataIndex: 'depName',
      search: false,
    },
    // {
    //   title: intl.formatMessage({
    //     id: 'pages.personnel-manage.organization.department.person.icon',
    //     defaultMessage: '头像',
    //   }),
    //   dataIndex: 'avatar',
    //   render(dom, entity) {
    //     return <Image width={100} height={100} src={entity.avatar}></Image>;
    //   },
    //   search: false,
    // },
    {
      title: intl.formatMessage({ id: 'app.action', defaultMessage: '操作' }),
      search: false,
      render(_, record, __, action) {
        return (
          <Button.Group>
            <EditPersonnelInfoModal record={record} refresh={action?.reload} />
            <RemoveButtonPopover
              disabled={!record.personnelId}
              loading={fetches?.[record.personnelId!]?.loading}
              onClick={() =>
                remove({ personnelId: record.personnelId! }).then(() => action?.reload())
              }
            />
          </Button.Group>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        toolBarRender={(action) => [<AddPersonnelInfoModal key="add" refresh={action?.reload} />]}
        request={(param) => {
          const { current, pageSize, ...rest } = param;
          return run({ current: current + '', size: pageSize + '', ...rest });
        }}
        options={{ setting: false }}
      />
    </PageContainer>
  );
}
