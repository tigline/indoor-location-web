import { AntdL7Component } from '@/components/map-components/antd-L7-component';
import { SelectMapSelect } from '@/components/select-map.select';
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
import { useInterval, useWebSocket } from 'ahooks';
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

export interface ILocation {
  type: string;
  data: Data;
}

export interface Data {
  deviceId: string;
  id: number;
  mapId: string;
  optScale: number;
  posX: number;
  posY: number;
  timestamp: number;
  type: string;
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
  const { run, data } = useRequest(getMap, {
    manual: true,
    formatResult: (res) => res,
  });
  const { run: query, data: gateways } = useRequest(pageGateway, {
    manual: true,
  });
  const { initialState } = useModel('@@initialState');
  // const { latestMessage } = useWebSocket(
  //   `ws://${location.host}/websocket?userId=${initialState?.currentUser?.userId}`,
  // );
  const {} = useWebSocket(
    `ws://120.78.168.7/websocket?userId=${initialState?.currentUser?.userId}`,
    {
      onOpen: () => console.log('web socket connected'),
      onClose: () => console.log('web socket closed'),
      onMessage(message: MessageEvent<ILocation>) {
        console.log('Receive:', message);
        setBeacons((pre) => ({
          ...pre,
          [message.data.data.deviceId]: message.data.data,
        }));
      },
      onError: (err) => console.log(err),
    },
  );

  function submit(mapId: string) {
    query({ mapId: mapId });
    return run({ mapId });
  }

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
          map={data?.data?.picture}
          rect={[data?.data?.width, data?.data?.length]}
          stations={gateways?.items}
          locations={map(beacons, (o) => o)}
        />
      </Card>
    </PageContainer>
  );
}
