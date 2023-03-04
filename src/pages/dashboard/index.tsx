import { pageAlarm } from '@/services/swagger/gaojingguanli';
import { getBeaconStatusCounts } from '@/services/swagger/shebeiguanli';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Card, Col, Row, theme } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { AlarmAnalogyRatioChart } from './components/alarm-analogy-ratio.chart';
import { AlarmLast_24HoursChart } from './components/alarm-last-24-hours.chart';
import { GatewayCountChart } from './components/gateway-count.chart';
import { GoodsCountStatistic } from './components/goods-count.statistic';
import { LabelCountChart } from './components/label-count.chart';
import { LabelDistributionChart } from './components/label-distribution.chart';
import { RealTimeMap } from './components/real-time.map';
import { SystemRunningTimeChart } from './components/system-running-time.chart';
import { WarningOfTodayTable } from './components/warning-of-today.table';

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
      return res.data?.items ?? [];
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
  return (
    <PageContainer>
      <Row gutter={[8, 8]}>
        <Col span="6">
          <Card
            loading={beaconLoading}
            title={intl.formatMessage({
              id: 'dashboard.location.info',
              defaultMessage: '定位概览',
            })}
            // direction="row"
            bodyStyle={{ minHeight: 400 }}
          >
            <GoodsCountStatistic data={data} />
          </Card>
        </Col>
        <Col span="6">
          <Card
            loading={beaconLoading}
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({
              id: 'dashboard.label-distribution',
              defaultMessage: '在线标签分布',
            })}
          >
            <LabelDistributionChart data={data} />
          </Card>
        </Col>
        <Col span="12">
          <RealTimeMap />
        </Col>
        <Col span="12">
          <Card
            loading={alarmLoading}
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({
              id: 'dashboard.warning.last.24.hours',
              defaultMessage: '24小时告警变化',
            })}
          >
            <AlarmLast_24HoursChart data={alarms ?? []} />
          </Card>
        </Col>
        <Col span="6">
          <Card
            loading={alarmLoading}
            bodyStyle={{ minHeight: 400, paddingTop: 0 }}
            title={intl.formatMessage({
              id: 'dashboard.warning.today',
              defaultMessage: '今日告警',
            })}
          >
            <WarningOfTodayTable data={alarms ?? []} />
          </Card>
        </Col>
        <Col span="6">
          <Card
            loading={alarmLoading}
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({
              id: "dashboard.Today's.alarm.analogy.ratio",
              defaultMessage: '今日告警类比占比',
            })}
          >
            <AlarmAnalogyRatioChart data={alarms ?? []} />
          </Card>
        </Col>
        <Col span="6">
          <Card
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({
              id: 'dashboard.system.running.time',
              defaultMessage: '系统运行时间',
            })}
          >
            <SystemRunningTimeChart />
          </Card>
        </Col>
        <Col span="6">
          <Card
            loading={beaconLoading}
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({ id: 'dashboard.label.status', defaultMessage: '标签状态' })}
          >
            <LabelCountChart data={data} />
          </Card>
        </Col>
        <Col span="6">
          <Card
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({
              id: 'dashboard.base.station.status',
              defaultMessage: '基站状态',
            })}
          >
            <GatewayCountChart />
          </Card>
        </Col>
        <Col span="6"></Col>
      </Row>
    </PageContainer>
  );
};

export default Welcome;
