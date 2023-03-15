import arrow from '@/assets/images/arrow.svg';
import person from '@/assets/images/person.svg';
import stationImage from '@/assets/images/station.svg';
import warning from '@/assets/images/warning.svg';
import { ImageLayer, Mapbox, metersToLngLat, Scene } from '@antv/l7';
import { Card } from 'antd';
import React from 'react';
import { scale } from './convert';

interface IProps {
  map?: string;
  width?: number;
  height?: number;
  rect: [number?, number?];
}
/**
 * 为了减少图层数，这里将总地图拆开为多个组件
 * 这里只展示地图
 * @param props
 * @returns
 */
export function MapL7Component(props: IProps) {
  const [mapLength, mapWidth] = props.rect;
  const [loaded, setLoaded] = React.useState<boolean>();
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const scene = React.useRef<Scene>();

  /** @type {*} 地图图片 图层 */
  const imageLayer = React.useRef<ImageLayer>();

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

  return (
    <React.Fragment>
      <Card bodyStyle={{ padding: 0 }}>
        <div id="map" ref={mapContainer} style={{ minHeight: props.height ?? 600 }}></div>
      </Card>
    </React.Fragment>
  );
}
