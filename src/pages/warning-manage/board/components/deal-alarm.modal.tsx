import { AlarmsL7Component } from '@/components/map-components/alarms-L7-component';
import { dealWithAlarm } from '@/services/swagger/gaojingguanli';
import { getFence } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import { ModalForm } from '@ant-design/pro-components';
import { useIntl, useModel, useRequest } from '@umijs/max';
import useControllableValue from 'ahooks/lib/useControllableValue';
import { Button, notification } from 'antd';
import React from 'react';

interface IProps {
  record?: API.AlarmInfo;
  onDestroy?: () => void;
  open?: boolean;
  setOpen?: (e: boolean) => void;
  refresh?: () => void;
}
/**
 * 展示告警坐标
 *
 * @export
 * @param {IProps} props
 * @return {*}
 */
export function DealAlarmModal(props: IProps) {
  const intl = useIntl();
  const { run: getFenceById, data: fence } = useRequest(getFence, { manual: true });
  const { run: deal, fetches: dealFetches } = useRequest(dealWithAlarm, {
    manual: true,
    fetchKey: (o) => o.alarmId + '',
    formatResult: (res) => res,
    onSuccess(res) {
      if (res.code === OK) {
        notification.success({
          message: intl.formatMessage({
            id: 'pages.system.warning-manage.board.deal.success',
            defaultMessage: '处理警告成功',
          }),
        });
        props.refresh?.();
      }
    },
  });

  const [open, setOpen] = useControllableValue(props, {
    trigger: 'setOpen',
    valuePropName: 'open',
  });
  const { run, data } = useModel('mapModel');
  React.useEffect(() => {
    run();
    if (open && props.record?.fenceId) {
      getFenceById({ fenceId: props.record?.fenceId });
    }
  }, [open]);
  const map = data?.find((f) => f.mapId === props.record?.mapId);

  if (!props.record) {
    return <></>;
  }
  return (
    <ModalForm
      open={open}
      title={intl.formatMessage({
        id: 'pages.system.warning-manage.board.deal',
        defaultMessage: '处理告警',
      })}
      onOpenChange={(o) => setOpen(o)}
      modalProps={{ maskClosable: false }}
      submitter={{
        render() {
          return (
            <>
              <Button
                loading={dealFetches?.[props.record!.alarmId!]?.loading}
                type="primary"
                disabled={!props.record?.alarmId}
                onClick={() =>
                  deal({ alarmId: props.record!.alarmId!, status: 'Processed' }).then((res) =>
                    setOpen(!res.data),
                  )
                }
              >
                {intl.formatMessage({
                  id: 'pages.system.warning-manage.board.deal',
                  defaultMessage: '处理告警',
                })}
              </Button>
              <Button
                loading={dealFetches?.[props.record!.alarmId!]?.loading}
                disabled={!props.record?.alarmId}
                onClick={() =>
                  deal({ alarmId: props.record!.alarmId!, status: 'Ignored' }).then((res) =>
                    setOpen(!res.data),
                  )
                }
              >
                {intl.formatMessage({
                  id: 'pages.system.warning-manage.board.ignored',
                  defaultMessage: '忽略',
                })}
              </Button>
            </>
          );
        },
      }}
      trigger={
        props.setOpen === undefined ? (
          <Button type="link" size="small" onClick={props.onDestroy}>
            {intl.formatMessage({
              id: 'pages.system.warning-manage.board.deal',
              defaultMessage: '处理告警',
            })}
          </Button>
        ) : undefined
      }
    >
      <AlarmsL7Component
        map={map?.picture}
        rect={[map?.length, map?.width]}
        alarms={[props.record]}
        fence={fence}
        // locations={[]}
      />
    </ModalForm>
  );
}
