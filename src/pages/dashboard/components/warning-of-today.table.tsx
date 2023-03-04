import { ProCard } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Table } from 'antd';
import { chain, first } from 'lodash';
import React from 'react';

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
interface IProps {
  data: API.AlarmInfo[];
  loading?: boolean;
}
/**
 * 今日告警 列表展示
 *
 * @export
 * @return {*}
 */
export function WarningOfTodayTable(props: IProps) {
  const intl = useIntl();
  const { total, unprocessed, processed, datasource } = React.useMemo(() => {
    return {
      total: props.data.length ?? 0,
      unprocessed: props.data.filter((f) => f.status === 'Unprocessed').length ?? 0,
      processed: props.data.filter((f) => f.status === 'Processed').length ?? 0,
      datasource: chain(props.data ?? [])
        .groupBy((o) => o.alarmId)
        .mapValues((o) => ({ name: first(o)?.alarmId, count: o.length }))
        .map((item, key) => ({
          key,
          name: item.name,
          count: item.count,
        }))
        .value(),
    };
  }, [props.data]);
  return (
    <div style={contentStyle}>
      <ProCard split="horizontal">
        <ProCard split="vertical">
          <ProCard
            layout="center"
            headerBordered
            title={intl.formatMessage({
              id: 'pages.alarm.total',
              defaultMessage: '告警数量',
            })}
          >
            {total}
          </ProCard>
          <ProCard
            layout="center"
            headerBordered
            title={intl.formatMessage({
              id: 'pages.system.warning-manage.board.processed',
              defaultMessage: '已处理',
            })}
          >
            {processed}
          </ProCard>
          <ProCard
            layout="center"
            headerBordered
            title={intl.formatMessage({
              id: 'pages.system.warning-manage.board.unprocessed',
              defaultMessage: '未处理',
            })}
          >
            {unprocessed}
          </ProCard>
        </ProCard>
        <ProCard bodyStyle={imageCardStyle}>
          <Table
            size="small"
            dataSource={datasource}
            pagination={false}
            scroll={{ x: '100', y: 200 }}
            columns={[
              {
                title: intl.formatMessage({ id: 'pages.alarm.ranking', defaultMessage: '排名' }),
                render(_, __, index) {
                  return `NO.${index + 1}`;
                },
              },
              {
                title: intl.formatMessage({ id: 'pages.alarm.label', defaultMessage: '告警标签' }),
                render(_, record) {
                  return record.name;
                },
              },
              {
                title: intl.formatMessage({
                  id: 'pages.alarm.label.count',
                  defaultMessage: '告警数量',
                }),
                render(_, record) {
                  return record.count;
                },
              },
            ]}
          />
        </ProCard>
      </ProCard>
    </div>
  );
}
