import { AntdL7Component } from '@/components/map-components/antd-L7-component';
import { SelectMapSelect } from '@/components/select-map.select';
import { listBeaconLocation, pageGateway } from '@/services/swagger/shebeiguanli';
import { getMap } from '@/services/swagger/xitongguanli';
import { fmtDate, OK } from '@/utils/global.utils';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDateTimeRangePicker,
} from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Card } from 'antd';
import { isNil } from 'lodash';
import { Moment } from 'moment';
import React from 'react';

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
  function submit(mapId: string) {
    run({ mapId: mapId }).then((res) => res.code === OK);
    query({ mapId: mapId });
  }
  return (
    <PageContainer>
      <ProCard>
        <ProForm<API.listBeaconLocationParams>
          // 隐藏重置按钮
          submitter={{ resetButtonProps: { style: { display: 'none' } } }}
          formRef={formRef}
          layout="inline"
          style={{ minWidth: 320 }}
          onFinish={(values) => {
            // console.log(values);
            return queryBeacon(values).then((res) => res.code === OK);
            return Promise.resolve(false);
          }}
          onValuesChange={(values) => {
            if (!isNil(values.mapId)) {
              submit(values.mapId);
            }
          }}
        >
          <SelectMapSelect />
          {/* <SelectMapCascader
            transform={([, mapId]) => ({ mapId })}
            submit={submit}
            form={formRef.current}
            label={false}
          ></SelectMapCascader> */}
          {/* <ProFormSelect
            placeholder={intl.formatMessage({
              id: 'pages.position-manage.tracking-manage.person-select',
              defaultMessage: '请选择人员',
            })}
          /> */}
          <ProFormDateTimeRangePicker
            name="range"
            transform={(value: [Moment?, Moment?]) => {
              const [startTime, endTime] = fmtDate(value) ?? [];
              return {
                startTime,
                endTime,
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
          {/* <ProFormSelect
            placeholder={intl.formatMessage({
              id: 'pages.position-manage.tracking-manage.speed-select',
              defaultMessage: '速率',
            })}
            options={[
              { label: 'x1', value: 1 },
              { label: 'x2', value: 2 },
              { label: 'x4', value: 4 },
              { label: 'x8', value: 8 },
            ]}
          /> */}
        </ProForm>
      </ProCard>
      <Card>
        <AntdL7Component
          map={data?.data?.picture}
          rect={[data?.data?.length, data?.data?.width]}
          // drawEnable
          stations={gateways?.items}
          beacons={beacons?.data}
        />
      </Card>
    </PageContainer>
  );
}
