import { ZrenderComponent } from '@/components/map-components/zrender-component';
import { fmt } from '@/utils/global.utils';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormSelect,
  Statistic,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useInterval } from 'ahooks';
import { Card, Col, Row, Typography } from 'antd';
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
  const intl = useIntl();
  return (
    <PageContainer>
      <ProCard>
        <Row>
          <Col span="12">
            <StatisticOfNow />
          </Col>
          <Col span="12">
            <ProForm
              submitter={false}
              layout="inline"
              style={{ minWidth: 320, height: '100%', alignItems: 'end', justifyContent: 'end' }}
            >
              <ProFormSelect
                placeholder={intl.formatMessage({
                  id: 'pages.position-manage.real-time-location.map-select',
                  defaultMessage: '请选择地图',
                })}
              />
              <ProFormSelect
                placeholder={intl.formatMessage({
                  id: 'pages.position-manage.real-time-location.floor-select',
                  defaultMessage: '请选择楼层',
                })}
              />
            </ProForm>
          </Col>
        </Row>
      </ProCard>
      <Card>
        <ZrenderComponent />
      </Card>
    </PageContainer>
  );
}
