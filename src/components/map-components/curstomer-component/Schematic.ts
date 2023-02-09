import { isEmpty, isEqual, uniqWith } from 'lodash';
import { Circle, Displayable, Group, init, Polygon, Polyline } from 'zrender';

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
  private instance;
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
   * 默认为 1mm / 1px
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

  constructor(dom: HTMLElement) {
    this.view = new Group();
    if (dom) {
      this.instance = init(dom);
      this.instance.add(this.view);
      this.initZoom();
      this.initMove();
      this.initDraw();
    } else {
      console.error('canvas dom is null!');
    }
  }
  public add(shape: Displayable | Group) {
    this.view.add(shape);
  }
  public remove(shape: Displayable) {
    this.view.remove(shape);
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
        startPoint = mousePoint;
        currentPoint = mousePoint;
        points.push(startPoint);
        points.push(currentPoint);
        this.tempPolygon = new Polyline({
          shape: { points: points.map((p) => this.transformBack(p as [number, number])) },
          style: { fill: 'red' },
        });
        this.view.add(this.tempPolygon);
        // 添加吸附点, 由于记录的是真实坐标，这里需要转换一下
        const [cx, cy] = this.transformBack(mousePoint);
        startCircle = new Circle({
          shape: { cx, cy, r: 20 },
          style: { fill: 'blue', fillOpacity: 1 },
        });
        this.view.add(startCircle);
      } else {
        // 最后一个点是鼠标的位置，如果点击确认的话需要先清除掉，再放一个新的点进去
        points.pop();
        if (isEqual(currentPoint, startPoint)) {
          // 终点与起点一致，表示已经画完了
          if (this.tempPolygon) {
            this.view.remove(this.tempPolygon);
          }
          if (uniqWith(points, isEqual).length > 2) {
            this.view.add(
              new Polygon({
                shape: { points: points.map((p) => this.transformBack(p as [number, number])) },
                style: { fill: 'red' },
              }),
            );
          }
          points = [];
          startPoint = [];
          currentPoint = [];
          startCircle = null;
        } else {
          points.push(mousePoint);
          currentPoint = mousePoint;
          points.push(currentPoint);
          this.tempPolygon?.attr('shape', {
            points: points.map((p) => this.transformBack(p as [number, number])),
          });
          // console.log(points);
        }
        console.log('points', points);
      }
    });

    this.instance?.on('mousemove', (ev) => {
      // 鼠标真实坐标
      const [offsetX, offsetY] = this.transform([ev.offsetX, ev.offsetY]);
      if (!circle) {
        const [cx, cy] = this.transformBack([offsetX, offsetY]);
        // this.view.remove(circle);
        circle = new Circle({ shape: { cx, cy, r: 4 } });
        this.view.add(circle);
      }
      // 多边形两个点+跟随鼠标的一个点，当点的集合大于3个点时才作吸附的动作
      if (points.length > 3 && !isEmpty(startPoint) && startCircle?.contain(offsetX, offsetY)) {
        currentPoint[0] = startPoint[0];
        currentPoint[1] = startPoint[1];
      } else {
        currentPoint[0] = offsetX;
        currentPoint[1] = offsetY;
      }
      const [cx, cy] = this.transformBack([currentPoint[0], currentPoint[1]] as [number, number]);
      circle.attr('shape', { cx, cy });
      this.tempPolygon?.attr('shape', {
        points: points.map((pp) => this.transformBack(pp as [number, number])),
      });
    });
  }

  /**
   * 转换坐标
   * 将图上坐标转换为实际坐标
   * @param {[number, number]} point
   * @return {*}  {[number, number]}
   * @memberof Schematic
   */
  public transform(point: [number, number]): [number, number] {
    // console.log(point);
    return [(point[0] - this.x) / this.zoom, (point[1] - this.y) / this.zoom];
  }
  /**
   * 转换坐标
   * 将实际坐标转换为图上坐标
   * @param {[number, number]} point
   * @return {*}  {[number, number]}
   * @memberof Schematic
   */
  public transformBack(point: [number, number]): [number, number] {
    const record = [point[0] * this.zoom, point[1] * this.zoom] as [number, number];
    console.log(`x:${this.x},y:${this.y},zoom:${this.zoom},point:${point},record:${record}`);
    return record;
  }
}
