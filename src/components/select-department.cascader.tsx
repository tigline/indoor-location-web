import { NodeType } from '@/pages/personnel-manage/organization';
import { treeDepartment } from '@/services/swagger/renyuanguanli';
import { OK } from '@/utils/global.utils';
import { ProFormCascader } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { filter, forEach, last, set } from 'lodash';
import React from 'react';

/**
 * 部门树形选择组件
 *
 * @export
 * @param {typeof ProFormCascader} props
 * @return {*}
 */
export function SelectDepartmentCascader(props: React.ComponentProps<typeof ProFormCascader>) {
  const intl = useIntl();
  // 获取部门树形列表
  const { run, data } = useRequest(treeDepartment, {
    manual: true,
    formatResult(res) {
      if (res.code === OK) {
        const record: Record<string, NodeType & { label?: string }> = {};
        forEach(res.data, (val) => {
          if (val.depId) {
            record[val.depId] = {
              label: val.name,
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
  return (
    <ProFormCascader
      label={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.parent',
        defaultMessage: '所属部门',
      })}
      transform={(value: any) => {
        const obj = {};
        set(obj, props.name ?? 'depId', last<string>(value));
        return obj;
      }}
      fieldProps={{ options: data }}
      {...props}
    />
  );
}
