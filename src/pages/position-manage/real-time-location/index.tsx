import { RealTimeL7Component } from '@/components/map-components/real-time-L7-component';
import { SelectMapSelect } from '@/components/select-map.select';
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
import { FormattedMessage, useIntl, useModel, useRequest, useSearchParams } from '@umijs/max';
import { useInterval } from 'ahooks';
import { Card, Col, Row, Switch, Typography } from 'antd';
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
  const { beacons } = useModel('messageSocket');

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
      <Card style={{marginTop:12}}>
        <RealTimeL7Component
          map={mapInfo?.data?.picture}
          rect={[mapInfo?.data?.length, mapInfo?.data?.width]}
          stations={gateways?.items}
          fences={fences}
          hiddenFence={!fenceEnable}
          warningFenceId={warningFenceId}
          clear={() => setWarningFenceId('')}
          selectedStation={selectedGateway}
          selectedDeviceId={selectedDeviceId}
          locations={chain(beacons)
            .map((o) => o)
            .filter((f) => f.mapId === currentMapId)
            .value()}
        />
      </Card>
    </PageContainer>
  );
}
