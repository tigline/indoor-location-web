import background from '@/assets/images/background.png';
import { PageContainer } from '@ant-design/pro-components';
import Draw from 'ol/interaction/Draw';
import ImageLayer from 'ol/layer/Image';
import LayerVector from 'ol/layer/Vector';
import Map from 'ol/Map';
import Static from 'ol/source/ImageStatic';
import SourceVector from 'ol/source/Vector';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import View from 'ol/View';
import React from 'react';

export default function Page() {
  React.useEffect(() => {
    const projection = 'EPSG:4326';
    const extent = [-10, -12, 10, 12];

    let lineLayer = new LayerVector({
      source: new SourceVector(),
      style: new Style({
        stroke: new Stroke({
          color: 'red',
          // size: 1,
        }),
      }),
    });
    const map = new Map({
      target: 'map',
      layers: [
        new ImageLayer({
          source: new Static({
            attributions: '© <a href="https://xkcd.com/license.html">xkcd</a>',
            url: background,
            projection: projection,
            imageExtent: extent,
          }),
        }),
        // new TileLayer({
        //   source: new XYZ({
        //     url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        //   }),
        // }),
        lineLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 10,
      }),
    });
    map.addInteraction(
      new Draw({
        source: lineLayer.getSource()!,
        type: 'Polygon',
      }),
    );
  }, []);
  return (
    <PageContainer>
      <div
        id="map"
        style={{
          width: '100%',
          height: 800,
        }}
      ></div>
    </PageContainer>
  );
}
