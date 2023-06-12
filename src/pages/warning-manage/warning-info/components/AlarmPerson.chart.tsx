import { getDeviceFrequency } from '@/utils/common.functions';
import { Bar } from '@antv/g2plot';
import React from 'react';



interface IProps {
  data: Record<string, any>[];
}

export function AlarmPersonChart(props: IProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const barPlot = React.useRef<Bar>();
  const deviceFrequency = getDeviceFrequency(props.data);
  React.useEffect(() => {
    barPlot.current = new Bar(ref.current!, {
      data: deviceFrequency,
      xField: 'frequency',
      yField: 'deviceId',
      seriesField: 'type',
      color: ({ type }) => {
        return getRandomColor();
      },
      legend: false,
      maxBarWidth: 30,
      // meta: {
      //   type: {
      //     alias: '类别',
      //   },
      //   sales: {
      //     alias: '销售额',
      //   },
      // },
    });
    barPlot.current.render();
  }, []);
  React.useEffect(() => {
    barPlot.current?.changeData(deviceFrequency);
  }, [props.data]);
  return <div ref={ref} style={{ height: 600 }}></div>;
}

export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


