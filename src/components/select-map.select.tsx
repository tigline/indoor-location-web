import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';

type IProps = ProFormSelectProps;
export function SelectMapSelect(props: IProps) {
  const { options, loading, initialValue } = useModel('mapModel');
  return (
    <ProFormSelect
      {...props}
      width="lg"
      name="mapId"
      style={{ width: 240 }}
      fieldProps={{ loading }}
      initialValue={initialValue}
      options={options}
    ></ProFormSelect>
  );
}
