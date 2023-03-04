import equipment from '@/assets/images/box.png';
import personnel from '@/assets/images/personnel.png';
import stuff from '@/assets/images/stuff.png';
import vehicle from '@/assets/images/vehicle.png';
import { getBeaconStatusCounts } from '@/services/swagger/shebeiguanli';
import { ProCard } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Image } from 'antd';
import Slider from 'react-slick';
import './slick-theme.min.css';
import './slick.min.css';
// import './goods-count.statistic.less';

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: 'calc(400px - 48px)',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  // background: '#364d79',
  backgroundColor: 'gray',
};
const imageCardStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 250,
};
export function GoodsCountStatistic() {
  const intl = useIntl();
  const { data } = useRequest(getBeaconStatusCounts, {
    // manual: true,
    formatResult(res) {
      type keyType = Required<API.BeaconInfo>['type'];
      return res.data as Record<keyType, { offline: number; online: number; total: number }>;
    },
    onSuccess(data) {
      console.log('不同标签类型的在线状态', data);
    },
  });
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  // return (
  //   <div>
  //     <h2>Fade</h2>
  //     <Slider {...settings}>
  //       <div>
  //         <img src={equipment} />
  //       </div>
  //       <div>
  //         <img src={personnel} />
  //       </div>
  //       <div>
  //         <img src={stuff} />
  //       </div>
  //       <div>
  //         <img src={vehicle} />
  //       </div>
  //     </Slider>
  //   </div>
  // );
  return (
    <Slider {...settings}>
      <div style={contentStyle}>
        <ProCard split="horizontal">
          <ProCard bodyStyle={imageCardStyle}>
            <Image preview={false} src={equipment} width={128} height={128} />
          </ProCard>
          <ProCard split="vertical">
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.goods.count',
                defaultMessage: '物资数量',
              })}
            >
              {data?.Equipment.total}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.goods.online.count',
                defaultMessage: '在线数量',
              })}
            >
              {data?.Equipment.online}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.goods.offline.count',
                defaultMessage: '离线数量',
              })}
            >
              {data?.Equipment.offline}
            </ProCard>
          </ProCard>
        </ProCard>
      </div>
      <div style={contentStyle}>
        <ProCard split="horizontal">
          <ProCard bodyStyle={imageCardStyle}>
            <Image preview={false} src={vehicle} width={128} height={128} />
          </ProCard>
          <ProCard split="vertical">
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.goods.count',
                defaultMessage: '物资数量',
              })}
            >
              {data?.Vehicle.total}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.goods.online.count',
                defaultMessage: '在线数量',
              })}
            >
              {data?.Vehicle.online}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.goods.offline.count',
                defaultMessage: '离线数量',
              })}
            >
              {data?.Vehicle.offline}
            </ProCard>
          </ProCard>
        </ProCard>
      </div>
      <div style={contentStyle}>
        <ProCard split="horizontal">
          <ProCard bodyStyle={imageCardStyle}>
            <Image preview={false} src={stuff} width={128} height={128} />
          </ProCard>
          <ProCard split="vertical">
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.goods.count',
                defaultMessage: '物资数量',
              })}
            >
              {data?.Stuff.total}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.goods.online.count',
                defaultMessage: '在线数量',
              })}
            >
              {data?.Stuff.online}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.goods.offline.count',
                defaultMessage: '离线数量',
              })}
            >
              {data?.Stuff.offline}
            </ProCard>
          </ProCard>
        </ProCard>
      </div>
      <div style={contentStyle}>
        <ProCard split="horizontal">
          <ProCard bodyStyle={imageCardStyle}>
            <Image preview={false} src={personnel} width={128} height={128} />
          </ProCard>
          <ProCard split="vertical">
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.goods.count',
                defaultMessage: '物资数量',
              })}
            >
              {data?.Personnel.total}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.goods.online.count',
                defaultMessage: '在线数量',
              })}
            >
              {data?.Personnel.online}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.goods.offline.count',
                defaultMessage: '离线数量',
              })}
            >
              {data?.Personnel.offline}
            </ProCard>
          </ProCard>
        </ProCard>
      </div>
    </Slider>
  );
}
