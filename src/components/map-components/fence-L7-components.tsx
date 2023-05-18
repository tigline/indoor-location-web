import arrow from '@/assets/images/arrow.svg';
import person from '@/assets/images/person.svg';
import stationImage from '@/assets/images/station.svg';
import warning from '@/assets/images/warning.svg';
import { gold, green } from '@ant-design/colors';
import {
  ILayer,
  ImageLayer,
  lngLatToMeters,
  Mapbox,
  metersToLngLat,
  Point,
  PolygonLayer,
  Scene,
} from '@antv/l7';
import { DrawEvent, DrawPolygon } from '@antv/l7-draw';
import { Feature } from '@turf/turf';
import { Card } from 'antd';
import { Polygon } from 'geojson';
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
  initialData?: Feature<Polygon>[];
  /**
   * 围栏内容
   *
   * @type {API.FenceAndMapInfo}
   * @memberof IProps
   */
  fence?: API.FenceAndMapInfo;
}

/**
 * 为了减少图层数，这里将总地图拆开为多个组件
 * 这里只展示围栏
 * @param props
 * @returns
 */
export function FenceL7Components(props: IProps) {
  const [mapLength, mapWidth] = props.rect;
  const [loaded, setLoaded] = React.useState<boolean>();
  const [drawerInited, setDrawerInited] = React.useState<boolean>(false);
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const scene = React.useRef<Scene>();

  /** @type {*} 绘制围栏 图层 */
  const drawer = React.useRef<DrawPolygon>();

  /** @type {*} 地图图片 图层 */
  const imageLayer = React.useRef<ImageLayer>();

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

  React.useEffect(() => {
    if (scene.current && loaded && mapWidth) {
      drawer.current = new DrawPolygon(scene.current, {
        initialData: props?.initialData,
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

  // 处理围栏展示内容
  React.useEffect(() => {
    if (loaded && props.fence && mapWidth) {
      // const source = (props.fence.points ?? [])?.map((item) => {
      //   const [lng, lat] = convertCMtoL([item.x!, item.y!], mapWidth);
      //   return { ...item, lng, lat };
      // });

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
        fenceLayer.current = new PolygonLayer({ zIndex: 2, name: 'fence-layout' })
          .source(source)
          .shape('fill')
          .color(props.fence.type === 'In' ? green[4] : gold[4])
          .style({ opacity: 0.6 });
        scene.current?.addLayer(fenceLayer.current);
        // console.log('fenceLayer.current', fenceLayer.current);
      } else {
        fenceLayer.current.setData(source);
        fenceLayer.current.setIndex(2);
      }
    }
  }, [props.fence, loaded, mapWidth]);

  return (
    <React.Fragment>
      <Card bodyStyle={{ padding: 0 }}>
        <div id="map" ref={mapContainer} style={{ minHeight: props.height ?? 600 }}></div>
      </Card>
    </React.Fragment>
  );
}
