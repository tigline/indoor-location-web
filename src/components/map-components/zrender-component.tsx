import React from 'react';
import * as zrender from 'zrender';
import { Schematic } from './curstomer-component/Schematic';

const svg = `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="50" height="50" x="0" y="0" fill="red" />
</svg>`;

export function ZrenderComponent() {
  const ref = React.useRef<HTMLDivElement>(null);

  const board = React.useRef<Schematic>();

  React.useEffect(() => {
    if (ref.current) {
      board.current = new Schematic(ref.current);
      // const circle = new zrender.Circle({
      //   // silent: false,
      //   shape: {
      //     cx: 100,
      //     cy: 100,
      //     r: 50,
      //   },
      //   zlevel: 1,
      //   style: {
      //     fill: 'red',
      //   },
      // });
      // const [x, y] = board.current.transformBack([10, 10]);
      // const rect = new zrender.Rect({
      //   shape: { x, y, width: 100, height: 100 },
      //   style: { fill: 'blue' },
      // });
      // board.current.add(circle);
      // board.current.add(rect);
      board.current.setTrack([
        [10, 10],
        [20, 20],
        [30, 30],
      ]);
      board.current.add(
        zrender.parseSVG(svg, {
          ignoreRootClip: true,
          ignoreViewBox: true,
        }).root,
      );
    }
  }, []);
  return <div id="map" ref={ref} style={{ width: 600, height: 800, border: '1px solid ' }} />;
}
