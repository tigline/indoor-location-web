import { deleteDepartment, treeDepartment } from '@/services/swagger/renyuanguanli';
import { OK } from '@/utils/global.utils';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, Card, Col, notification, Row, Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import { filter, forEach } from 'lodash';
import React from 'react';
import { AddDepartmentModal } from './components/add-department.modal';
import { EditDepartmentModal } from './components/edit-department.modal';
import './index.less';

type NodeType = DataNode & { parentId?: string | number; value?: string | number };
export default function Page() {
  const intl = useIntl();
  const [selectedKeys, setSelectedKeys] = React.useState<React.Key[]>();
  const { run, data } = useRequest(treeDepartment, {
    manual: true,
    formatResult(res) {
      if (res.code === OK) {
        const record: Record<string, NodeType> = {};
        forEach(res.data, (val) => {
          if (val.depId) {
            record[val.depId] = {
              title: val.name,
              key: val.depId,
              value: val.depId,
              parentId: val.parentId,
              children: [],
            };
          }
        });
        forEach(res.data, (val) => {
          if (val.parentId && val.depId) {
            record[val.parentId].children?.push(record[val.depId]);
          }
        });
        const result = filter(record, (val) => !val.parentId);
        return result;
      }
    },
  });
  React.useEffect(() => {
    run();
  }, []);
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
  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        <Col flex="320px">
          <Card bodyStyle={{ minHeight: 600, overflow: 'auto', maxWidth: '100%' }}>
            <Tree
              treeData={data}
              blockNode
              onSelect={(keys) => setSelectedKeys(keys)}
              selectedKeys={selectedKeys}
              titleRender={(item: NodeType) => {
                // return (
                //   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                //     <span style={{ whiteSpace: 'nowrap' }}>{item.title as React.ReactNode}</span>
                //     <Dropdown
                //       className="department-action"
                //       menu={{
                //         items: [
                //           {
                //             key: 'add',
                //             label: (
                //               <AddDepartmentModal
                //                 parentId={item.key as string}
                //                 parentName={item.title as string}
                //                 refresh={run}
                //               />
                //             ),
                //           },
                //           {
                //             key: 'edit',
                //             label: (
                //               <EditDepartmentModal
                //                 treeData={data}
                //                 name={item.title as string}
                //                 depId={item.key as number}
                //                 parentId={item.parentId as string}
                //                 refresh={run}
                //               />
                //             ),
                //           },
                //           {
                //             key: 'remove',
                //             label: (
                //               <span onClick={() => remove({ depId: item.key as number })}>
                //                 {intl.formatMessage({ id: 'app.remove', defaultMessage: '删除' })}
                //               </span>
                //             ),
                //           },
                //         ],
                //       }}
                //     >
                //       <Button size="small" type="link" onClick={(e) => e.preventDefault()}>
                //         {intl.formatMessage({ id: 'app.action', defaultMessage: '操作' })}
                //       </Button>
                //     </Dropdown>
                //   </div>
                // );
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
                        onClick={() => remove({ depId: item.key as number })}
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
          {/* {JSON.stringify(selectedKeys)} */}
          <ProTable />
        </Col>
      </Row>
    </PageContainer>
  );
}
