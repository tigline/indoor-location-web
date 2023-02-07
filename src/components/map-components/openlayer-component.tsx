import React from 'react';
import * as zrender from 'zrender';

export function ZrenderComponent() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      const instance = zrender.init(ref.current);
      const group = new zrender.Group();
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
      group.add(circle);
      instance.add(group);
      circle.on('mouseover', (e) => {
        // circle.animateTo({ style: { fill: 'blue' }, shape: { r: 100 } });
        console.log(e);
        circle.setScale([2, 2]);
        // zrender.matrix.create([])
      });
      circle.on('mouseout', (e) => {
        console.log(e);
        // circle.animateTo({ style: { fill: 'red' }, shape: { r: 50 } });
        group.setScale([1, 1]);
      });
    }
  }, []);
  return <div id="map" ref={ref} style={{ width: 600, height: 800, border: '1px solid ' }} />;
}
