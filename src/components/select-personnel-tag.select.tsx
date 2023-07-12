import { listUnboundBeacon, pageBeacon } from '@/services/swagger/shebeiguanli';
import { listCompany } from '@/services/swagger/xitongguanli';
import { fmtPage } from '@/utils/global.utils';
import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';

/**
 * 绑定标签选择组件
 *
 * @export
 * @return {*}
 */
export function SelectPersonnelTagSelect(props: React.ComponentProps<typeof ProFormSelect>) {
  const intl = useIntl();
  // const { run } = useRequest(pageBeacon, {
  //   manual: true,
  //   formatResult(res) {
  //     return (
  //       fmtPage(res).data?.map((item) => ({
  //         label: item.name,
  //         value: item.mac,
  //         key: item.deviceId,
  //       })) ?? []
  //     );
  //   },
  // });

  const { run } = useRequest(listUnboundBeacon, {
    manual: true,
    //debounceInterval: 300,
    formatResult(res) {
      const list =
        res.data
          ?.map((item) => ({
            label: item.deviceId,
            value: item.deviceId,
            key: item.deviceId,
          })) ?? []
          // 更新页面需要添加本条数据对应的标签信息
          //.concat([{ label: props.record.tag, value: props.record.tag }])
      return list;
    },
  });
  return (
    <ProFormSelect
      label={intl.formatMessage({
        id: 'pages.personnel-manage.organization.department.person.tag',
        defaultMessage: '绑定标签',
      })}
      request={() => run({})}
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
      rules={[
        {
          required: true,
          message: intl.formatMessage({
            id: 'pages.device-manage.track.beacon.required',
            defaultMessage: '请选择标签',
          }),
        },
      ]}
      fieldProps={{
        showSearch: true,
        style: { minWidth: 180 },
      }}
      {...props}
    />
  );
}

interface SelectVendorProps extends ProFormSelectProps {
  companyCode?: string;
  onValueChange?: (value: string | undefined) => void;
}

export function SelectVendor(props: SelectVendorProps) {
  const intl = useIntl();

  const handleChange = (value: string | undefined) => {
    // 这里，我们调用传递给组件的 onValueChange 函数
    props.onValueChange?.(value);
  };
  return (
    <ProFormSelect
      request={async ({ keyWords = '' }) => {
        var lang = intl.locale;
        if (lang == 'zh-CN') {
          lang = 'cn';
        } else if (lang == 'ja-JP') {
          lang = 'jp';
        } else {
          lang = 'en';
        } 
        const params: API.listCompanyParams = {
          lang: lang,
        };
        const res = await listCompany(params);
        const list = res.data?.map((item) => ({
          label: item.label,
          value: item.value,
        })) ?? [];
        return list;
        // return run({ current: '1', size: '20', name: keyWords });
      }}
      placeholder={intl.formatMessage({
        id: 'pages.device-manage.base-vendor.select.placeholder',
        defaultMessage: '请选择厂商',
      })}
      rules={[
        {
          required: true,
          message: intl.formatMessage({
            id: 'pages.device-manage.base-vendor.name.required.failure',
            defaultMessage: '厂商名称不能为空',
          }),
        },
      ]}
      fieldProps={{
        showSearch: true,
        style: { minWidth: 180 },
        onChange: handleChange, // 添加此行
      }}
      {...props}
    />
  );
}
