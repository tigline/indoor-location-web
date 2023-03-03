import { pagePersonnelType } from '@/services/swagger/renyuanguanli';
import { fmtPage } from '@/utils/global.utils';
import { ProFormSelect } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';

/**
 * 人员类型选择组件
 *
 * @export
 * @return {*}
 */
export function SelectPersonnelTypeSelect(props: React.ComponentProps<typeof ProFormSelect>) {
  const intl = useIntl();
  const { run } = useRequest(pagePersonnelType, {
    manual: true,
    formatResult(res) {
      return (
        fmtPage(res).data?.map((item) => ({
          label: item.typeName,
          value: item.typeId,
          key: item.typeId,
        })) ?? []
      );
    },
  });
  return (
    <ProFormSelect
      label={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.type',
        defaultMessage: '人员类型',
      })}
      request={() => run({ current: '1', size: '1000' })}
      {...props}
    />
  );
}
