import arrow from '@/assets/images/arrow.svg';
import person from '@/assets/images/person.svg';
import stationImage from '@/assets/images/station.svg';
import warning from '@/assets/images/warning.svg';
import { blue, gold, green, red } from '@ant-design/colors';
import {
  HeatmapLayer,
  ILayer,
  ImageLayer,
  Mapbox,
  metersToLngLat,
  PointLayer,
  Scene,
} from '@antv/l7';
import { Card } from 'antd';
import { chain, forEach, isEmpty } from 'lodash';
import React from 'react';
import { convertCMtoL, scale } from './convert';

const ColorMap = {
  Equipment: red,
  Personnel: green,
  Vehicle: gold,
  Stuff: blue,
};

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
 * 这里只展示热力分析
 * @param props
 * @returns
 */
export function HeatmapL7Component(props: IProps) {
  const [mapLength, mapWidth] = props.rect;

  const [loaded, setLoaded] = React.useState<boolean>();
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const scene = React.useRef<Scene>();

  /** @type {*} 地图图片 图层 */
  const imageLayer = React.useRef<ImageLayer>();
  /** @type {*} 基站图层 */
  const stationLayer = React.useRef<ILayer>();
  /**
   * 热力图图层
   */
  const heatMapLayer = React.useRef<Record<Required<API.AoaDataInfo>['type'], ILayer>>({} as any);

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

  // 处理热力图展示内容
  React.useEffect(() => {
    if (loaded && mapWidth) {
      const source = chain(props.beacons ?? [])
        .groupBy((o) => o.type)
        .mapValues((value) => {
          return chain(value)
            .countBy((item) => {
              return `${item.posX?.toFixed(1)}-${item.posY?.toFixed(1)}`;
            })
            .map((count, key) => {
              const [posX, posY] = key.split('-').map(Number);
              const [lng, lat] = convertCMtoL([posX!, posY!], mapWidth);
              return { lng, lat, sum: count };
            })
            .value();
        })
        .value();
      // const source = (props.beacons ?? [])?.map((item) => {
      //   const [lng, lat] = convertCMtoL([item.posX!, item.posY!], mapWidth);
      //   return { ...item, lng, lat, sum: 100 };
      // });
      forEach(
        ['Equipment', 'Personnel', 'Vehicle', 'Stuff'] as API.AoaDataInfo['type'][],
        (key) => {
          if (!heatMapLayer.current?.[key!]) {
            heatMapLayer.current![key!] = new HeatmapLayer({ name: 'heat-map-Equipment-layer' })
              .source(source[key!], { parser: { type: 'json', x: 'lng', y: 'lat' } })
              .shape('heatmap')
              .size('sum', [0, 1]) // weight映射通道
              .style({
                intensity: 2,
                radius: 20,
                rampColors: {
                  colors: [
                    ColorMap[key!][2],
                    ColorMap[key!][3],
                    ColorMap[key!][4],
                    ColorMap[key!][5],
                    ColorMap[key!][7],
                    ColorMap[key!][9],
                  ].reverse(),
                  positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
                },
              });
            scene.current?.addLayer(heatMapLayer.current![key!]);
          } else {
            heatMapLayer.current![key!].setData(source[key!]);
            heatMapLayer.current![key!]?.show();
            heatMapLayer.current![key!].setIndex(4);
          }
        },
      );
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
