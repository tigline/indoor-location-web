import station from '@/assets/images/station.svg';
import { geekblue, volcano } from '@ant-design/colors';
import { isEmpty, isEqual, uniqWith } from 'lodash';
import {
  Circle,
  Displayable,
  Group,
  Image,
  init,
  Polygon,
  Polyline,
  registerPainter,
} from 'zrender';
import CanvasPainter from 'zrender/lib/canvas/Painter';
// 注册绘制器
registerPainter('canvas', CanvasPainter);

// interface Point {
//   x: number;
//   y: number;
// }

/**
 * 室内地图示意图绘制组件
 * 此组件以基于zrender画室内示意图
 * 为了简化流程，这里以简单的方式来
 * 共分为三层
 * 1. 最底层为示意地图层，主要由客户提供，预计是 cad 或 svg
 * 2. 中间层为轨迹层，由定位数据来决定
 * 3. 最上层为交互层，主要用来画围栏
 *
 * @export
 * @class Schematic
 */
export class Schematic {
  public instance;
  /**
   * 包含所有组件的组合
   *
   * @private
   * @type {Group}
   * @memberof Container
   */
  private view: Group;

  /**
   * 比例尺
   * 默认为 1px / 1mm
   * @private
   * @memberof Schematic
   */
  private zoom = 1 / 1;
  /**
   * 记录全局view的偏移
   * 单位px
   * @private
   * @memberof Container
   */
  private x = 0;
  private y = 0;

  private moveAble = false;

  private drawAble = false;

  /**
   * 轨迹点
   * 支持多条轨迹展示
   * 重置轨迹时需要删除之前的轨迹
   * @private
   * @type {Circle[]}
   * @memberof Schematic
   */
  private trackPoints: Circle[][] = [];
  /**
   * 轨迹线
   * 支持多条轨迹线
   * 重置轨迹时需要删除之前的轨迹
   * @private
   * @type {Polyline[][]}
   * @memberof Schematic
   */
  private trackLines: Polyline[] = [];

  private stationPoints: Image[] = [];

  constructor(dom: HTMLElement) {
    this.view = new Group();
    if (dom) {
      this.instance = init(dom, { renderer: 'canvas' });
      this.instance.add(this.view);
      this.initZoom();
      this.initMove();
      this.initDraw();
    } else {
      console.error('canvas dom is null!');
    }
    // window.view = this.view;
  }
  public add(shape: Displayable | Group) {
    this.view.add(shape);
  }
  public remove(shape: Displayable) {
    this.view.remove(shape);
  }
  /**
   * 设置轨迹
   *
   * @param {number[][]} path
   * @memberof Schematic
   */
  public setTrack(path: number[][][]) {
    if (isEmpty(path)) {
      return;
    }
    const multiPoints = path?.map((arr) => this.transPoints(arr));
    if (!isEmpty(this.trackPoints)) {
      this.trackPoints?.flat()?.forEach(this.view.remove.bind(this));
      // this.trackPoints.forEach((items) => {
      //   items.forEach((item) => {
      //     this.view.remove(item);
      //   });
      // });
    }
    if (!isEmpty(this.trackLines)) {
      this.trackLines?.forEach(this.view.remove.bind(this));
    }
    this.trackPoints = multiPoints?.map((points) => {
      return points.map(([cx, cy]) => {
        return new Circle({
          shape: { cx, cy, r: 5 / this.zoom },
          zlevel: 3,
          style: { fill: geekblue.primary },
        });
      });
    });
    this.trackPoints.forEach((circles) => circles.forEach((circle) => this.view.add(circle)));
    this.trackLines = multiPoints.map((points) => {
      return new Polyline({
        shape: { points },
        zlevel: 3,
        style: {
          fill: geekblue.primary,
          stroke: geekblue.primary,
          strokeNoScale: true,
          lineDash: 'dashed',
          lineWidth: 3,
        },
      });
    });
    this.trackLines.forEach((trackLine) => {
      this.view.add(trackLine);
      trackLine
        .animate('style', true)
        .when(500, { lineDashOffset: 3 })
        .during(() => {
          this.trackPoints.flat().forEach((circle) => {
            circle.attr('shape', { r: 5 / this.zoom });
          });
        })
        .start();
    });
  }

