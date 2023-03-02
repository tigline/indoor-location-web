import { listBuilding, listMaps } from '@/services/swagger/xitongguanli';
import { FormInstance, ProFormCascader, ProFormItemProps } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { first } from 'lodash';
import React from 'react';

interface OptionType {
  label: string;
  value: string;
  isLeaf: boolean;
  children?: OptionType[];
}

interface IProps extends ProFormItemProps {
  submit?: (mapId: string) => void;
  form?: FormInstance<{ mapId: string[] }> | null;
}
export function SelectMapCascader(props: IProps) {
  const intl = useIntl();
  const [options, setOptions] = React.useState<OptionType[]>();
  const loaded = React.useRef<boolean>();
  const { run } = useRequest(listMaps, {
    manual: true,
    formatResult(res) {
      return res.data?.map((item) => ({
        label: item.name,
        value: item.mapId,
        isLeaf: true,
      }));
    },
    onSuccess(res: any[], [params]) {
      setOptions((pre) => {
        if (!loaded.current) {
          const buildingId = first(pre)?.value;
          const map_id = first(res)?.value;
          props.form?.setFieldValue(['mapId'], [buildingId!, map_id!]);
          props.submit?.(map_id);
          loaded.current = true;
        }
        return pre?.map((item) => ({
          ...item,
          children: params.buildingId === item.value ? res : item.children,
        }));
      });
    },
  });
  const {} = useRequest(listBuilding, {
    formatResult(res) {
      return res.data?.map((item) => ({
        label: item.name,
        value: item.buildingId,
        isLeaf: false,
      }));
    },
    onSuccess(res: any[]) {
      setOptions(res);
      const buildingId = first(res)?.buildingId;
      run({ buildingId, hidePicture: true });
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
        changeOnSelect: false,
        showSearch: false,
        expandTrigger: 'hover',
        style: { maxWidth: 240 },
        // onChange: (res) => console.log(res),
        loadData: (selectOptions) => {
          const targetOption = selectOptions[selectOptions.length - 1];
          targetOption.loading = true;
          targetOption.children = [];
          run({ buildingId: targetOption.value + '', hidePicture: true });
        },
      }}
      {...props}
    ></ProFormCascader>
  );
}
