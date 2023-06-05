import {
  deleteDepartment,
  pageDepPersonnel,
  treeDepartment,
} from '@/services/swagger/renyuanguanli';
import { fmtPage, OK } from '@/utils/global.utils';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, Card, Col, notification, Row, Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import { compact, first, isEmpty } from 'lodash';
import React from 'react';
import { AddDepartmentModal } from './components/add-department.modal';
import { EditDepartmentModal } from './components/edit-department.modal';
import { EditPersonnelModal } from './components/edit-personnel.modal';
import './index.less';

export type NodeType = DataNode & { parentId?: string | number; value?: string | number };

export default function Page() {
  const intl = useIntl();
  const [selectedKeys, setSelectedKeys] = React.useState<React.Key[]>();

  function convert(list?: API.DepartmentTree[]): NodeType[] | undefined {
    return list?.map((item) => ({
      title: item.name,
      value: item.depId,
      key: item.depId + '',
      parentId: item.parentId,
      children: convert((item as any).children),
    }));
  }

  // 获取部门树形列表
  const { run, data } = useRequest(treeDepartment, {
    manual: true,
    formatResult(res) {
      if (res.code === OK) {
        setTimeout(() => {
          setSelectedKeys(compact([first(res.data)?.depId]));
        }, 300);

        return convert(res.data);
      }
    },
  });
  React.useEffect(() => {
    run();
  }, []);
  // 删除部门
  const { run: remove, fetches } = useRequest(deleteDepartment, {
    manual: true,
    fetchKey: (o) => o.depId + '',
    onSuccess(data) {
      if (data) {
        notification.success({
          message: intl.formatMessage({ id: 'app.remove.success', defaultMessage: '删除成功' }),
        });
        run();
      }
    },
  });
  const { run: query } = useRequest(pageDepPersonnel, {
    manual: true,
    formatResult(res) {
      return fmtPage(res);
    },
  });
  const columns: ProColumns<API.PersonnelFillInfo>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.name',
        defaultMessage: '姓名',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.gender',
        defaultMessage: '性别',
      }),
      dataIndex: 'sex',
      valueEnum: {
        Male: intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.gender.male',
          defaultMessage: '男',
        }),
        Female: intl.formatMessage({
          id: 'pages.personnel-manage.organization.department.person.gender.female',
          defaultMessage: '女',
        }),
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.parent',
        defaultMessage: '所属部门',
      }),
      dataIndex: 'depName',
    },
    // {
    //   title: intl.formatMessage({
    //     id: 'pages.personnel-manage.organization.department.person.id',
    //     defaultMessage: '身份证',
    //   }),
    //   dataIndex: 'personnelId',
    // },
    {
      title: intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.type',
        defaultMessage: '人员类型',
      }),
      dataIndex: 'typeName',
    },
    // {
    //   title: intl.formatMessage({
    //     id: 'pages.personnel-manage.organization.department.person.icon',
    //     defaultMessage: '头像',
    //   }),
    //   dataIndex: 'avatar',
    //   valueType: 'image',
    // },
    {
      title: intl.formatMessage({ id: 'app.action', defaultMessage: '操作' }),
      render(_, record, __, action) {
        return (
          <EditPersonnelModal treeData={data ?? []} record={record} refresh={action?.reload} />
        );
      },
    },
  ];
  return (
    <PageContainer childrenContentStyle={{padding:20}}>
      <Row gutter={[16, 16]}>
        <Col flex="320px">
          <Card
            bodyStyle={{ minHeight: 600, overflow: 'auto', maxWidth: '100%' }}
            extra={<AddDepartmentModal refresh={run} />}
          >
            <Tree
              treeData={data}
              blockNode
              onSelect={(keys) => {
                if (!isEmpty(keys)) {
                  setSelectedKeys(keys);
                }
                const depId = first(keys) as number;
                if (depId) {
                  query({ depId });
                }
              }}
              selectedKeys={selectedKeys}
              titleRender={(item: NodeType) => {
                return (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ whiteSpace: 'nowrap' }}>{item.title as React.ReactNode}</span>
                    <span className="department-action">
                      <AddDepartmentModal
                        parentId={item.key as string}
                        parentName={item.title as string}
                        refresh={run}
                      />
                      <EditDepartmentModal
                        treeData={data}
                        name={item.title as string}
                        depId={item.key as number}
                        parentId={item.parentId as string}
                        refresh={run}
                      />
                      <Button
                        size="small"
                        type="link"
                        loading={fetches?.[item.key!]?.loading}
                        onClick={(e) => {
                          e.preventDefault();
                          return remove({ depId: item.key as number });
                        }}
                      >
                        {intl.formatMessage({ id: 'app.remove', defaultMessage: '删除' })}
                      </Button>
                    </span>
                  </div>
                );
              }}
            />
          </Card>
        </Col>
        <Col flex="auto">
          <ProTable
            options={{ setting: false }}
            request={(param) => {
              const { current, pageSize, depId, ...rest } = param;
              if (depId) {
                return query({
                  current: current + '',
                  size: pageSize + '',
                  depId: depId as number,
                  ...rest,
                });
              } else {
                return Promise.resolve({ code: OK });
              }
            }}
            rowKey={(o) => o.personnelId + ''}
            columns={columns}
            search={false}
            params={{ depId: first(selectedKeys) }}
          />
        </Col>
      </Row>
    </PageContainer>
  );
}