  /**
   * 添加基站内容
   *
   * @param {number[][]} stations
   * @memberof Schematic
   */
  public setBaseStations(stations: number[][]) {
    const points = this.transPoints(stations);
    const width = 10;
    const height = 10;
    if (!isEmpty(this.stationPoints)) {
      this.stationPoints.forEach((item) => {
        this.view.remove(item);
      });
    }
    this.stationPoints = points.map((point) => {
      const [x, y] = point;
      return new Image({
        style: {
          image: station,
          x: x + width / 2,
          y: y + height / 2,
          width: width / this.zoom,
          height: height / this.zoom,
        },
      });
    });
    this.stationPoints.forEach(this.view.add.bind(this));
  }
  /**
   * 初始化缩放
   *
   * @private
   * @memberof Container
   */
  private initZoom() {
    this.instance?.on('mousewheel', (e) => {
      e.event.preventDefault();
      let v = e.wheelDelta;
      // 储存先前缩放量
      let prevZoom = this.zoom;
      this.zoom += v * 0.1;
      this.zoom = Math.max(0.1, this.zoom);
      // 本次放量
      let nextZoom = this.zoom;
      // 图片在缩放后移动量
      let dx = (1 - nextZoom / prevZoom) * (e.offsetX - this.x);
      let dy = (1 - nextZoom / prevZoom) * (e.offsetY - this.y);
      // 得到放后图片偏移点
      this.x += dx;
      this.y += dy;
      this.view.attr('scaleX', this.zoom);
      this.view.attr('scaleY', this.zoom);
      this.view.attr('x', this.x);
      this.view.attr('y', this.y);
      // this.trackLine.attr('style',{ strokeNoScale})
    });
  }

  private initMove() {
    // 开始移动时鼠标的坐标
    let startX = 0;
    let startY = 0;
    this.instance?.on('mousedown', (e) => {
      this.moveAble = true;
      startX = e.offsetX;
      startY = e.offsetY;
    });
    this.instance?.on('mousemove', (e) => {
      if (this.moveAble) {
        this.view.attr('x', this.x + e.offsetX - startX);
        this.view.attr('y', this.y + e.offsetY - startY);
      }
    });
    this.instance?.on('mouseup', (e) => {
      this.moveAble = false;
      this.x = this.x + e.offsetX - startX;
      this.y = this.y + e.offsetY - startY;
      startX = 0;
      startY = 0;
    });
  }

