import arrow from '@/assets/images/arrow.svg';
import person from '@/assets/images/person.svg';
import stationImage from '@/assets/images/station.svg';
import warning from '@/assets/images/warning.svg';
import { gold, green } from '@ant-design/colors';
import {
  ILayer,
  ImageLayer,
  Mapbox,
  metersToLngLat,
  PointLayer,
  PolygonLayer,
  Scene,
} from '@antv/l7';
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
   * 围栏内容
   *
   * @type {API.FenceAndMapInfo}
   * @memberof IProps
   */
  fence?: API.FenceAndMapInfo;

  alarms?: API.AlarmInfo[];
}

export function AlarmsL7Component(props: IProps) {
  const [mapLength, mapWidth] = props.rect;
  const [loaded, setLoaded] = React.useState<boolean>();
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const scene = React.useRef<Scene>();

  /** @type {*} 地图图片 图层 */
  const imageLayer = React.useRef<ImageLayer>();
  /** @type {*} 告警位置 ‘点’图层*/
  const alarmLayer = React.useRef<ILayer>();
  /** @type {*} 展示围栏 ‘面’ 图层 */
  const fenceLayer = React.useRef<ILayer>();

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

  // 处理告警信息
  React.useEffect(() => {
    if (loaded && mapWidth && !isEmpty(props.alarms)) {
      // const coordinates =
      //   props.alarms?.map((item) => convertCMtoL([item.point!.x!, item.point!.y!], mapWidth)) ?? [];

      const source = (props.alarms ?? [])?.map((item) => {
        const [lng, lat] = convertCMtoL([item.point!.x!, item.point!.y!], mapWidth);
        return { ...item, lng, lat };
      });

      // const source = {
      //   type: 'FeatureCollection',
      //   features: [
      //     {
      //       type: 'Feature',
      //       properties: {},
      //       geometry: { type: 'Polygon', coordinates: [coordinates] },
      //     },
      //   ],
      // };
      if (!alarmLayer.current) {
        alarmLayer.current = new PointLayer({ zIndex: 10, layerType: 'fillImage' })
          .source(source, {
            parser: { type: 'json', x: 'lng', y: 'lat', name: 'name' },
          })
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
