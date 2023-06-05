import { pageAlarm } from '@/services/swagger/gaojingguanli';
import { getBeaconStatusCounts } from '@/services/swagger/shebeiguanli';
import { ActionType, GridContent, PageContainer } from '@ant-design/pro-components';
import { useIntl, useModel, useRequest } from '@umijs/max';
import { Card, Col, Row, theme } from 'antd';
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import { AlarmAnalogyRatioChart } from './components/alarm-analogy-ratio.chart';
import { AlarmLast_24HoursChart } from './components/alarm-last-24-hours.chart';
import { GatewayCountChart } from './components/gateway-count.chart';
import { GoodsCountStatistic } from './components/goods-count.statistic';
import { LabelCountChart } from './components/label-count.chart';
import { LabelDistributionChart } from './components/label-distribution.chart';
import { RealTimeMap } from './components/real-time.map';
import { SystemRunningTimeChart } from './components/system-running-time.chart';
import { WarningOfTodayTable } from './components/warning-of-today.table';
import './index.less';

type keyType = Required<API.BeaconInfo>['type'];
export type LabelDistribution = Record<keyType, { offline: number; online: number; total: number }>;
const Welcome: React.FC = () => {
  const {} = theme.useToken();
  const intl = useIntl();
  const { data, loading: beaconLoading } = useRequest(getBeaconStatusCounts, {
    // manual: true,
    formatResult(res) {
      return res.data as LabelDistribution;
    },
    onSuccess(data) {
      console.log('不同标签类型的在线状态', data);
    },
  });
  const {
    run: queryAlarm,
    data: alarms,
    loading: alarmLoading,
  } = useRequest(pageAlarm, {
    manual: true,
    formatResult(res) {
      // const datasource = res.data?.items ?? [];
      return res.data?.items?.reverse() ?? [];
    },
  });
  React.useEffect(() => {
    queryAlarm({
      current: '1',
      size: '10000',
      startTime: dayjs().add(-1, 'day').unix(),
      endTime: dayjs().unix(),
    });
  }, []);


  // const actionRef = useRef<ActionType>();
  // const { data } = useModel('messageSocket');
  // React.useEffect(() => {
  //   const res = JSON.parse(data) as ILocation;
  //   if (res.type === 'Alarm') {
  //     actionRef.current?.reload();
  //   }
  // }, [data]);

  return (
    <PageContainer className="dashboard" childrenContentStyle={{padding:20}}>
      {/* <GridContent> */}
      <Row gutter={[16, 16]}>

        <Col span="24">
          <RealTimeMap />
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Card
            loading={beaconLoading}
            title={intl.formatMessage({
              id: 'menu.dashboard.location.info',
              defaultMessage: '定位概览',
            })}
            // direction="row"
            bodyStyle={{ minHeight: 400 }}
          >
            <GoodsCountStatistic data={data} />
          </Card>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Card
            loading={beaconLoading}
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({
              id: 'menu.dashboard.label-distribution',
              defaultMessage: '在线标签分布',
            })}
          >
            <LabelDistributionChart data={data} />
          </Card>
        </Col>
        
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Card
            loading={alarmLoading}
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({
              id: 'menu.dashboard.warning.last.24.hours',
              defaultMessage: '24小时告警变化',
            })}
          >
            <AlarmLast_24HoursChart data={alarms ?? []} />
          </Card>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Card
            loading={alarmLoading}
            bodyStyle={{ minHeight: 400, paddingTop: 0 }}
            title={intl.formatMessage({
              id: 'menu.dashboard.warning.today',
              defaultMessage: '今日告警',
            })}
          >
            <WarningOfTodayTable data={alarms ?? []} />
          </Card>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Card
            loading={alarmLoading}
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({
              id: "menu.dashboard.Today's.alarm.analogy.ratio",
              defaultMessage: '今日告警类比占比',
            })}
          >
            <AlarmAnalogyRatioChart data={alarms ?? []} />
          </Card>
        </Col>
        
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Card
            loading={beaconLoading}
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({ id: 'menu.dashboard.label.status', defaultMessage: '标签状态' })}
          >
            <LabelCountChart data={data} />
          </Card>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Card
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({
              id: 'menu.dashboard.base.station.status',
              defaultMessage: '基站状态',
            })}
          >
            <GatewayCountChart />
          </Card>
        </Col>
        {/* <Col span="6"></Col> */}
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Card
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({
              id: 'menu.dashboard.system.running.time',
              defaultMessage: '系统运行时间',
            })}
          >
          <SystemRunningTimeChart />
          </Card>
        </Col>
      </Row>
      {/* </GridContent> */}
    </PageContainer>
  );
};

export default Welcome;
