import { isEmpty } from 'lodash';
import { Displayable, Group, init, Polygon } from 'zrender';
export class Container {
  private instance;
  /**
   * 包含所有组件的组合
   *
   * @private
   * @type {Group}
   * @memberof Container
   */
  private view: Group;

  private zoom = 1;
  /**
   * 记录全局view的偏移
   *
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

  private tempPolygon?: Polygon;
  public initDraw() {
    // 画多边形时的起始点
    let startPoint: number[] = [];
    this.instance?.on('click', (e) => {
      if (isEmpty(startPoint)) {
        startPoint = [e.offsetX, e.offsetY];
      }
      this.tempPolygon = new Polygon({
        shape: {
          points: [[e.offsetX, e.offsetY]],
        },
        style: {
          fill: 'red',
        },
      });
      this.view.add(this.tempPolygon);
    });
    this.instance?.on('dblclick', () => {
      //
    });
  }
  public transform() {}
}
