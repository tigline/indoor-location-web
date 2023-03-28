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

export function SelectBeacon(props: React.ComponentProps<typeof ProFormSelect>) {
  const intl = useIntl();
  return (
    <ProFormSelect
      request={async ({ keyWords = '' }) => {
        const res = await pageBeacon({ current: '1', size: '20', name: keyWords });
        const list =
          fmtPage(res).data?.map((item) => ({
            label: item.name,
            value: item.deviceId,
            key: item.deviceId,
          })) ?? [];
        return list;
        // return run({ current: '1', size: '20', name: keyWords });
      }}
      placeholder={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.tag.placeholder',
        defaultMessage: '请选择标签',
      })}
      fieldProps={{
        showSearch: true,
        style: { minWidth: 180 },
      }}
      {...props}
    />
  );
}
