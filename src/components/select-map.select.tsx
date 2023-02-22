import { listMaps } from '@/services/swagger/xitongguanli';
import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';

type IProps = ProFormSelectProps;
export function SelectMapSelect(props: IProps) {
  const { data, loading } = useRequest(listMaps, {
    // manual: true,
    formatResult(res) {
      return (res.data ?? []).map((item) => ({
        label: item.name,
        value: item.mapId,
      }));
    },
  });

  return (
    <ProFormSelect
      {...props}
      width="lg"
      name="mapId"
      style={{ width: 240 }}
      fieldProps={{ loading }}
      options={data}
    ></ProFormSelect>
  );
}
