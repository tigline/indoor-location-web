import { ImageLayer, Mapbox, Scene } from '@antv/l7';
import { DrawPolygon } from '@antv/l7-draw';
import { Button, Card } from 'antd';
import React from 'react';

export function AntdL7Component() {
  const [polygonDrawer, setPolygonDrawer] = React.useState<DrawPolygon | null>(null);
  const [coord, setCoorde] = React.useState<string>();
  React.useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'blank',
        center: [0, 0],
        pitch: 0,
        zoom: 12,
        maxZoom: 20,
        minZoom: 12,
        // rotation: 19.313180925794313
      }),
    });
    scene.on('loaded', () => {
      const layer = new ImageLayer({});
      layer.source('https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg', {
        parser: {
          type: 'image',
          extent: [0, 0, 10, 10],
        },
      });
      scene.addLayer(layer);

      const drawer = new DrawPolygon(scene, {});
      setPolygonDrawer(drawer);
      drawer.enable();
      drawer.enable();
    });
  }, []);
  return (
    <React.Fragment>
      <Card bodyStyle={{ padding: 0 }}>
        <div id="map" style={{ minHeight: 600 }}></div>
      </Card>
      <Card>
        <div>
          <Button
            onClick={() => {
              setCoorde(JSON.stringify(polygonDrawer?.getData()));
            }}
          >
            获取坐标
          </Button>
          {coord}
        </div>
      </Card>
    </React.Fragment>
  );
}
