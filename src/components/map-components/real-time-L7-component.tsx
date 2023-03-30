import arrow from '@/assets/images/arrow.svg';
import box from '@/assets/images/box.svg';
import cart from '@/assets/images/cart.svg';
import equipment from '@/assets/images/equipment.svg';
import person from '@/assets/images/person.svg';
import stationImage from '@/assets/images/station.svg';
import warning from '@/assets/images/warning.svg';
import { delay } from '@/utils/global.utils';
import { gold, green } from '@ant-design/colors';
import {
  ILayer,
  ImageLayer,
  Mapbox,
  metersToLngLat,
  PointLayer,
  PolygonLayer,
  Popup,
  Scene,
} from '@antv/l7';
import { useIntl } from '@umijs/max';
import { Card } from 'antd';
import { forEach, isEmpty, isNil } from 'lodash';
import React, {useState} from 'react';
import { convertCMtoL, scale } from './convert';

/**
 * 让围栏图层闪烁
 * @param layer
 * @returns
 */
function flash(layer: ILayer) {
  return delay()
    .then(() => layer?.color('c', ['red']).renderLayers())
    .then(() => delay(50))
    .then(() => layer?.color('c').renderLayers())
    .then(() => delay(200))
    .then(() => layer?.color('c', ['red']).renderLayers())
    .then(() => delay(50))
    .then(() => layer?.color('c').renderLayers())
    .then(() => delay(200))
    .then(() => layer?.color('c', ['red']).renderLayers())
    .then(() => delay(50))
    .then(() => layer?.color('c').renderLayers());
}

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
   * 单个标签内容
   *
   * @type {API.AoaDataInfo[]}
   * @memberof IProps
   */
  locations?: API.AoaDataInfo[];

  /**
   * 围栏内容
   */
  fences?: API.FenceAndMapInfo[];
  hiddenFence?: boolean;

  /**
   * 收到报警后需要闪烁围栏图层
   */
  warningFenceId?: string;
  /**
   * 闪烁围栏图层
   * @returns
   */
  clear?: () => void;
}

/**
 * 为了减少图层数，这里将总地图拆开为多个组件
 * 这里只展示实时标签位置
 * @param props
 * @returns
 */



