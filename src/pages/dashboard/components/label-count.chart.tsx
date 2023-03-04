import { ProCard } from '@ant-design/pro-components';
import { Pie } from '@antv/g2plot';
import { useIntl } from '@umijs/max';
import { reduce } from 'lodash';
import React from 'react';
import { LabelDistribution } from '..';
interface IProps {
  data?: LabelDistribution;
}
const imageCardStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 250,
};
/**
 * 标签数量图表展示
 *
 * @export
 * @param {IProps} props
 */
export function LabelCountChart(props: IProps) {
  // const { data } = props;
  const data = React.useMemo(() => {
    return {
      total: reduce(props.data, (prev, next) => prev + (next.total ?? 0), 0),
      online: reduce(props.data, (prev, next) => prev + (next.online ?? 0), 0),
      offline: reduce(props.data, (prev, next) => prev + (next.offline ?? 0), 0),
    };
  }, [props.data]);
  const ref = React.useRef<HTMLDivElement>(null);
  const intl = useIntl();

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
    const source = transform();
    piePlot.current = new Pie(ref.current!, transConfig(source));
    piePlot.current.render();
  }, []);
  React.useEffect(() => {
    piePlot.current?.update(transConfig(transform()));
  }, [data?.total]);
  return (
    <ProCard split="horizontal">
      <ProCard bodyStyle={imageCardStyle}>
        <div ref={ref} style={{ width: '100%', height: 220 }}></div>
      </ProCard>
      <ProCard split="vertical">
        <ProCard
          title={intl.formatMessage({
            id: 'pages.dashboard.equipment.count',
            defaultMessage: '物资数量',
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
