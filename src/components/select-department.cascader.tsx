import { treeDepartment } from '@/services/swagger/renyuanguanli';
import { OK } from '@/utils/global.utils';
import { ProFormCascader } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { CascaderProps } from 'antd';
import { last, set } from 'lodash';
import React from 'react';

type DepartmentTreeType = API.DepartmentTree & {
  children: DepartmentTreeType[];
};

function convert(list: DepartmentTreeType[]): CascaderProps['options'] {
  return list?.map((val) => ({
    label: val.name,
    key: val.depId,
    value: val.depId,
    parentId: val.parentId,
    children: convert(val.children),
  }));
}

interface IProps extends React.ComponentProps<typeof ProFormCascader> {
  visible?: boolean;
}
/**
 * 部门树形选择组件
 *
 * @export
 * @param {typeof ProFormCascader} props
 * @return {*}
 */
export function SelectDepartmentCascader(props: IProps) {
  const intl = useIntl();
  // 获取部门树形列表
  const { run, data } = useRequest(treeDepartment, {
    manual: true,
    formatResult(res) {
      if (res.code === OK) {
        return convert(res.data);
      }
    },
  });
  React.useEffect(() => {
    //if (props.visible) {
      run();
    //}
  }, [props.visible]);
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
