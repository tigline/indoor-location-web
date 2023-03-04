import { getGatewayOnlineStatusCount } from '@/services/swagger/shebeiguanli';
import { ProCard } from '@ant-design/pro-components';
import { Pie } from '@antv/g2plot';
import { useIntl, useRequest } from '@umijs/max';
import React from 'react';

const imageCardStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 250,
};
/**
 * 基站数量图表展示
 *
 * @export
 * @param {IProps} props
 */
export function GatewayCountChart() {
  const ref = React.useRef<HTMLDivElement>(null);
  const intl = useIntl();
  const { data, loading } = useRequest(getGatewayOnlineStatusCount, {});
  const piePlot = React.useRef<Pie>();
  function transform() {
    return [
      {
        type: intl.formatMessage({
          id: 'pages.dashboard.online.count',
          defaultMessage: '在线数量',
        }),
        value: data?.online ?? 0,
      },
      {
        type: intl.formatMessage({
          id: 'pages.dashboard.offline.count',
          defaultMessage: '离线数量',
        }),
        value: data?.offline ?? 0,
      },
    ];
  }

  function transConfig(source: { type: string; value: number }[]) {
    return {
      appendPadding: 10,
      data: source,
      angleField: 'value',
      colorField: 'type',
      radius: 1,
      innerRadius: 0.6,
      label: {
        type: 'outer',
      },
      // legend: false,
      interactions: [{ type: 'element-active' }],
      statistic: {
        title: {
          content: intl.formatMessage({ id: 'pages.dashboard.total', defaultMessage: '总数量' }),
        },
        content: {
          style: {
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          content: (data?.total ?? 0) + '',
        },
      },
    };
  }
  React.useEffect(() => {
    if (ref.current) {
      const source = transform();
      piePlot.current = new Pie(ref.current, transConfig(source));
      piePlot.current.render();
    }
  }, [loading]);
  React.useEffect(() => {
    piePlot.current?.update(transConfig(transform()));
  }, [data?.total]);
  return (
    <ProCard split="horizontal" loading={loading}>
      <ProCard bodyStyle={imageCardStyle}>
        <div ref={ref} style={{ width: '100%', height: 220 }}></div>
      </ProCard>
      <ProCard split="vertical">
        <ProCard
          title={intl.formatMessage({
            id: 'pages.dashboard.gateway.count',
            defaultMessage: '基站数量',
          })}
        >
          {data?.total}
        </ProCard>
        <ProCard
          title={intl.formatMessage({
            id: 'pages.dashboard.online.count',
            defaultMessage: '在线数量',
          })}
        >
          {data?.online}
        </ProCard>
        <ProCard
          title={intl.formatMessage({
            id: 'pages.dashboard.offline.count',
            defaultMessage: '离线数量',
          })}
        >
          {data?.offline}
        </ProCard>
      </ProCard>
    </ProCard>
  );
}
