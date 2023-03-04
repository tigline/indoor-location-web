import { Area } from '@antv/g2plot';
// import { useRequest } from '@umijs/max';
import React from 'react';

export function AlarmLast_24HoursChart() {
  // const {} = useRequest();
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
      .then((res) => res.json())
      .then((data) => {
        const area = new Area(ref.current!, {
          data,
          xField: 'Date',
          yField: 'scales',
          xAxis: {
            range: [0, 1],
            tickCount: 5,
          },
          areaStyle: () => {
            return {
              fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
            };
          },
        });
        area.render();
      });
  }, []);
  return <div ref={ref} style={{ width: '100%', height: 350 }}></div>;
}
