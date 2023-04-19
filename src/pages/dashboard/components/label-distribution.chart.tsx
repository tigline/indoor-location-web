import { Pie, PieOptions } from '@antv/g2plot';
import { useIntl } from '@umijs/max';
import { reduce } from 'lodash';
import React from 'react';
import { LabelDistribution } from '..';

interface IProps {
  data?: LabelDistribution;
}
/**
 * 在线标签分布
 *
 * @export
 * @return {*}
 */
export function LabelDistributionChart(props: IProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const piePlotRef = React.useRef<Pie>();
  const intl = useIntl();
  React.useEffect(() => {
    const data = [

      {
        type: intl.formatMessage({
          id: 'pages.dashboard.personnel.count',
          defaultMessage: '人员数量',
        }),
        value: props.data?.Personnel.online,
      },
      {
        type: intl.formatMessage({ 
          id: 'pages.dashboard.stuff.count', 
          defaultMessage: '物品数量' 
        }),
        value: props.data?.Stuff.online,
      },
      {
        type: intl.formatMessage({
          id: 'pages.dashboard.equipment.count',
          defaultMessage: '设备数量',
        }),
        value: props.data?.Equipment.online,
      },
      {
        type: intl.formatMessage({
          id: 'pages.dashboard.vehicle.count',
          defaultMessage: '车辆数量',
        }),
        value: props.data?.Vehicle.online,
      },
      
    ];
    const config: PieOptions = {
      // appendPadding: 10,
      data,
      height: 400 - 48,
      angleField: 'value',
      colorField: 'type',
      radius: 1,
      innerRadius: 0.6,
      legend: {
        position: 'top-left',
      },
      label: {
        type: 'inner',
        offset: '-50%',
        content: '{value}',
        style: {
          textAlign: 'center',
          fontSize: 14,
        },
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
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
          content: reduce(props.data, (prev, next) => prev + (next.online ?? 0), 0) + '',
        },
      },
    };

    if (!piePlotRef.current) {
      piePlotRef.current = new Pie(ref.current!, config);
      piePlotRef.current.render();
    } else {
      piePlotRef.current?.update(config);
    }
    // return () => piePlotRef.current?.destroy();
  }, [props.data]);
  return <div ref={ref} style={{ height: '100%' }}></div>;
}
