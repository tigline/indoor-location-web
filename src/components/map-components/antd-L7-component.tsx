import arrow from '@/assets/images/arrow.svg';
import person from '@/assets/images/person.svg';
import stationImage from '@/assets/images/station.svg';
import warning from '@/assets/images/warning.svg';
import { gold, green } from '@ant-design/colors';
import {
  ILayer,
  ImageLayer,
  LineLayer,
  lngLatToMeters,
  Mapbox,
  metersToLngLat,
  Point,
  PointLayer,
  PolygonLayer,
  Scene,
} from '@antv/l7';
import { DrawEvent, DrawPolygon } from '@antv/l7-draw';
import { Card } from 'antd';
import { isEmpty } from 'lodash';
import React from 'react';

const scale = 10;

/**
 * 厘米转经纬度，这里是虚构的CM，对应的是M
 * @export
 * @param {Point} m
 * @param {number} [width=0]
 * @return {*}
 */
export function convertCMtoL(m: Point, width: number = 0) {
  // FIXME: 需要处理 假的 cm 数据
  const [x, prevY] = m;
  const y = width - prevY;
  return metersToLngLat([x * scale, y * scale]);
}
export function convertLtoCM(l: Point, width: number = 0) {
  const [x, y] = lngLatToMeters(l);
  return [x / scale, width - y / scale];
}

interface IProps {
  map?: string;
  width?: number;
  height?: number;
  rect: [number?, number?];
  drawEnable?: boolean;
  drawRef?: React.MutableRefObject<DrawPolygon | undefined>;
  /**
   * 基站内容
   *
   * @type {API.GatewayInfo[]}
   * @memberof IProps
   */
  stations?: API.GatewayInfo[];
  /**
   * 单个标签内容
   *
   * @type {API.AoaDataInfo[]}
   * @memberof IProps
   */
  locations?: API.AoaDataInfo[];
  /**
   * 轨迹内容
   *
   * @type {API.AoaDataInfo[]}
   * @memberof IProps
   */
  beacons?: API.AoaDataInfo[];
  /**
   * 围栏内容
   *
   * @type {API.FenceAndMapInfo}
   * @memberof IProps
   */
  fence?: API.FenceAndMapInfo;

  alarms?: API.AlarmInfo[];
}

