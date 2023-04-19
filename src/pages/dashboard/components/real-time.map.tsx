import { RealTimeL7Component } from '@/components/map-components/real-time-L7-component';
import { SelectMapSelect } from '@/components/select-map.select';
import { ILocation } from '@/models/messageSocket';
import { pageGateway } from '@/services/swagger/shebeiguanli';
import { getMap } from '@/services/swagger/xitongguanli';
import { ProForm, ProFormInstance } from '@ant-design/pro-components';
import { useIntl, useModel, useRequest } from '@umijs/max';
import { ReadyState } from 'ahooks/lib/useWebSocket';
import { Card } from 'antd';
import { isNil, map } from 'lodash';
import React from 'react';

/**
 * 实时地图组件，概览页面应用
 *
 * @export
 * @return {*}
 */
export function RealTimeMap() {
  const intl = useIntl();
  const formRef = React.useRef<ProFormInstance<{ mapId: string[] }>>(null);
  const [beacons, setBeacons] = React.useState<Record<string, API.AoaDataInfo>>();
  const { run, data: mapInfo } = useRequest(getMap, {
    manual: true,
    formatResult: (res) => res,
  });
  const { run: query, data: gateways } = useRequest(pageGateway, {
    manual: true,
  });
  const { readyState, connect, data } = useModel('messageSocket');
  React.useEffect(() => {
    if (ReadyState.Closed === readyState) {
      connect?.();
    }
  }, [readyState]);
  React.useEffect(() => {
    if (data) {
      const res = JSON.parse(data) as ILocation;
      // 这里只处理'定位数据'
      if (res.type === 'AOAData') {
        setBeacons((pre) => {
          return { ...pre, [res.data.deviceId!]: res.data as API.AoaDataInfo };
        });
      }
    }
  }, [data]);

  function submit(mapId: string) {
    query({ mapId: mapId });
    return run({ mapId });
  }
  React.useEffect(() => {
    const mapId = formRef.current?.getFieldValue(['mapId']);
    if (mapId) {
      submit(mapId);
    }
  }, []);
  return (
    <Card
      bodyStyle={{ minHeight: 400 }}
      title={intl.formatMessage({ id: 'menu.dashboard.map', defaultMessage: '地图' })}
      extra={
        <ProForm<{ mapId: string[] }>
          submitter={false}
          layout="inline"
          formRef={formRef}
          onValuesChange={(values) => {
            if (!isNil(values.mapId)) {
              submit(values.mapId);
            }
          }}
          style={{ minWidth: 320, height: '100%', alignItems: 'end', justifyContent: 'end' }}
        >
          <SelectMapSelect></SelectMapSelect>
        </ProForm>
      }
    >
      <RealTimeL7Component
        height={400 - 48}
        map={mapInfo?.data?.picture}
        rect={[mapInfo?.data?.length, mapInfo?.data?.width]}
        stations={gateways?.items}
        locations={map(beacons, (o) => o).filter((f) => f.mapId === mapInfo?.data?.mapId)}
      />
    </Card>
  );
}