export function RealTimeL7Component(props: IProps) {

  const prevTimestamp = React.useRef(performance.now());
  const animationDuration = 1000; // 1秒

  const intl = useIntl();
  const TypeLabel: Record<string, string> = {
    Equipment: intl.formatMessage({
      id: 'pages.device-manage.label.type.equipment',
      defaultMessage: '设备',
    }),
    Personnel: intl.formatMessage({
      id: 'pages.device-manage.label.type.personnel',
      defaultMessage: '人员',
    }),
    Vehicle: intl.formatMessage({
      id: 'pages.device-manage.label.type.vehicle',
      defaultMessage: '工具',
    }),
    Stuff: intl.formatMessage({
      id: 'pages.device-manage.label.type.stuff',
      defaultMessage: '材料',
    }),
  };

  const [mapLength, mapWidth] = props.rect;
  const [loaded, setLoaded] = React.useState<boolean>();

  const mapContainer = React.useRef<HTMLDivElement>(null);
  const scene = React.useRef<Scene>();

  /** @type {*} 地图图片 图层 */
  const imageLayer = React.useRef<ImageLayer>();
  /** @type {*} 基站图层 */
  const stationLayer = React.useRef<ILayer>();

  /** @type {*} 实时位置 ‘点’图层 */
  const locationLayer = React.useRef<ILayer>();

  /** @type {*} 展示围栏 ‘面’ 图层 */
  const fenceLayers = React.useRef<Record<string | number, ILayer>>({});
  // window.fenceLayers = fenceLayers;

  const [prevLocations, setPrevLocations] = useState<API.AoaDataInfo[] | undefined>(undefined);

  function lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
  }

  function updateLocationss(timestamp: number) {
    if (!prevLocations || !props.locations) {
      setPrevLocations(props.locations);
      return;
    }
  
    const t = Math.min(1, (timestamp - prevTimestamp.current) / animationDuration);
    const interpolatedLocations: API.AoaDataInfo[] = [];
  
    for (let i = 0; i < props.locations.length; i++) {
      const currentLocation = props.locations[i];
      const prevLocation = prevLocations.find((item) => item.id === currentLocation.id);
  
      if (prevLocation) {
        const interpolatedX = lerp(prevLocation.posX!, currentLocation.posX!, t);
        const interpolatedY = lerp(prevLocation.posY!, currentLocation.posY!, t);
  
        interpolatedLocations.push({ ...currentLocation, posX: interpolatedX, posY: interpolatedY });
      } else {
        interpolatedLocations.push(currentLocation);
      }
    }
  
    // 更新位置数据
    
    if (loaded && mapWidth) {
      const source = (props.locations ?? [])?.map((item) => {
        const [lng, lat] = convertCMtoL([item.posX!, item.posY!], mapWidth) ?? [];
        return { ...item, lng, lat };
      });

      if (!locationLayer.current) {
        if (!isEmpty(source)) {
          locationLayer.current = new PointLayer({
            name: 'real-time',
            zIndex: 3,
            layerType: 'fillImage',
          })
            .source(source, {
              parser: { type: 'json', x: 'lng', y: 'lat', name: 'type' },
            })
            .color(green[3])
            .size(15)
            .shape('type', ['Equipment', 'Personnel', 'Vehicle', 'Stuff'])
            .animate(true);
          scene.current?.addLayer(locationLayer.current);
          locationLayer.current.on('mousemove', (e) => {
            console.log(e);

            const popup = new Popup({
              offsets: [0, 0],
              closeButton: false,
            })
              .setLnglat(e.lngLat)
              .setHTML(
                `
                <span>
                  <p>deviceId:${e.feature.deviceId}</p>
                  <p>X:${e.feature.posX}</p>
                  <p>Y:${e.feature.posY}</p>
                  <p>${intl.formatMessage({
                    id: 'pages.device-manage.label.type',
                    defaultMessage: '类型',
                  })}: ${TypeLabel[e.feature.type as any]}</p>
                </span>
                `,
              );
            scene.current?.addPopup(popup);
          });
        }
      } else {
        if (isEmpty(props.locations)) {
          // 图层不能设置空数据 ，这里数据为空时直接隐藏图层
          locationLayer.current.hide();
        } else {
          if (!locationLayer.current.isVisible()) {
            locationLayer.current.show();
          }
          locationLayer.current.setData(source);
          locationLayer.current.setIndex(3);
        }
      }
    }
  }

  const updateLocations = React.useCallback((timestamp: number) => {
    updateLocationss(timestamp);
  }, [props.locations]);

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

    scene.current.addImage('Equipment', equipment);
    scene.current.addImage('Personnel', person);
    scene.current.addImage('Vehicle', cart);
    scene.current.addImage('Stuff', box);

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
    if (loaded && mapWidth) {
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
    updateLocations(performance.now());
    requestAnimationFrame(updateLocations);
  }, [updateLocations, loaded, mapWidth]);


  // 处理围栏展示内容
  React.useEffect(() => {
    if (loaded && mapWidth) {
      forEach(fenceLayers.current, (item) => {
        if (!props.fences?.find((f) => item?.name.endsWith(f.fenceId + ''))) {
          item.hide();
        }
      });

      props.fences?.forEach((fence) => {
        const source = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                name: fence.name,
                code: fence.fenceId,
                c: fence.type === 'In' ? green[4] : gold[4],
              },
              geometry: {
                type: 'Polygon',
                coordinates: [
                  fence.points?.map((item) => convertCMtoL([item.x, item.y], mapWidth)),
                ],
              },
            },
          ],
        };

        if (!fenceLayers.current[fence.fenceId!]) {
          fenceLayers.current[fence.fenceId!] = new PolygonLayer({
            zIndex: 4,
            name: 'fence-layout-' + fence.fenceId,
            active: true,
            activeColor: 'red',
          })
            .source(source)
            .shape('fill')
            .color('c')
            .style({ opacity: 0.6 });

          // .active({
          //   color: 'red',
          // });
          scene.current?.addLayer(fenceLayers.current[fence.fenceId!]);
          // console.log('fenceLayer.current', fenceLayer.current);
        } else {
          fenceLayers.current?.[fence.fenceId!].show();
          fenceLayers.current?.[fence.fenceId!]?.setData(source);
          fenceLayers.current?.[fence.fenceId!]?.setIndex(9);
        }
      });
    }
  }, [props.fences, loaded, mapWidth]);

  React.useEffect(() => {
    if (!isNil(props.hiddenFence)) {
      if (props.hiddenFence) {
        forEach(fenceLayers.current, (item) => item?.hide());
      } else {
        forEach(fenceLayers.current, (item) => item?.show());
      }
    }
  }, [props.hiddenFence]);

  React.useEffect(() => {
    if (
      props.warningFenceId &&
      loaded &&
      fenceLayers.current[props.warningFenceId] &&
      !props.hiddenFence
    ) {
      // flash(props.warningFenceId);
      // fenceLayers.current?.[props.warningFenceId]?.color('c', ['red']);
      flash(fenceLayers.current?.[props.warningFenceId]).then(props.clear);
    }
  }, [props.warningFenceId, loaded, props.map, props.hiddenFence]);

  return (
    <React.Fragment>
      <Card bodyStyle={{ padding: 0 }}>
        <div id="map" ref={mapContainer} style={{ minHeight: props.height ?? 600 }}></div>
      </Card>
    </React.Fragment>
  );
}
