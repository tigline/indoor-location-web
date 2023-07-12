import { RealTimeL7Component } from '@/components/map-components/real-time-L7-component';
import { SelectMapSelect } from '@/components/select-map.select';
import { pageBeacon, pageGateway, pageMapBeacon } from '@/services/swagger/shebeiguanli';
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
import { PointLayer } from '@antv/l7';
import { FormattedMessage, useIntl, useModel, useRequest, useSearchParams } from '@umijs/max';
import { useInterval } from 'ahooks';
import { Card, Col, Row, Switch, Typography,Spin } from 'antd';
import { chain } from 'lodash';
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
  // const param = useParams();
  const [param] = useSearchParams();
  const selectedGateway = param.get('gateway');
  const selectedDeviceId = param.get('deviceId');
  const selectedMapId = param.get('mapId');
  const formRef = React.useRef<ProFormInstance<{ mapId: string[] }>>(null);

  const [currentMapId, setCurrentMapId] = React.useState<string>();
  const [fenceEnable, setFenceDisable] = React.useState<boolean>(true);
  const [warningFenceId, setWarningFenceId] = React.useState<string>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [beacons, setBeacons] = React.useState<API.BeaconInfo[]>([]); 

  // 在组件外部定义类型

  

  React.useEffect(() => {
    let current = 1;
    const size = 50;
  
    const fetchBeacons = async () => {
      while (true) {
        const response = await pageBeacon({ current: current.toString(), size: size.toString() });
        if (response.code === 200 && response.data?.items) {
          const items = response.data.items;
          if (Array.isArray(items)) {
            setBeacons(oldBeacons => [...oldBeacons, ...items]);
          }
          if (response.data.total && response.data.total <= current * size) {
            break;
          }
          current += 1;
        } else {
          // handle error
          break;
        }
      }
      setLoading(false);
    };
  
    fetchBeacons();
  }, []);



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
    },
  });
  const { run: query, data: gateways } = useRequest(pageGateway, {
    manual: true,
  });
  const { beaconLocations } = useModel('messageSocket');

  function submit(mapId: string) {
    query({ mapId: mapId });
    setCurrentMapId(mapId);
    return run({ mapId });
  }
  React.useEffect(() => {
    const mapId = formRef.current?.getFieldValue(['mapId']) ?? selectedMapId;
    if (mapId) {
      submit(mapId);
    }
  }, []);
  return (
    <PageContainer childrenContentStyle={{padding:20}}>
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
              <SelectMapSelect
                initialValue={selectedMapId}
                formItemProps={{ style: { marginBottom: 0 } }}
              ></SelectMapSelect>
            </Col>
          </Row>
        </ProForm>
      </ProCard>
      <Card style={{marginTop:12, position: 'relative'}}>
      {loading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.3)',
          zIndex: 1,
        }}>
          <Spin />
        </div>
        )}
        <div style={{ zIndex: 0 }}>
          <RealTimeL7Component
          map={mapInfo?.data?.picture}
          coordinateType={mapInfo?.data?.coordinateType}
          rect={[mapInfo?.data?.length, mapInfo?.data?.width]}
          stations={gateways?.items}
          fences={fences}
          hiddenFence={!fenceEnable}
          warningFenceId={warningFenceId}
          clear={() => setWarningFenceId('')}
          selectedStation={selectedGateway}
          selectedDeviceId={selectedDeviceId}
          locations={chain(beaconLocations)
            .map((o) => o)
            .filter((f) => f.mapId === currentMapId)
            .value()}
        />
      </div>
      </Card>
    </PageContainer>
  );
}
