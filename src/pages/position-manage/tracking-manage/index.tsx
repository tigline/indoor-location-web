import { TrackL7Component } from '@/components/map-components/track-L7-component';
import { SelectMapSelect } from '@/components/select-map.select';
import { SelectBeacon } from '@/components/select-personnel-tag.select';
import { listBeaconLocation, pageGateway } from '@/services/swagger/shebeiguanli';
import { getMap } from '@/services/swagger/xitongguanli';
import { fmtDate, OK } from '@/utils/global.utils';
import {
  PageContainer,
  ProCard,
  ProFormDateTimeRangePicker,
  ProFormDigit,
  QueryFilter,
} from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Card } from 'antd';
import dayjs from 'dayjs';
import { Moment } from 'moment';
import React from 'react';
import './index.less';

/**
 * 轨迹追踪页面
 *
 * @export
 * @return {*}
 */
export default function Page() {
  const intl = useIntl();
  const formRef = React.useRef();
  const { run, data } = useRequest(getMap, {
    manual: true,
    formatResult: (res) => res,
  });
  const { run: query, data: gateways } = useRequest(pageGateway, {
    manual: true,
  });
  const { run: queryBeacon, data: beacons } = useRequest(listBeaconLocation, {
    manual: true,
    formatResult: (res) => res,
  });

  function submit(values: API.listBeaconLocationParams) {
    const { mapId } = values;
    return run({ mapId: mapId })
      .then(() => query({ mapId: mapId }))
      .then(() => queryBeacon(values))
      .then((res) => res.code === OK);
  }

  return (
    <PageContainer>
      <ProCard>
        <QueryFilter<API.listBeaconLocationParams>
          // 隐藏重置按钮
          submitter={{ resetButtonProps: { style: { display: 'none' } } }}
          formRef={formRef}
          layout="vertical"
          span={6}
          onFinish={(values) => {
            // console.log(values);
            return submit(values);
          }}
        >
          <SelectMapSelect />
          <SelectBeacon name="deviceId" />
          <ProFormDigit name="filterValue" />
          <ProFormDateTimeRangePicker
            name="range"
            transform={(value: [Moment?, Moment?]) => {
              const [startTime, endTime] = fmtDate(value) ?? [];
              return {
                startTime: startTime ? dayjs(startTime)?.unix() : undefined,
                endTime: endTime ? dayjs(endTime)?.unix() : undefined,
              };
            }}
            placeholder={[
              intl.formatMessage({
                id: 'pages.position-manage.tracking-manage.start.time',
                defaultMessage: '请选择起始时间',
              }),
              intl.formatMessage({
                id: 'pages.position-manage.tracking-manage.end.time',
                defaultMessage: '请选择结束时间',
              }),
            ]}
          />
        </QueryFilter>
      </ProCard>
      <Card>
        <TrackL7Component
          map={data?.data?.picture}
          rect={[data?.data?.length, data?.data?.width]}
          stations={gateways?.items}
          beacons={beacons?.data}
        />
      </Card>
    </PageContainer>
  );
}
