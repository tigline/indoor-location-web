/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
      {
        name: 'register',
        path: '/user/register',
        component: './user/register',
      },
    ],
  },
  {
    path: '/account',
    name: 'account',
    hideInMenu: true,
    routes: [
      { name: 'center', path: '/account/center', component: './account/center' },
      // { name: 'settings', path: '/settings', component: './account/settings' },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'appstore',
    component: './dashboard',
  },
  {
    path: '/position-manage',
    name: 'position-manage',
    icon: 'compass',
    routes: [
      {
        path: '/position-manage',
        redirect: '/position-manage/real-time-location',
      },
      {
        path: '/position-manage/real-time-location',
        name: 'real-time-location',
        component: './position-manage/real-time-location',
      },
      {
        path: '/position-manage/tracking-manage',
        name: 'tracking-manage',
        component: './position-manage/tracking-manage',
      },
      {
        path: '/position-manage/tracking-history',
        name: 'tracking-history',
        component: './position-manage/tracking-history',
      },
    ],
  },
  {
    path: '/device-manage',
    name: 'device-manage',
    icon: 'hdd',
    routes: [
      {
        path: '/device-manage',
        redirect: '/device-manage/base-station',
      },
      {
        path: '/device-manage/base-station',
        name: 'base-station',
        component: './device-manage/base-station',
      },
      {
        path: '/device-manage/label-manage',
        name: 'label-manage',
        component: './device-manage/label-manage',
      },
    ],
  },
  {
    path: '/goods-manage',
    name: 'goods-manage',
    icon: 'hdd',
    routes: [
      {
        path: '/goods-manage',
        redirect: '/goods-manage/goods-type',
      },
      {
        path: '/goods-manage/goods-type',
        name: 'goods-type',
        component: './goods-manage/goods-type',
      },
      {
        path: '/goods-manage/goods-info',
        name: 'goods-info',
        component: './goods-manage/goods-info',
      },
    ],
  },
  {
    path: '/analyze',
    name: 'analyze',
    icon: 'lineChart',
    routes: [
      {
        path: '/analyze',
        redirect: '/analyze/heatmap-analyze',
      },
      {
        path: '/analyze/heatmap-analyze',
        name: 'heatmap-analyze',
        component: './analyze/heatmap-analyze',
      },
      {
        path: '/analyze/area-analyze',
        name: 'area-analyze',
        component: './analyze/area-analyze',
      },
    ],
  },
  {
    path: '/warning-manage',
    name: 'warning-manage',
    icon: 'warning',
    routes: [
      {
        path: '/warning-manage',
        redirect: '/warning-manage/board',
      },
      {
        path: '/warning-manage/board',
        name: 'board',
        component: './warning-manage/board',
      },
      {
        path: '/warning-manage/warning-info',
        name: 'warning-info',
        component: './warning-manage/warning-info',
      },
    ],
  },
  {
    path: '/personnel-manage',
    name: 'personnel-manage',
    icon: 'team',
    routes: [
      {
        path: '/personnel-manage',
        redirect: '/personnel-manage/organization',
      },
      {
        path: '/personnel-manage/organization',
        name: 'organization',
        component: './personnel-manage/organization',
      },
      {
        path: '/personnel-manage/personnel-classification',
        name: 'personnel-classification',
        component: './personnel-manage/personnel-classification',
      },
      {
        path: '/personnel-manage/personnel-info',
        name: 'personnel-info',
        component: './personnel-manage/personnel-info',
      },
      {
        path: '/personnel-manage/regional-statistics',
        name: 'regional-statistics',
        component: './personnel-manage/regional-statistics',
      },
    ],
  },
  {
    path: '/system',
    name: 'system',
    icon: 'setting',
    routes: [
      {
        path: '/system',
        redirect: '/system/fence-manage',
      },
      {
        path: '/system/fence-manage',
        name: 'fence-manage',
        component: './system/fence-manage',
      },
      {
        path: '/system/map-setup',
        name: 'map-setup',
        component: './system/map-setup',
      },
      {
        path: '/system/map-setup/floor-manager.page/:buildingId',
        name: 'floor-manager',
        hideInMenu: true,
        component: './system/map-setup/floor-manager.page',
      },
      {
        path: '/system/general-setting',
        name: 'general-setting',
        component: './system/general-setting',
      },
    ],
  },
  {
    path: '/map-manage',
    name: 'map-manage',
    icon: 'crown',
    // access: 'canAdmin',
    routes: [
      {
        path: '/map-manage',
        redirect: '/map-manage/fence-manage',
      },
      {
        path: '/map-manage/fence-manage',
        name: 'fence-manage',
        component: './map-manage/fence-manage',
      },
      {
        path: '/map-manage/track-manage',
        name: 'track-manage',
        component: './map-manage/track-manage',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
