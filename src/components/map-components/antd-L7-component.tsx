import arrow from '@/assets/images/arrow.svg';
import person from '@/assets/images/person.svg';
import stationImage from '@/assets/images/station.svg';
import { gold, green } from '@ant-design/colors';
import {
  ILayer,
  ImageLayer,
  LineLayer,
  Mapbox,
  metersToLngLat,
  PointLayer,
  PolygonLayer,
  Scene,
} from '@antv/l7';
import { DrawPolygon } from '@antv/l7-draw';
import { Card } from 'antd';
import { isEmpty } from 'lodash';
import React from 'react';
interface IProps {
  map?: string;
  rect: [number?, number?];
  drawEnable?: boolean;
  drawRef?: React.MutableRefObject<DrawPolygon | undefined>;
  stations?: API.GatewayInfo[];
  locations?: API.AoaDataInfo[];
  beacons?: API.AoaDataInfo[];
  fence?: API.FenceAndMapInfo;
}

export function AntdL7Component(props: IProps) {
  const [mapWidth, mapLength] = props.rect;
  // const [polygonDrawer, setPolygonDrawer] = React.useState<DrawPolygon | null>(null);
  // const [coord, setCoorde] = React.useState<string>();
  const [loaded, setLoaded] = React.useState<boolean>();
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const scene = React.useRef<Scene>();

  /** @type {*} 绘制围栏 图层 */
  const drawer = React.useRef<DrawPolygon>();

  /** @type {*} 地图图片 图层 */
  const imageLayer = React.useRef<ImageLayer>();
  /** @type {*} 基站图层 */
  const stationLayer = React.useRef<ILayer>();
  /** @type {*} 轨迹 ‘线’ 图层 */
  const beaconLayer = React.useRef<ILayer>();
  /** @type {*} 轨迹 ‘点’ 图层 */
  const beaconPointLayer = React.useRef<ILayer>();
  /** @type {*} 实时位置 ‘点’图层 */
  const locationLayer = React.useRef<ILayer>();
  /** @type {*} 展示围栏 ‘面’ 图层 */
  const fenceLayer = React.useRef<ILayer>();

  React.useEffect(() => {
    scene.current = new Scene({
      id: mapContainer.current!,
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
    scene.current.addImage('arrow', arrow);
    scene.current.addImage('personImage', person);
    scene.current?.on('loaded', () => setLoaded(true));
  }, []);
  React.useEffect(() => {
    if (props.map && loaded && mapWidth && mapLength) {
      if (imageLayer.current) {
        scene.current?.removeLayer(imageLayer.current);
        imageLayer.current.destroy();
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
      if (props.drawRef) {
        props.drawRef.current = drawer.current;
      }
    }
  }, [loaded]);
  React.useEffect(() => {
    if (props.drawEnable && drawer.current) {
      drawer.current?.enable();
    } else {
      drawer.current?.disable();
    }
  }, [props.drawEnable, drawer.current]);

  // 处理基站展示内容
  React.useEffect(() => {
    if (isEmpty(props.stations)) {
      return;
    }
    if (stationLayer.current) {
      scene.current?.removeLayer(stationLayer.current);
      stationLayer.current.destroy();
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

  // 处理标签展示内容
  React.useEffect(() => {
    if (isEmpty(props.beacons)) {
      return;
    }
    if (beaconLayer.current) {
      scene.current?.removeLayer(beaconLayer.current);
      beaconLayer.current?.destroy();
    }
    if (beaconPointLayer.current) {
      scene.current?.removeLayer(beaconPointLayer.current);
      beaconPointLayer.current.destroy();
    }
    const beacons = props.beacons ?? [];

    beaconPointLayer.current = new PointLayer({ zIndex: 3 })
      .source(
        beacons?.map((item) => {
          const [lng, lat] = metersToLngLat([item.posX!, item.posY!]);
          return { ...item, lng, lat };
        }),
        {
          parser: { type: 'json', x: 'lng', y: 'lat', name: 'name' },
        },
      )
      .shape('circle')
      .color(green[3])
      .size(5);

    const source = [];
    for (let index = 0; index < beacons.length; index++) {
      const start = beacons[index];
      const end = beacons[index + 1];
      if (end) {
        const [lng, lat] = metersToLngLat([start.posX!, start.posY!]);
        const [lng1, lat1] = metersToLngLat([end.posX!, end.posY!]);
        source.push({ ...start, lng, lat, lng1, lat1 });
      }
    }
    beaconLayer.current = new LineLayer({ zIndex: 2 })
      .source(source, {
        parser: { type: 'json', x: 'lng', y: 'lat', x1: 'lng1', y1: 'lat1' },
      })
      .shape('line')
      .size(2)
      // .texture('arrow')
      .color(green[3])
      .animate({
        interval: 0.4, // 间隔
        duration: 1, // 持续时间，延时
        trailLength: 0.8, // 流线长度
      })
      .style({
        lineTexture: true, // 开启线的贴图功能
        iconStep: 20, // 设置贴图纹理的间距
        // arrow: {
        //   enable: true,
        //   arrowWidth: 2,
        //   arrowHeight: 1,
        //   tailWidth: 1,
        // },
      });
    scene.current?.addLayer(beaconLayer.current);
    scene.current?.addLayer(beaconPointLayer.current);
  }, [props.beacons, loaded]);

  // 处理围栏展示内容
  React.useEffect(() => {
    if (!props.fence || isEmpty(props.fence?.points) || !loaded) {
      return;
    }
    if (fenceLayer.current) {
      scene.current?.removeLayer(fenceLayer.current);
      fenceLayer.current?.destroy();
    }
    const fences = props.fence.points ?? [];
    const source = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [fences.map((item) => metersToLngLat([item.x, item.y]))],
          },
        },
      ],
    };

    fenceLayer.current = new PolygonLayer({ zIndex: 4 })
      .source(source)
      .shape('fill')
      .color(props.fence.type === 'In' ? green[4] : gold[4])
      .style({ opacity: 0.6 });
    scene.current?.addLayer(fenceLayer.current);
  }, [props.fence, loaded]);

  React.useEffect(() => {
    if (isEmpty(props.locations) || !loaded) {
      return;
    }
    const source = props.locations?.map((item) => {
      const [lng, lat] = metersToLngLat([item.posX!, item.posY!]);
      return { ...item, lng, lat };
    });
    if (!locationLayer.current) {
      // scene.current?.removeLayer(locationLayer.current);
      // locationLayer.current?.destroy();
      locationLayer.current = new PointLayer({ zIndex: 3, layerType: 'fillImage' })
        .source(source, {
          parser: { type: 'json', x: 'lng', y: 'lat', name: 'personImage' },
        })
        .color(green[3])
        .size(15)
        .shape('personImage', ['personImage'])
        .animate(true);
      scene.current?.addLayer(locationLayer.current);
    } else {
      locationLayer.current.setData(source);
      // locationLayer.current.setSource(source ?? []);
    }
    return () => locationLayer.current?.destroy();
  }, [props.locations, loaded]);

  return (
    <React.Fragment>
      <Card bodyStyle={{ padding: 0 }}>
        <div id="map" ref={mapContainer} style={{ minHeight: 600 }}></div>
      </Card>
    </React.Fragment>
  );
}
