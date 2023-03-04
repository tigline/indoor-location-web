import { Area } from '@antv/g2plot';
import dayjs from 'dayjs';
import { chain } from 'lodash';
// import { useRequest } from '@umijs/max';
import React from 'react';

interface IProps {
  data: API.AlarmInfo[];
  loading?: boolean;
}
export function AlarmLast_24HoursChart(props: IProps) {
  // const {} = useRequest();
  const ref = React.useRef<HTMLDivElement>(null);
  const area = React.useRef<Area>();
  React.useEffect(() => {
    const data = chain(props.data ?? [])
      .groupBy((o) => dayjs.unix(o.updateTime!).format('YYYY-MM-DD HH:mm'))
      .mapValues((val) => val.length)
      .map((val, key) => ({ label: key, value: val }))
      .value();
    const config = {
      data,
      xField: 'label',
      yField: 'value',
      xAxis: { range: [0, 1], tickCount: 5 },
      areaStyle: () => {
        return { fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff' };
      },
    };
    if (!area.current) {
      area.current = new Area(ref.current!, config);
      area.current.render();
    } else {
      area.current.update(config);
    }
  }, [props.data]);
  return <div ref={ref} style={{ width: '100%', height: 350 }}></div>;
}
