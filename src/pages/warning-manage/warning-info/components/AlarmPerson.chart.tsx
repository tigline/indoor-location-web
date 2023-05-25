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
    barPlot.current?.changeData(deviceFrequency);
  }, [props.data]);
  return <div ref={ref} style={{ height: 600 }}></div>;
}


export function getDeviceFrequency(alarmInfos: API.AlarmInfo[]): API.DeviceFrequency[] {
  const deviceFrequency: Record<string, number> = {};

  alarmInfos.forEach(info => {
    if (info.deviceId != undefined) {
      if (info.deviceId in deviceFrequency) {
        deviceFrequency[info.deviceId]++;
      } else {
        deviceFrequency[info.deviceId] = 1;
      }
    }
  });

  const sortedDeviceFrequency: API.DeviceFrequency[] = Object.entries(deviceFrequency)
    .map(([deviceId, frequency]) => ({ deviceId, frequency: Number(frequency) }))
    .sort((a, b) => b.frequency - a.frequency);

  return sortedDeviceFrequency;
}