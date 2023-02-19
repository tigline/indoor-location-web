import { Spin } from 'antd';
import { isEmpty } from 'lodash';
import React from 'react';
import * as zrender from 'zrender';
import { Schematic } from './curstomer-component/Schematic';

interface IProps {
  map?: string;

  /**
   * 轨迹数据
   *
   * @type {number[][][]}
   * @memberof IProps
   */
  tracks?: number[][][];
  /**
   * 基站数据
   *
   * @type {number[][]}
   * @memberof IProps
   */
  stations?: number[][];
}
export function ZrenderComponent(props: IProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const board = React.useRef<Schematic>();
  React.useEffect(() => {
    if (ref.current) {
      board.current = new Schematic(ref.current);
    }
  }, []);
  React.useEffect(() => {
    if (props.map) {
      const backgroundMap = zrender.parseSVG(props.map, {
        ignoreRootClip: true,
        ignoreViewBox: true,
      });
      board.current?.instance?.resize({
        width: backgroundMap.width,
        height: backgroundMap.height,
      });
      board.current?.add(backgroundMap.root);
    }
  }, [props.map]);
  React.useEffect(() => {
    if (props.stations && !isEmpty(props.stations)) {
      board.current?.setBaseStations(props.stations);
    }
  }, [props.stations]);
  React.useEffect(() => {
    if (props.tracks && !isEmpty(props.tracks)) {
      board.current?.setTrack(props.tracks);
    }
  }, [props.tracks]);

  return (
    <Spin spinning={!props.map}>
      <div id="map" ref={ref} style={{ border: '1px solid', display: 'inline-block' }} />
    </Spin>
  );
}
