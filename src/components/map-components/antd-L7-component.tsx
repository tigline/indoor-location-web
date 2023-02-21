import stationImage from '@/assets/images/station.svg';
import { ILayer, ImageLayer, Mapbox, metersToLngLat, PointLayer, Scene } from '@antv/l7';
import { DrawPolygon } from '@antv/l7-draw';
import { Button, Card } from 'antd';
import { isEmpty } from 'lodash';
import React from 'react';
interface IProps {
  map?: string;
  rect: [number?, number?];
  drawEnable?: boolean;
  stations?: API.GatewayInfo[];
}

export function AntdL7Component(props: IProps) {
  const [mapWidth, mapLength] = props.rect;
  const [polygonDrawer, setPolygonDrawer] = React.useState<DrawPolygon | null>(null);
  const [coord, setCoorde] = React.useState<string>();
  const [loaded, setLoaded] = React.useState<boolean>();
  const scene = React.useRef<Scene>();
  const drawer = React.useRef<DrawPolygon>();
  const imageLayer = React.useRef<ImageLayer>();
  const stationLayer = React.useRef<ILayer>();
  React.useEffect(() => {
    scene.current = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'blank',
        center: [0, 0],
        pitch: 0,
        zoom: 20,
        // maxZoom: 20,
        // minZoom: 12,
        // rotation: 19.313180925794313
      }),
    });
    scene.current.addImage('stationIcon', stationImage);
    scene.current?.on('loaded', () => setLoaded(true));
  }, []);
  React.useEffect(() => {
    if (props.map && loaded && mapWidth && mapLength) {
      if (imageLayer.current) {
        scene.current?.removeLayer(imageLayer.current);
      }
      imageLayer.current = new ImageLayer({
        zIndex: -1,
      });
      // layer.source('https://www.arapahoe.edu/sites/default/files/about-acc/acc-annex-2nd-floor.jpg', {
      // layer.source('https://img-blog.csdnimg.cn/20200616175116543.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTM4MjAxMjE=,size_16,color_FFFFFF,t_70', {
      const maxRange = metersToLngLat([mapWidth, mapLength]);
      imageLayer.current.source(props.map!, {
        parser: { type: 'image', extent: [0, 0, ...maxRange] },
      });
      scene.current?.setCenter([maxRange[0] / 2, maxRange[1] / 2]);
      scene.current?.addLayer(imageLayer.current);
    }
  }, [props.map, loaded]);
  React.useEffect(() => {
    if (scene.current && loaded) {
      drawer.current = new DrawPolygon(scene.current, {
        distanceOptions: {},
        areaOptions: {},
        liveUpdate: true,
      });
      setPolygonDrawer(drawer.current);
    }
  }, [loaded]);
  React.useEffect(() => {
    if (props.drawEnable && drawer.current) {
      drawer.current?.enable();
    } else {
      drawer.current?.disable();
    }
  }, [props.drawEnable, drawer.current]);

  React.useEffect(() => {
    if (isEmpty(props.stations)) {
      return;
    }
    if (stationLayer.current) {
      scene.current?.removeLayer(stationLayer.current);
    }
    const source = props.stations?.map((item) => {
      const [lng, lat] = metersToLngLat([item.setX!, item.setY!]);
      return { ...item, lng, lat };
    });
    stationLayer.current = new PointLayer({ zIndex: 1 })
      .source(source, {
        parser: { type: 'json', x: 'lng', y: 'lat', name: 'name' },
      })
      .shape('name', ['stationIcon'])
      .size(10);
    scene.current?.addLayer(stationLayer.current);
  }, [props.stations, loaded]);

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