export function AntdL7Component(props: IProps) {
  const [mapLength, mapWidth] = props.rect;
  // const [polygonDrawer, setPolygonDrawer] = React.useState<DrawPolygon | null>(null);
  // const [coord, setCoorde] = React.useState<string>();
  const [loaded, setLoaded] = React.useState<boolean>();
  const [drawerInited, setDrawerInited] = React.useState<boolean>(false);
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
  /** @type {*} 告警位置 ‘点’图层*/
  const alarmLayer = React.useRef<ILayer>();
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
        minZoom: 18,
        // rotation: 19.313180925794313
      }),
    });
    scene.current.addImage('stationIcon', stationImage);
    scene.current.addImage('arrow', arrow);
    scene.current.addImage('personImage', person);
    scene.current.addImage('warning', warning);
    scene.current?.on('loaded', () => setLoaded(true));
  }, []);
  React.useEffect(() => {
    if (props.map && loaded && mapWidth && mapLength) {
      if (imageLayer.current) {
        imageLayer.current.setData(props.map!);
        imageLayer.current.setIndex(0);
      } else {
        imageLayer.current = new ImageLayer({ zIndex: 0 });
        // layer.source('https://www.arapahoe.edu/sites/default/files/about-acc/acc-annex-2nd-floor.jpg', {
        // layer.source('https://img-blog.csdnimg.cn/20200616175116543.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTM4MjAxMjE=,size_16,color_FFFFFF,t_70', {
        const maxRange = metersToLngLat([mapLength * scale, mapWidth * scale]);
        imageLayer.current.source(props.map!, {
          parser: { type: 'image', extent: [0, 0, ...maxRange] },
        });
        scene.current?.setCenter([maxRange[0] / 2, maxRange[1] / 2]);
        scene.current?.addLayer(imageLayer.current);
      }
    }
  }, [props.map, loaded, mapWidth, mapLength]);
  React.useEffect(() => {
    if (scene.current && loaded && mapWidth) {
      drawer.current = new DrawPolygon(scene.current, {
        distanceOptions: {
          showTotalDistance: false,
          showDashDistance: true,
          format: (meters: number) => {
            if (meters >= 1000) {
              return +(meters / scale / 1000).toFixed(2) + 'km';
            } else {
              return +(meters / scale).toFixed(2) + 'm';
            }
          },
        },
        // areaOptions: {},
        liveUpdate: true,
      });

      drawer.current.on(DrawEvent.Init, () => {
        setDrawerInited(true);
      });
      if (props.drawEnable) {
        // 初始化时判断下是否开启绘图
        drawer.current?.enable();
      }
      if (props.drawRef) {
        props.drawRef.current = drawer.current;
      }
    }
  }, [loaded, mapWidth]);
  React.useEffect(() => {
    if (props.drawEnable && drawerInited && drawer.current) {
      drawer.current?.enable();
    } else {
      drawer.current?.disable();
    }
  }, [props.drawEnable, drawerInited]);

  // 处理基站展示内容
  React.useEffect(() => {
    if (loaded && mapWidth && !isEmpty(props.stations)) {
      const source = (props.stations ?? [])?.map((item) => {
        const [lng, lat] = convertCMtoL([item.setX!, item.setY!], mapWidth);
        return { ...item, lng, lat };
      });
      if (stationLayer.current) {
        // scene.current?.removeLayer(stationLayer.current);
        // stationLayer.current.destroy();
        stationLayer.current.setData(source);
        stationLayer.current.setIndex(3);
      } else {
        stationLayer.current = new PointLayer({ zIndex: 3 })
          .source(source, {
            parser: { type: 'json', x: 'lng', y: 'lat', name: 'name' },
          })
          .shape('name', ['stationIcon'])
          .size(10);
        scene.current?.addLayer(stationLayer.current);
      }
    }
  }, [props.stations, loaded, mapWidth]);

  // 处理标签展示内容
  React.useEffect(() => {
    if (loaded && mapWidth) {
      const beacons = props.beacons ?? [];
      const beaconSource = beacons?.map((item) => {
        const [lng, lat] = convertCMtoL([item.posX!, item.posY!], mapWidth);
        return { ...item, lng, lat };
      });
      const source = [];
      for (let index = 0; index < beacons.length; index++) {
        const start = beacons[index];
        const end = beacons[index + 1];
        if (end) {
          const [lng, lat] = convertCMtoL([start.posX!, start.posY!], mapWidth);
          const [lng1, lat1] = convertCMtoL([end.posX!, end.posY!], mapWidth);
          source.push({ ...start, lng, lat, lng1, lat1 });
        }
      }
      if (beaconLayer.current) {
        if (isEmpty(props.beacons)) {
          // 图层不能设置空数据 ，这里数据为空时直接隐藏图层
          beaconLayer.current.hide();
        } else {
          beaconLayer.current.show();
          beaconLayer.current.setData(source);
          beaconLayer.current.setIndex(3);
        }
      } else {
        beaconLayer.current = new LineLayer({ zIndex: 3 })
          .source(source, {
            parser: { type: 'json', x: 'lng', y: 'lat', x1: 'lng1', y1: 'lat1' },
          })
          .shape('line')
          .size(2)
          //.texture('arrow')
          .color(green[3])
          .animate({
            interval: 0.4, // 间隔
            duration: 1, // 持续时间，延时
            trailLength: 0.8, // 流线长度
          })
          .style({
            lineTexture: true, // 开启线的贴图功能
            iconStep: 20, // 设置贴图纹理的间距
          });
        scene.current?.addLayer(beaconLayer.current);
      }
      if (beaconPointLayer.current) {
        // 图层不能设置空数据 ，这里数据为空时直接隐藏图层
        if (isEmpty(props.beacons)) {
          beaconPointLayer.current.hide();
        } else {
          beaconPointLayer.current.show();
          beaconPointLayer.current.setData(beaconSource);
          beaconPointLayer.current.setIndex(4);
        }
      } else {
        beaconPointLayer.current = new PointLayer({ zIndex: 4 })
          .source(beaconSource, { parser: { type: 'json', x: 'lng', y: 'lat', name: 'name' } })
          .shape('circle')
          .color(green[3])
          .size(5);
        scene.current?.addLayer(beaconPointLayer.current);
      }
    }
  }, [props.beacons, loaded, mapWidth]);

  // 处理围栏展示内容
  React.useEffect(() => {
    if (loaded && props.fence && mapWidth && !isEmpty(props.fence.points)) {
      const fences = props.fence.points ?? [];
      const source = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [fences.map((item) => convertCMtoL([item.x, item.y], mapWidth))],
            },
          },
        ],
      };

      if (!fenceLayer.current) {
        fenceLayer.current = new PolygonLayer({ zIndex: 2 })
          .source(source)
          .shape('fill')
          .color(props.fence.type === 'In' ? green[4] : gold[4])
          .style({ opacity: 0.6 });
        scene.current?.addLayer(fenceLayer.current);
        console.log('fenceLayer.current', fenceLayer.current);
      } else {
        fenceLayer.current.setData(source);
        fenceLayer.current.setIndex(2);
      }
    }
  }, [props.fence, loaded, mapWidth]);

  React.useEffect(() => {
    if (loaded && mapWidth) {
      const coordinates =
        props.locations?.map((item) => convertCMtoL([item.posX!, item.posY!], mapWidth)) ?? [];

      const source = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Polygon', coordinates: [coordinates] },
          },
        ],
      };
      if (!locationLayer.current) {
        locationLayer.current = new PointLayer({
          name: 'real-time',
          zIndex: 3,
          layerType: 'fillImage',
        })
          .source(source)
          .color(green[3])
          .size(15)
          .shape('personImage', ['personImage'])
          .animate(true);
        scene.current?.addLayer(locationLayer.current);
      } else {
        // if (isEmpty(props.locations)) {
        //   // 图层不能设置空数据 ，这里数据为空时直接隐藏图层
        //   locationLayer.current.hide();
        // } else {
        //   if (!locationLayer.current.isVisible()) {
        //     locationLayer.current.show();
        //   }
        // }
        locationLayer.current.setData(source);
        locationLayer.current.setIndex(3);
      }
    }
  }, [props.locations, loaded, mapWidth]);
  // 处理告警信息
  React.useEffect(() => {
    if (loaded && mapWidth && !isEmpty(props.alarms)) {
      const coordinates =
        props.alarms?.map((item) => convertCMtoL([item.point!.x!, item.point!.y!], mapWidth)) ?? [];

      const source = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Polygon', coordinates: [coordinates] },
          },
        ],
      };
      if (!alarmLayer.current) {
        alarmLayer.current = new PointLayer({ zIndex: 10, layerType: 'fillImage' })
          .source(source)
          .color(green[3])
          .size(15)
          .shape('warning', ['warning'])
          .animate(true);
        scene.current?.addLayer(alarmLayer.current);
      } else {
        alarmLayer.current.setData(source);
        alarmLayer.current.setIndex(10);
      }
    }
  }, [props.alarms, loaded, mapWidth]);

  return (
    <React.Fragment>
      <Card bodyStyle={{ padding: 0 }}>
        <div id="map" ref={mapContainer} style={{ minHeight: props.height ?? 600 }}></div>
      </Card>
    </React.Fragment>
  );
}
