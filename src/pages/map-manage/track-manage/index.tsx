import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import * as zrender from 'zrender';

export default function Page() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      const instance = zrender.init(ref.current);
      const circle = new zrender.Circle({
        // silent: false,
        shape: {
          cx: 100,
          cy: 100,
          r: 50,
        },
        zlevel: 1,
        style: {
          fill: 'red',
        },
      });
      instance.add(circle);
      circle.on('mouseover', () => {
        circle.animateTo({ style: { fill: 'blue' }, shape: { r: 100 } });

      });
      circle.on('mouseout', () => {
        circle.animateTo({ style: { fill: 'red' }, shape: { r: 50 } });
      });
    }
  }, []);
  return (
    <PageContainer>
      <div id="map" ref={ref} style={{ width: 600, height: 800, border: '1px solid ' }} />
    </PageContainer>
  );
}
