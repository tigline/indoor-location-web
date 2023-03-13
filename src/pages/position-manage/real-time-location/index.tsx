import { AntdL7Component } from '@/components/map-components/antd-L7-component';
import { SelectMapSelect } from '@/components/select-map.select';
import { ILocation } from '@/models/messageSocket';
import { pageGateway } from '@/services/swagger/shebeiguanli';
import { getMap } from '@/services/swagger/xitongguanli';
import { fmt } from '@/utils/global.utils';
import {
  isNil,
  PageContainer,
  ProCard,
  ProForm,
  ProFormInstance,
  Statistic,
} from '@ant-design/pro-components';
import { useIntl, useModel, useRequest } from '@umijs/max';
import { useInterval } from 'ahooks';
import { ReadyState } from 'ahooks/lib/useWebSocket';
import { Card, Col, Row, Typography } from 'antd';
import { map } from 'lodash';
import React from 'react';

/**
 * 展示当前时间
 *
 * @return {*}
 */
export function StatisticOfNow() {
  const intl = useIntl();
  const [time, setTime] = React.useState(Date.now());
  useInterval(() => setTime(Date.now()), 500);
  return (
    <Statistic
      layout="vertical"
      title={intl.formatMessage({
        id: 'pages.position-manage.real-time-location.current-time',
        defaultMessage: '当前时间',
      })}
      value={fmt(time)}
      formatter={(val) => <Typography.Text strong>{val}</Typography.Text>}
    />
  );
}

/**
 * 实时位置页面
 *
 * @export
 * @return {*}
 */
export default function Page() {
  // const intl = useIntl();
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
    <PageContainer>
      <ProCard>
        <Row>
          <Col span="12">
            <StatisticOfNow />
          </Col>
          <Col span="12">
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
          </Col>
        </Row>
      </ProCard>
      <Card>
        <AntdL7Component
          map={mapInfo?.data?.picture}
          rect={[mapInfo?.data?.length, mapInfo?.data?.width]}
          stations={gateways?.items}
          locations={map(beacons, (o) => o).filter((f) => f.mapId === mapInfo?.data?.mapId)}
        />
      </Card>
    </PageContainer>
  );
}
