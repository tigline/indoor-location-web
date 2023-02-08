import { Pie } from '@antv/g2plot';
import React from 'react';

/**
 * 今日告警类比占比
 *
 * @export
 * @return {*}
 */
export function AlarmAnalogyRatioChart() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const data = [
      { type: '分类一', value: 27 },
      { type: '分类二', value: 25 },
      { type: '分类三', value: 18 },
      { type: '分类四', value: 15 },
      { type: '分类五', value: 10 },
      { type: '其他', value: 5 },
    ];
    const piePlot = new Pie(ref.current!, {
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
    });
    piePlot.render();
  }, []);
  return <div ref={ref} style={{ width: '100%', height: 350 }}></div>;
}
