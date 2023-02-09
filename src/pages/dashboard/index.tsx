import { PageContainer, StatisticCard } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Card, Col, Row, theme } from 'antd';
import React from 'react';
import { AlarmAnalogyRatioChart } from './components/alarm-analogy-ratio.chart';
import { SystemRunningTimeChart } from './components/system-running-time.chart';

const Welcome: React.FC = () => {
  const {} = theme.useToken();
  const intl = useIntl();
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
            style={{ minHeight: 400 }}
          >
            <StatisticCard
              statistic={{
                title: '未发布',
                value: 5,
                status: 'default',
              }}
            />
            <StatisticCard
              statistic={{
                title: '发布中',
                value: 3,
                status: 'processing',
              }}
            />
            <StatisticCard
              statistic={{
                title: '发布异常',
                value: 2,
                status: 'error',
              }}
            />
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
            {}
          </Card>
        </Col>
        <Col span="12">
          <Card
            bodyStyle={{ minHeight: 400 }}
            title={intl.formatMessage({ id: 'dashboard.map', defaultMessage: '地图' })}
          >
            {}
          </Card>
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
            <AlarmAnalogyRatioChart></AlarmAnalogyRatioChart>
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
            <SystemRunningTimeChart></SystemRunningTimeChart>
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
