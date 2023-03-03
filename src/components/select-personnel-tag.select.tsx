import { pageBeacon } from '@/services/swagger/shebeiguanli';
import { fmtPage } from '@/utils/global.utils';
import { ProFormSelect } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';

/**
 * 绑定标签选择组件
 *
 * @export
 * @return {*}
 */
export function SelectPersonnelTagSelect(props: React.ComponentProps<typeof ProFormSelect>) {
  const intl = useIntl();
  const { run } = useRequest(pageBeacon, {
    manual: true,
    formatResult(res) {
      return (
        fmtPage(res).data?.map((item) => ({
          label: item.name,
          value: item.mac,
          key: item.deviceId,
        })) ?? []
      );
    },
  });
  return (
    <ProFormSelect
      label={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.tag',
        defaultMessage: '绑定标签',
      })}
      request={() => run({ current: '1', size: '1000' })}
      {...props}
    />
  );
}
