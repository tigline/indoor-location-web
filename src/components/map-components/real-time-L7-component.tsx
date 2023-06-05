import arrow from '@/assets/images/arrow.svg';
import StuffSelect from '@/assets/images/box-select.svg';
import Stuff from '@/assets/images/box.svg';
import VehicleSelect from '@/assets/images/cart-select.svg';
import Vehicle from '@/assets/images/cart.svg';
import EquipmentSelect from '@/assets/images/equipment-select.svg';
import Equipment from '@/assets/images/equipment.svg';
import PersonnelSelect from '@/assets/images/person-select.svg';
import Personnel from '@/assets/images/person.svg';
import StationSelect from '@/assets/images/station-select.svg';
import StationImage from '@/assets/images/station.svg';
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

  /**
   * 选中的基站要高亮展示
   */
  selectedStation?: number | string | null;

  /**
   * 选中的标签要高亮展示
   */
  selectedDeviceId?: number | string | null;
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

  let timer: NodeJS.Timeout | undefined;
  
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

  const popup = React.useRef<Popup>();

  /** @type {*} 地图图片 图层 */
  const imageLayer = React.useRef<ImageLayer>();
  /** @type {*} 基站图层 分高亮的和正常的 */
  const stationLayers = React.useRef<ILayer[]>([]);

  /** @type {*} 实时位置 ‘点’图层 分高亮的和正常的 */
  const locationLayers = React.useRef<ILayer[]>([]);

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
      forEach(
        [
          'Equipment',
          'Personnel',
          'Vehicle',
          'Stuff',
          'Equipment-selected',
          'Personnel-selected',
          'Vehicle-selected',
          'Stuff-selected',
        ],
        (key, index) => {
          const source = (props.locations ?? [])
            ?.filter((f) => {
              const [type, selected] = key.split('-');
              if (selected) {
                return f.type === type && f.deviceId === props.selectedDeviceId;
              } else {
                return f.type === type;
              }
            })
            ?.map((item) => {
              const [lng, lat] = convertCMtoL([item.posX!, item.posY!], mapWidth) ?? [];
              return { ...item, lng, lat };
            });

          if (!locationLayers.current?.[index]) {
            if (!isEmpty(source)) {
              locationLayers.current![index] = new PointLayer({
                name: 'real-time',
                zIndex: 3,
                layerType: 'fillImage',
              })
                .source(source, {
                  parser: { type: 'json', x: 'lng', y: 'lat', name: 'type' },
                })
                // .color(green[3])
                // .color('red')
                .size(15)
                .shape(key)
                .animate(true);
              scene.current?.addLayer(locationLayers.current![index]!);
              locationLayers.current?.[index].on('mousemove', (e) => {
                console.log(e);
                clearTimeout(timer);
                popup.current?.setLnglat(e.lngLat).setHTML(
                  `<span>
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
                scene.current?.addPopup(popup.current!);
                timer = setTimeout(() => {
                  scene.current?.removePopup(popup.current!);
                }, 5000);
              });
            }
          } else {
            if (isEmpty(props.locations)) {
              // 图层不能设置空数据 ，这里数据为空时直接隐藏图层
              locationLayers.current?.[index].hide();
            } else {
              if (!locationLayers.current?.[index].isVisible()) {
                locationLayers.current?.[index].show();
              }
              locationLayers.current?.[index].setData(source);
              locationLayers.current?.[index].setIndex(3);
            }
          }
        },
      );
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
    scene.current.addImage('Gateway', StationImage);
    scene.current.addImage('Gateway-selected', StationSelect);

    scene.current.addImage('arrow', arrow);

    scene.current.addImage('Equipment', Equipment);
    scene.current.addImage('Personnel', Personnel);
    scene.current.addImage('Vehicle', Vehicle);
    scene.current.addImage('Stuff', Stuff);
    scene.current.addImage('Equipment-selected', EquipmentSelect);
    scene.current.addImage('Personnel-selected', PersonnelSelect);
    scene.current.addImage('Vehicle-selected', VehicleSelect);
    scene.current.addImage('Stuff-selected', StuffSelect);

    scene.current.addImage('warning', warning);

    popup.current = new Popup({
      offsets: [0, 0],
      closeButton: false,
    });

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
      // 分为高亮的和正常的
      forEach(['Gateway-selected', 'Gateway'], (key, index) => {
        const source = (props.stations ?? [])
          ?.filter((f) => {
            const [, selected] = key.split('-');
            if (selected) {
              return f.gateway === props.selectedStation;
            } else {
              return f.gateway !== props.selectedStation;
            }
          })
          ?.map((item) => {
            const [lng, lat] = convertCMtoL([item.setX!, item.setY!], mapWidth);
            return { ...item, lng, lat };
          });
        if (stationLayers.current?.[index]) {
          // scene.current?.removeLayer(stationLayer.current);
          // stationLayer.current.destroy();
          stationLayers.current?.[index].setData(source);
          stationLayers.current?.[index].setIndex(3);
        } else {
          stationLayers.current[index] = new PointLayer({ zIndex: 3 })
            .source(source, {
              parser: { type: 'json', x: 'lng', y: 'lat', name: 'type' },
            })
            .shape(key)
            .size(10);
          scene.current?.addLayer(stationLayers.current[index]!);
          stationLayers.current?.[index].on('mousemove', (e) => {
            clearTimeout(timer);
            console.log(e);
            popup.current?.setLnglat(e.lngLat).setHTML(
              `<span>
                  <p>name:${e.feature.name}</p>
                  <p>deviceId:${e.feature.gateway}</p>
                  <p>X:${e.feature.setX}</p>
                  <p>Y:${e.feature.setY}</p>
                  <p>${intl.formatMessage({
                    id: 'pages.device-manage.label.type',
                    defaultMessage: '类型',
                  })}: Gateway</p>
                </span>`,
            );
            scene.current?.addPopup(popup.current!);
            timer = setTimeout(() => {
              scene.current?.removePopup(popup.current!);
            }, 5000);
          });
        }
      });
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

      if (props.fences !== undefined && props.fences.length > 0) {
         
      } else {
        forEach(fenceLayers.current, (item) => {
          item.hide();
        });
        return;
      }

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
  }, [props.fences]);

  React.useEffect(() => {
    if (!isNil(props.hiddenFence)) {
      if (props.hiddenFence) {
        forEach(fenceLayers.current, (item) => item?.hide());
      } else {
        if (props.fences !== undefined && props.fences.length > 0) {
          forEach(fenceLayers.current, (item) => item?.show());
        } else {
          forEach(fenceLayers.current, (item) => item?.hide());
        }
        
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
