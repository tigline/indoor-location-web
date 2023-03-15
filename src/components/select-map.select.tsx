import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import React from 'react';

type IProps = ProFormSelectProps;
export function SelectMapSelect(props: IProps) {
  const { run, options, loading, initialValue } = useModel('mapModel');
  React.useEffect(() => {
    run();
  }, []);
  return (
    <ProFormSelect
      {...props}
      width="lg"
      name="mapId"
      style={{ width: 240 }}
      fieldProps={{ loading }}
      initialValue={props.initialValue ?? initialValue}
      options={options}
    />
  );
}
