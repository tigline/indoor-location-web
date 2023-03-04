import { ProCard } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Table } from 'antd';

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: 'calc(400px - 48px)',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  // background: '#364d79',
  // backgroundColor: 'gray',
};
const imageCardStyle: React.CSSProperties = {
  // display: 'flex',
  // justifyContent: 'center',
  // alignItems: 'center',
  minHeight: 250,
  padding: 0,
};
/**
 * 今日告警 列表展示
 *
 * @export
 * @return {*}
 */
export function WarningOfTodayTable() {
  const intl = useIntl();
  return (
    <div style={contentStyle}>
      <ProCard split="horizontal">
        <ProCard split="vertical">
          <ProCard
            title={intl.formatMessage({
              id: 'pages.alarm.total',
              defaultMessage: '告警数量',
            })}
          >
            {/* FIXME: 修复数量  */}
            {3338}
          </ProCard>
          <ProCard
            title={intl.formatMessage({
              id: 'pages.system.warning-manage.board.processed',
              defaultMessage: '已处理',
            })}
          >
            {/* FIXME: 修复数量  */}
            {120}
          </ProCard>
          <ProCard
            title={intl.formatMessage({
              id: 'pages.system.warning-manage.board.unprocessed',
              defaultMessage: '未处理',
            })}
          >
            {/* FIXME: 修复数量  */}
            {2200}
          </ProCard>
        </ProCard>
        <ProCard bodyStyle={imageCardStyle}>
          <Table
            size="small"
            columns={[
              { title: intl.formatMessage({ id: 'pages.alarm.ranking', defaultMessage: '排名' }) },
              {
                title: intl.formatMessage({ id: 'pages.alarm.label', defaultMessage: '告警标签' }),
              },
              {
                title: intl.formatMessage({
                  id: 'pages.alarm.label.count',
                  defaultMessage: '告警数量',
                }),
              },
            ]}
          />
        </ProCard>
      </ProCard>
    </div>
  );
}
