import { TrackHistoryL7Component } from '@/components/map-components/track-history-L7-component';
import { SelectMapSelect } from '@/components/select-map.select';
import { pageGateway } from '@/services/swagger/shebeiguanli';
import { getMap } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import {
  isNil,
  PageContainer,
  ProCard,
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Card } from 'antd';

/**
 * 历史轨迹页面
 *
 * @export
 * @return {*}
 */
export default function Page() {
  const intl = useIntl();
  const { run, data } = useRequest(getMap, {
    manual: true,
    formatResult: (res) => res,
  });
  const { run: query, data: gateways } = useRequest(pageGateway, {
    manual: true,
    formatResult: (res) => res,
  });

  function submit(values: Required<API.pageGatewayParams>) {
    const { mapId } = values;
    // run({ mapId: mapId }).then((res) => res.code === OK);
    // query({ mapId: mapId });
    return (
      run({ mapId: mapId })
        .then(() => query({ mapId: mapId }))
        // .then(() => queryBeacon(values))
        .then((res) => res.code === OK)
    );
  }
  return (
    <PageContainer>
      <ProCard>
        <ProForm
          // 隐藏重置按钮
          submitter={{ resetButtonProps: { style: { display: 'none' } } }}
          layout="inline"
          style={{ minWidth: 320 }}
          onFinish={(values) => {
            if (!isNil(values.mapId)) {
              return submit(values.mapId);
            }
            return Promise.resolve(false);
          }}
        >
          <SelectMapSelect />
          {/* <SelectMapCascader label={false}></SelectMapCascader> */}
          <ProFormSelect
            placeholder={intl.formatMessage({
              id: 'pages.position-manage.tracking-manage.person-select',
              defaultMessage: '请选择人员',
            })}
          />
          <ProFormDateTimePicker
            placeholder={[
              intl.formatMessage({
                id: 'pages.position-manage.tracking-manage.start.time',
                defaultMessage: '请选择起始时间',
              }),
              // intl.formatMessage({
              //   id: 'pages.position-manage.tracking-manage.end.time',
              //   defaultMessage: '请选择结束时间',
              // }),
            ]}
          />
          <ProFormSelect
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
          />
        </ProForm>
      </ProCard>
      <Card>
        <TrackHistoryL7Component
          map={data?.data?.picture}
          rect={[data?.data?.length, data?.data?.width]}
          // drawEnable
          stations={gateways?.data?.items}
        />
      </Card>
    </PageContainer>
  );
}
