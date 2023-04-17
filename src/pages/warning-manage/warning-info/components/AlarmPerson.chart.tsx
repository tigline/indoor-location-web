import { Bar } from '@antv/g2plot';
import React from 'react';

interface IProps {
  data: Record<string, any>[];
}

export function AlarmPersonChart(props: IProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const barPlot = React.useRef<Bar>();
  React.useEffect(() => {
    barPlot.current = new Bar(ref.current!, {
      data: props.data,
      xField: 'count',
      yField: 'label',
      seriesField: 'type',
      // color: ({ type }) => {
      //   return type === '美容洗护' ? '#FAAD14' : '#5B8FF9';
      // },
      legend: false,
      meta: {
        type: {
          alias: '类别',
        },
        sales: {
          alias: '销售额',
        },
      },
    });
    barPlot.current.render();
  }, []);
  React.useEffect(() => {
    barPlot.current?.changeData(props.data);
  }, [props.data]);
  return <div ref={ref} style={{ height: 800 }}></div>;
}
