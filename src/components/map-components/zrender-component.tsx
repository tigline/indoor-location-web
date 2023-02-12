import React from 'react';
import * as zrender from 'zrender';
import { Schematic } from './curstomer-component/Schematic';

const svg = `<svg width="1000" height="500" xmlns="http://www.w3.org/2000/svg" version="1.1">
<title>物品-书籍-2</title>

<g>
 <title>Layer 1</title>
 <g id="svg_9">
  <rect id="svg_2" height="253.99999" width="67" y="234.16665" x="25.91835" stroke="#000" fill="#fff"/>
  <line id="svg_6" y2="488.15426" x2="27.47636" y1="235.04697" x1="91.31815" stroke="#000" fill="none"/>
  <line stroke="#000" id="svg_8" y2="486.66664" x2="91.80556" y1="235.41665" x1="26.80556" fill="none"/>
 </g>
 <g id="svg_13">
  <rect id="svg_10" height="253.99999" width="67" y="234.16665" x="114.66835" stroke="#000" fill="#fff"/>
  <line id="svg_11" y2="488.15426" x2="116.22636" y1="235.04697" x1="180.06815" stroke="#000" fill="none"/>
  <line stroke="#000" id="svg_12" y2="486.66664" x2="180.55556" y1="235.41665" x1="115.55556" fill="none"/>
 </g>
 <g id="svg_17">
  <rect id="svg_14" height="253.99999" width="67" y="234.99999" x="204.25168" stroke="#000" fill="#fff"/>
  <line id="svg_15" y2="488.98759" x2="205.80969" y1="235.88031" x1="269.65148" stroke="#000" fill="none"/>
  <line stroke="#000" id="svg_16" y2="487.49998" x2="270.13889" y1="236.24998" x1="205.13889" fill="none"/>
 </g>
 <g id="svg_21">
  <rect id="svg_18" height="253.99999" width="67" y="234.16665" x="299.66835" stroke="#000" fill="#fff"/>
  <line id="svg_19" y2="488.15426" x2="301.22636" y1="235.04697" x1="365.06815" stroke="#000" fill="none"/>
  <line stroke="#000" id="svg_20" y2="486.66664" x2="365.55556" y1="235.41665" x1="300.55556" fill="none"/>
 </g>
 <g id="svg_25">
  <rect id="svg_22" height="253.99999" width="67" y="232.91665" x="396.75166" stroke="#000" fill="#fff"/>
  <line id="svg_23" y2="486.90426" x2="398.30967" y1="233.79697" x1="462.15147" stroke="#000" fill="none"/>
  <line stroke="#000" id="svg_24" y2="485.41664" x2="462.63887" y1="234.16665" x1="397.63888" fill="none"/>
 </g>
 <g id="svg_29">
  <rect id="svg_26" height="253.99999" width="67" y="232.49999" x="492.585" stroke="#000" fill="#fff"/>
  <line id="svg_27" y2="486.48759" x2="494.14302" y1="233.38031" x1="557.98481" stroke="#000" fill="none"/>
  <line stroke="#000" id="svg_28" y2="484.99998" x2="558.47222" y1="233.74998" x1="493.47222" fill="none"/>
 </g>
 <g id="svg_33">
  <rect id="svg_30" height="253.99999" width="67" y="234.16665" x="592.16833" stroke="#000" fill="#fff"/>
  <line id="svg_31" y2="488.15426" x2="593.72634" y1="235.04697" x1="657.56813" stroke="#000" fill="none"/>
  <line stroke="#000" id="svg_32" y2="486.66664" x2="658.05554" y1="235.41665" x1="593.05554" fill="none"/>
 </g>
 <g transform="rotate(89.7852 146.918 92.8333)" id="svg_37">
  <rect id="svg_34" height="253.99999" width="67" y="-34.16667" x="113.41834" stroke="#000" fill="#fff"/>
  <line id="svg_35" y2="219.82094" x2="114.97636" y1="-33.28635" x1="178.81815" stroke="#000" fill="none"/>
  <line stroke="#000" id="svg_36" y2="218.33332" x2="179.30556" y1="-32.91667" x1="114.30556" fill="none"/>
 </g>
 <g transform="rotate(89.092 419.835 89.5)" stroke="null" id="svg_41">
  <rect stroke="#000" id="svg_38" height="253.99999" width="67" y="-37.5" x="386.33499" fill="#fff"/>
  <line stroke="#000" id="svg_39" y2="216.4876" x2="387.893" y1="-36.61968" x1="451.73479" fill="none"/>
  <line stroke="#000" id="svg_40" y2="214.99998" x2="452.2222" y1="-36.25001" x1="387.22221" fill="none"/>
 </g>
 <g transform="rotate(89.092 686.918 85.3333)" stroke="null" id="svg_45">
  <rect stroke="#000" id="svg_42" height="253.99999" width="67" y="-41.66667" x="653.4183" fill="#fff"/>
  <line stroke="#000" id="svg_43" y2="212.32093" x2="654.97631" y1="-40.78635" x1="718.81811" fill="none"/>
  <line stroke="#000" id="svg_44" y2="210.83332" x2="719.30552" y1="-40.41668" x1="654.30552" fill="none"/>
 </g>
</g>
</svg>`;

export function ZrenderComponent() {
  const ref = React.useRef<HTMLDivElement>(null);

  const board = React.useRef<Schematic>();

  React.useEffect(() => {
    if (ref.current) {
      board.current = new Schematic(ref.current);
      const backgroundMap = zrender.parseSVG(svg, {
        ignoreRootClip: true,
        ignoreViewBox: true,
      });
      board.current.instance?.resize({
        width: backgroundMap.width,
        height: backgroundMap.height,
      });
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

      board.current.add(backgroundMap.root);
    }
  }, []);
  return <div id="map" ref={ref} style={{ border: '1px solid ' }} />;
}
