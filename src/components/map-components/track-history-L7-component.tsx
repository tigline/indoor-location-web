import arrow from '@/assets/images/arrow.svg';
import person from '@/assets/images/person.svg';
import stationImage from '@/assets/images/station.svg';
import warning from '@/assets/images/warning.svg';
import { green } from '@ant-design/colors';
import { ILayer, ImageLayer, LineLayer, Mapbox, metersToLngLat, PointLayer, Scene } from '@antv/l7';
import { Card } from 'antd';
import { isEmpty } from 'lodash';
import React from 'react';
import { convertCMtoL, scale } from './convert';

interface IProps {
  map?: string;
  width?: number;
  height?: number;
  rect: [number?, number?];
  /**
   * 基站内容
   *
   * @type {API.GatewayInfo[]}
   * @memberof IProps
   */
  stations?: API.GatewayInfo[];

  /**
   * 轨迹内容
   *
   * @type {API.AoaDataInfo[]}
   * @memberof IProps
   */
  beacons?: API.AoaDataInfo[];
}
/**
 * 为了减少图层数，这里将总地图拆开为多个组件
 * 这里只展示轨迹追踪
 * @param props
 * @returns
 */
export function TrackHistoryL7Component(props: IProps) {
  const [mapLength, mapWidth] = props.rect;

  const [loaded, setLoaded] = React.useState<boolean>();
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const scene = React.useRef<Scene>();

  /** @type {*} 地图图片 图层 */
  const imageLayer = React.useRef<ImageLayer>();
  /** @type {*} 基站图层 */
  const stationLayer = React.useRef<ILayer>();
  /** @type {*} 轨迹 ‘线’ 图层 */
  const beaconLayer = React.useRef<ILayer>();
  /** @type {*} 轨迹 ‘点’ 图层 */
  const beaconPointLayer = React.useRef<ILayer>();

  React.useEffect(() => {
    scene.current = new Scene({
      id: mapContainer.current!,
      logoVisible: false,
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
      const maxRange = metersToLngLat([mapLength * scale, mapWidth * scale]);
      if (imageLayer.current) {
        imageLayer.current.setData(props.map!, {
          parser: { type: 'image', extent: [0, 0, ...maxRange] },
        });
        imageLayer.current.setIndex(0);
      } else {
        imageLayer.current = new ImageLayer({ zIndex: 0 });
        imageLayer.current.source(props.map!, {
          parser: { type: 'image', extent: [0, 0, ...maxRange] },
        });
        scene.current?.setCenter([maxRange[0] / 2, maxRange[1] / 2]);
        scene.current?.addLayer(imageLayer.current);
      }
    }
  }, [props.map, loaded, mapWidth, mapLength]);

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

  return (
    <React.Fragment>
      <Card bodyStyle={{ padding: 0 }}>
        <div id="map" ref={mapContainer} style={{ minHeight: props.height ?? 600 }}></div>
      </Card>
    </React.Fragment>
  );
}
