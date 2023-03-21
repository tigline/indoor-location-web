import { ILocation } from '@/models/messageSocket';
import { DealAlarmModal } from '@/pages/warning-manage/board/components/deal-alarm.modal';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { SelectLang, useIntl, useModel } from '@umijs/max';
import { ReadyState } from 'ahooks/lib/useWebSocket';
import { Button, notification, Space } from 'antd';
import React from 'react';
import { v4 } from 'uuid';
import Avatar from './AvatarDropdown';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const intl = useIntl();
  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<API.AlarmInfo>();
  const { readyState, connect, data } = useModel('messageSocket');
  React.useEffect(() => {
    if (ReadyState.Closed === readyState) {
      connect?.();
    }
  }, [readyState]);
  React.useEffect(() => {
    const key = v4();
    if (data) {
      const res = JSON.parse(data) as ILocation;
      if (res.type === 'Alarm') {
        const alarm = res.data as API.AlarmInfo;
        api.warning({
          message: intl.formatMessage({
            id: 'pages.system.warning-manage.board.title',
            defaultMessage: '围栏告警',
          }),
          key,
          description: alarm.content,
          // description: 'hello 非法闯入',
          btn: (
            <Space>
              <Button type="link" size="small" onClick={() => api.destroy()}>
                {intl.formatMessage({
                  id: 'pages.system.warning-manage.board.ignored',
                  defaultMessage: '忽略',
                })}
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  api.destroy(key);
                  setOpen(true);
                  setSelected(alarm);
                }}
              >
                {intl.formatMessage({
                  id: 'pages.system.warning-manage.board.deal',
                  defaultMessage: '处理告警',
                })}
              </Button>
            </Space>
          ),
          placement: 'bottomRight',
          duration: 100,
        });
      }
    }
  }, [data]);

  const className = useEmotionCss(() => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      gap: 8,
    };
  });

  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      float: 'right',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      cursor: 'pointer',
      padding: '0 12px',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  return (
    <div className={className}>
      {/* <span
        className={actionClassName}
        onClick={() => {
          window.open('https://pro.ant.design/docs/getting-started');
        }}
      >
        <QuestionCircleOutlined />
      </span> */}
      {contextHolder}
      <DealAlarmModal open={open} setOpen={setOpen} record={selected} />
      <Avatar menu />
      <SelectLang className={actionClassName} />
    </div>
  );
};
export default GlobalHeaderRight;
