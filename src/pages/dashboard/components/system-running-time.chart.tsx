import { getSystemRunningTime } from '@/services/swagger/xitongguanli';
import { useIntl, useRequest } from '@umijs/max';
import { useInterval } from 'ahooks';
import { Space, Typography } from 'antd';
import * as dayjs from 'dayjs';
import zh from 'dayjs/locale/zh-cn';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.locale(zh);
/**
 * 系统运行时间
 *
 * @export
 * @return {*}
 */
export function SystemRunningTimeChart() {
  const intl = useIntl();
  const [now, setNow] = React.useState(Date.now());
  const [sec, setSec] = React.useState<number>();
  const [min, setMin] = React.useState<number>();
  const [hour, setHour] = React.useState<number>();
  const [day, setDay] = React.useState<number>();
  useInterval(() => {
    setNow(Date.now());
  }, 1000);
  const { run, data } = useRequest(getSystemRunningTime, {
    manual: true,
    formatResult(res) {
      return (res.data ?? 0) * 1000;
    },
  });
  React.useEffect(() => {
    run();
  }, []);
  React.useEffect(() => {
    if (data) {
      const elapsed = now - data; // 计算已经过去的时间
      const seconds = Math.floor(elapsed / 1000); // 转换为秒数
      // 计算天、小时、分钟和秒数
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor(seconds / 3600) % 24;
      const minutes = Math.floor(seconds / 60) % 60;
      const remainingSeconds = Math.floor(seconds / 1) % 60;
      // 拼接成字符串
      // const timeString = `${days}天${hours}小时${minutes}分${remainingSeconds}秒`;
      // 输出结果
      // console.log(`已运行 ${timeString}`);
      setDay(days);
      setHour(hours);
      setMin(minutes);
      setSec(remainingSeconds);
    }
  }, [now]);
  return (
    <Space direction="vertical">
      <Typography.Title>
        {intl.formatMessage(
          {
            id: '{days}day {hours}hour {mins}min {secs}sec',
            defaultMessage: '{days}天 {hours}时 {mins}分 {secs}秒',
          },
          {
            days: day,
            hours: hour,
            mins: min,
            secs: sec,
          },
        )}
      </Typography.Title>
    </Space>
  );
}
