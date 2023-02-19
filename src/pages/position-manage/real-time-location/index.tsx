import { ZrenderComponent } from '@/components/map-components/zrender-component';
import { SelectMapCascader } from '@/components/select-map.cascader';
import { getMap } from '@/services/swagger/xitongguanli';
import { fmt } from '@/utils/global.utils';
import { PageContainer, ProCard, ProForm, Statistic } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
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
  // const intl = useIntl();
  const { run, data } = useRequest(getMap, {
    manual: true,
    formatResult: (res) => res,
  });
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
              style={{ minWidth: 320, height: '100%', alignItems: 'end', justifyContent: 'end' }}
              onValuesChange={(_, val) => {
                console.log(val);
                const [, mapId] = val.mapId;
                run({ mapId });
              }}
            >
              <SelectMapCascader></SelectMapCascader>
            </ProForm>
          </Col>
        </Row>
      </ProCard>
      <Card>
        <ZrenderComponent map={data?.data?.picture} />
      </Card>
    </PageContainer>
  );
}
