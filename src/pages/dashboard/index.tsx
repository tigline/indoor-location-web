import { getBeaconStatusCounts } from '@/services/swagger/shebeiguanli';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Card, Col, Row, theme } from 'antd';
import React from 'react';
import { AlarmAnalogyRatioChart } from './components/alarm-analogy-ratio.chart';
import { GoodsCountStatistic } from './components/goods-count.statistic';
import { LabelDistributionChart } from './components/label-distribution.chart';
import { RealTimeMap } from './components/real-time.map';
import { SystemRunningTimeChart } from './components/system-running-time.chart';

type keyType = Required<API.BeaconInfo>['type'];
export type LabelDistribution = Record<keyType, { offline: number; online: number; total: number }>;
const Welcome: React.FC = () => {
  const {} = theme.useToken();
  const intl = useIntl();
  const { data } = useRequest(getBeaconStatusCounts, {
    // manual: true,
    formatResult(res) {
      return res.data as LabelDistribution;
    },
    onSuccess(data) {
      console.log('不同标签类型的在线状态', data);
    },
  });
  return (
    <PageContainer>
      <Row gutter={[8, 8]}>
        <Col span="6">
          <Card
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
          {/* <Card
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({ id: 'dashboard.map', defaultMessage: '地图' })}
          >
            {}
          </Card> */}
          <RealTimeMap />
        </Col>
        <Col span="12">
          <Card
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({
              id: 'dashboard.warning.last.24.hours',
              defaultMessage: '24小时告警变化',
            })}
          >
            {}
          </Card>
        </Col>
        <Col span="6">
          <Card
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({
              id: 'dashboard.warning.today',
              defaultMessage: '今日告警',
            })}
          >
            {}
          </Card>
        </Col>
        <Col span="6">
          <Card
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({
              id: "dashboard.Today's.alarm.analogy.ratio",
              defaultMessage: '今日告警类比占比',
            })}
          >
            <AlarmAnalogyRatioChart />
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
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({ id: 'dashboard.label.status', defaultMessage: '标签状态' })}
          >
            {}
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
            {}
          </Card>
        </Col>
        <Col span="6"></Col>
      </Row>
    </PageContainer>
  );
};

export default Welcome;
