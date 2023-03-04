import equipment from '@/assets/images/box.png';
import personnel from '@/assets/images/personnel.png';
import stuff from '@/assets/images/stuff.png';
import vehicle from '@/assets/images/vehicle.png';
import { ProCard } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Image } from 'antd';
import Slider from 'react-slick';
import { LabelDistribution } from '../..';
import './slick-theme.min.css';
import './slick.min.css';
// import './goods-count.statistic.less';

interface IProps {
  data?: LabelDistribution;
}
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
export function GoodsCountStatistic(props: IProps) {
  const { data } = props;
  const intl = useIntl();
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

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
                id: 'pages.dashboard.equipment.count',
                defaultMessage: '物资数量',
              })}
            >
              {data?.Equipment.total}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.online.count',
                defaultMessage: '在线数量',
              })}
            >
              {data?.Equipment.online}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.offline.count',
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
                id: 'pages.dashboard.vehicle.count',
                defaultMessage: '车辆数量',
              })}
            >
              {data?.Vehicle.total}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.online.count',
                defaultMessage: '在线数量',
              })}
            >
              {data?.Vehicle.online}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.offline.count',
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
                id: 'pages.dashboard.stuff.count',
                defaultMessage: '物资数量',
              })}
            >
              {data?.Stuff.total}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.online.count',
                defaultMessage: '在线数量',
              })}
            >
              {data?.Stuff.online}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.offline.count',
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
                id: 'pages.dashboard.personnel.count',
                defaultMessage: '人员数量',
              })}
            >
              {data?.Personnel.total}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.online.count',
                defaultMessage: '在线数量',
              })}
            >
              {data?.Personnel.online}
            </ProCard>
            <ProCard
              title={intl.formatMessage({
                id: 'pages.dashboard.offline.count',
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
