import { listBuilding, listMaps } from '@/services/swagger/xitongguanli';
import { ProFormCascader, ProFormItemProps } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import React from 'react';

interface OptionType {
  label: string;
  value: string;
  isLeaf: boolean;
  children?: OptionType[];
}

export function SelectMapCascader(props: ProFormItemProps) {
  const intl = useIntl();
  const [options, setOptions] = React.useState<OptionType[]>();
  const {} = useRequest(listBuilding, {
    formatResult(res) {
      return res.data?.map((item) => ({
        label: item.name,
        value: item.buildingId,
        isLeaf: false,
      }));
    },
    onSuccess(res) {
      setOptions(res);
    },
  });
  const { run } = useRequest(listMaps, {
    manual: true,
    formatResult(res) {
      return res.data?.map((item) => ({
        label: item.name,
        value: item.mapId,
        isLeaf: true,
      }));
    },
    onSuccess(data, [params]) {
      setOptions((pre) => {
        return pre?.map((item) => ({
          ...item,
          children: params.buildingId === item.value ? data : item.children,
        }));
      });
    },
  });
  return (
    <ProFormCascader
      width="lg"
      name="mapId"
      label={intl.formatMessage({
        id: 'pages.device-manage.label.device.map',
        defaultMessage: '地图',
      })}
      fieldProps={{
        options: options,
        changeOnSelect: true,
        showSearch: false,
        expandTrigger: 'hover',
        // onChange: (res) => console.log(res),
        loadData: (selectOptions) => {
          const targetOption = selectOptions[selectOptions.length - 1];
          targetOption.loading = true;
          targetOption.children = [];
          run({ buildingId: targetOption.value + '' });
        },
      }}
      {...props}
    ></ProFormCascader>
  );
}
