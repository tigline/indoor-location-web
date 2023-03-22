import { RealTimeL7Component } from '@/components/map-components/real-time-L7-component';
import { SelectMapSelect } from '@/components/select-map.select';
import { ILocation } from '@/models/messageSocket';
import { pageGateway } from '@/services/swagger/shebeiguanli';
import { getMap, pageFence } from '@/services/swagger/xitongguanli';
import { fmt, OK } from '@/utils/global.utils';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  isNil,
  PageContainer,
  ProCard,
  ProForm,
  ProFormInstance,
  Statistic,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useModel, useRequest } from '@umijs/max';
import { useInterval } from 'ahooks';
import { ReadyState } from 'ahooks/lib/useWebSocket';
import { Card, Col, Row, Switch, Typography } from 'antd';
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
  const [fenceEnable, setFenceDisable] = React.useState<boolean>(true);
  const [warningFenceId, setWarningFenceId] = React.useState<string>();
  const { run: queryFences, data: fences } = useRequest(pageFence, {
    manual: true,
    formatResult(res) {
      return res.data?.items ?? [];
    },
  });

  const { run, data: mapInfo } = useRequest(getMap, {
    manual: true,
    formatResult: (res) => res,
    onSuccess(res: API.RestValueMapInfo) {
      if (res.code === OK) {
        if (res.data?.mapId) {
          queryFences({ mapId: res.data?.mapId, current: '1', size: '15' });
        }
      }
      setBeacons({});
    },
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
      } else if (res.type === 'Alarm') {
        setWarningFenceId((res.data as API.AlarmInfo).fenceId);
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
        <ProForm<{ mapId: string[] }>
          submitter={false}
          layout="horizontal"
          formRef={formRef}
          onValuesChange={(values) => {
            if (!isNil(values.mapId)) {
              submit(values.mapId);
            }
          }}
          style={{ alignItems: 'end' }}
        >
          <Row>
            <Col span="12">
              <StatisticOfNow />
            </Col>
            <Col span="4" style={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
              <FormattedMessage
                id="pages.position-manage.real-time-location.fence-switch"
                defaultMessage="围栏开关"
              />
              <Switch
                style={{ marginLeft: 10 }}
                checked={fenceEnable}
                onChange={(e) => setFenceDisable(e)}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Col>
            <Col span="8" style={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
              <SelectMapSelect formItemProps={{ style: { marginBottom: 0 } }}></SelectMapSelect>
            </Col>
          </Row>
        </ProForm>
      </ProCard>
      <Card>
        <RealTimeL7Component
          map={mapInfo?.data?.picture}
          rect={[mapInfo?.data?.length, mapInfo?.data?.width]}
          stations={gateways?.items}
          fences={fences}
          hiddenFence={!fenceEnable}
          warningFenceId={warningFenceId}
          clear={() => setWarningFenceId('')}
          locations={
            map(beacons, (o) => o)
            // .filter((f) => f.mapId === mapInfo?.data?.mapId)
          }
        />
      </Card>
    </PageContainer>
  );
}
