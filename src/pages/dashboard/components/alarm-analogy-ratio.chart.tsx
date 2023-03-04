import { Pie, PieOptions } from '@antv/g2plot';
import { useIntl } from '@umijs/max';
import React from 'react';

interface IProps {
  data: API.AlarmInfo[];
}
/**
 * 今日告警类比占比
 *
 * @export
 * @return {*}
 */
export function AlarmAnalogyRatioChart(props: IProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const piePlotRef = React.useRef<Pie>();
  const intl = useIntl();
  React.useEffect(() => {
    const data = [
      {
        type: intl.formatMessage({
          id: 'pages.system.fence-manage.fence.type.in',
          defaultMessage: '进入',
        }),
        value: props.data?.filter((f) => f.type === 'In').length ?? 0,
      },
      {
        type: intl.formatMessage({
          id: 'pages.system.fence-manage.fence.type.out',
          defaultMessage: '离开',
        }),
        value: props.data?.filter((f) => f.type === 'Out').length ?? 0,
      },
    ];

    const config: PieOptions = {
      appendPadding: 10,
      data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,
      label: {
        type: 'outer',
      },
      legend: {
        layout: 'horizontal',
        position: 'top',
      },
      interactions: [{ type: 'element-active' }],
    };
    if (!piePlotRef.current) {
      piePlotRef.current = new Pie(ref.current!, config);
      piePlotRef.current.render();
    } else {
      piePlotRef.current.update(config);
    }
  }, [props.data]);
  return <div ref={ref} style={{ width: '100%', height: 350 }}></div>;
}
