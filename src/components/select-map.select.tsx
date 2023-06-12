import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';
import { useModel,useIntl } from '@umijs/max';
import React from 'react';

type IProps = ProFormSelectProps;
export function SelectMapSelect(props: IProps) {
  const intl = useIntl();
  const { run, options, loading, initialValue } = useModel('mapModel');
  React.useEffect(() => {
    run();
  }, []);
  return (
    <ProFormSelect
      {...props}
      rules={[
        {
          required: true,
          message: intl.formatMessage({
            id: 'pages.device-manage.track.map.required',
            defaultMessage: '请选择地图',
          }),
        },
      ]}
      width="lg"
      name="mapId"
      style={{ width: 240 }}
      fieldProps={{ loading }}
      initialValue={props.initialValue ?? initialValue}
      options={options}
    />
  );
}
