import { Pie } from '@antv/g2plot';
import React from 'react';

interface IProps {
  data: Record<string, any>[];
}

export function AlarmCategoryChart(props: IProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const piePlot = React.useRef<Pie>();
  React.useEffect(() => {
    piePlot.current = new Pie(ref.current!, {
      appendPadding: 10,
      data: props.data,
      angleField: 'count',
      colorField: 'label',
      radius: 1,
      innerRadius: 0.6,
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
        title: false,
        content: {
          style: {
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          // content: ' ',
        },
      },
    });

    piePlot.current.render();
  }, []);
  React.useEffect(() => {
    piePlot.current?.changeData(props.data);
  }, [props.data]);
  return <div ref={ref} style={{ height: 800 }}></div>;
}