  private tempPolygon?: Polyline;
  private initDraw() {
    // 画多边形时的起始点
    let startPoint: number[] = [];

    /**
     * 起点指示点，主要用来判断是否吸附
     */
    let startCircle: Circle | null;
    /**
     * 多边形的点集合
     */
    let points: number[][] = [];
    /**
     * 跟随鼠标的点，有了它才能跟着鼠标来动
     */
    let currentPoint: number[] = [];
    /**
     * 画图时跟着鼠标走的指示点
     */
    let circle: Circle;

    this.instance?.on('click', (e) => {
      // 鼠标真实坐标
      const mousePoint = this.transform([e.offsetX, e.offsetY]);

      // console.log('click');
      if (isEmpty(startPoint)) {
        startPoint[0] = mousePoint[0];
        startPoint[1] = mousePoint[1];
        currentPoint[0] = mousePoint[0];
        currentPoint[1] = mousePoint[1];
        points.push(startPoint);
        points.push(currentPoint);
        this.tempPolygon = new Polyline({
          shape: { points: this.transPoints(points) },
          style: {
            fill: volcano[2],
            stroke: volcano.primary,
            lineDash: 'dashed',
            fillOpacity: 0.4,
            strokeNoScale: true,
          },
        });
        this.view.add(this.tempPolygon);
        // 添加吸附点, 由于记录的是真实坐标，这里需要转换一下
        const [cx, cy] = this.transformBack(mousePoint);
        startCircle = new Circle({
          shape: { cx, cy, r: 20 / this.zoom },
          style: { fill: geekblue.primary, fillOpacity: 0 },
        });
        this.view.add(startCircle);
      } else {
        // 最后一个点是鼠标的位置，如果点击确认的话需要先清除掉，再放一个新的点进去
        points.pop();
        if (isEqual(currentPoint, startPoint) && uniqWith(points, isEqual).length > 2) {
          // 终点与起点一致，表示已经画完了
          if (this.tempPolygon) {
            this.view.remove(this.tempPolygon);
          }

          this.view.add(
            new Polygon({
              shape: { points: this.transPoints(points) },
              style: {
                fill: volcano[2],
                stroke: volcano.primary,
                fillOpacity: 0.4,
                strokeNoScale: true,
              },
            }),
          );

          points = [];
          startPoint = [];
          currentPoint = [];
          startCircle = null;
        } else {
          points.push(mousePoint);
          currentPoint = [...mousePoint];
          points.push(currentPoint);
          this.tempPolygon?.attr('shape', {
            points: this.transPoints(points),
          });
          // console.log(points);
        }
        console.log('points', points);
      }
    });
    this.instance?.on('mousewheel', (ev) => {
      // const [cx, cy] = this.transformBack(currentPoint);
      const [startCx, startCy] = this.transformBack(startPoint);
      circle.attr('shape', { cx: ev.offsetX, cy: ev.offsetY, r: 4 / this.zoom });
      startCircle?.attr('shape', { cx: startCx, cy: startCy, r: 20 / this.zoom });
      this.tempPolygon?.attr('shape', { points: this.transPoints(points) });
    });
    this.instance?.on('mousemove', (ev) => {
      // 鼠标相对于真实环境的坐标
      const [offsetX, offsetY] = this.transform([ev.offsetX, ev.offsetY]);
      if (!circle) {
        const [cx, cy] = this.transformBack([offsetX, offsetY]);
        circle = new Circle({ shape: { cx, cy, r: 4 / this.zoom }, zlevel: 999 });
        this.view.add(circle);
      }
      // 多边形两个点+跟随鼠标的一个点，当点的集合大于3个点时才作吸附的动作
      if (
        points.length > 3 &&
        !isEmpty(startPoint) &&
        startCircle?.contain(ev.offsetX, ev.offsetY)
      ) {
        currentPoint[0] = startPoint[0];
        currentPoint[1] = startPoint[1];
      } else {
        currentPoint[0] = offsetX;
        currentPoint[1] = offsetY;
      }
      const [cx, cy] = this.transformBack(currentPoint);
      const [startCx, startCy] = this.transformBack(startPoint);
      console.log(
        `
         图上偏移:${this.view.x}:${this.view.y},
         放大倍率:${this.zoom},
         真实起点坐标:${startPoint},
         图上起点坐标:${[startCx, startCy]},
         真实坐标:${currentPoint},
         图上坐标:${[cx, cy]},
         points:${points.length},
         this.tempPolygon:${this.tempPolygon}
        `,
      );
      circle.attr('shape', { cx, cy });
      startCircle?.attr('shape', { cx: startCx, cy: startCy, r: 20 / this.zoom });
      this.tempPolygon?.attr('shape', { points: this.transPoints(points) });
    });
  }

  /**
   * 转换坐标
   * 将图上坐标转换为实际坐标
   * @param {[number, number]} point
   * @return {*}  {[number, number]}
   * @memberof Schematic
   */
  public transform(point: number[]): number[] {
    return [(point[0] - this.view.x) / this.zoom, (point[1] - this.view.y) / this.zoom];
  }

  /**
   * 转换坐标
   * 将实际坐标转换为图上坐标
   * 第一次转换为全局坐标
   * 第二次转换为相对于view的相对坐标
   * @param {number[]} point
   * @return {*}  {number[]}
   * @memberof Schematic
   */
  public transformBack(point: number[]): number[] {
    const [x, y] = [point[0] * this.zoom + this.view.x, point[1] * this.zoom + this.view.y];
    return this.view.transformCoordToLocal(x, y) as [number, number];
  }

  public transPoints(points: number[][]): number[][] {
    return points.map(this.transformBack.bind(this));
  }
}
