import { switchFenceStatus } from '@/services/swagger/xitongguanli';
import { useIntl, useRequest } from '@umijs/max';
import { Button, notification } from 'antd';

interface IProps {
  record: API.FenceAndMapInfo;
  refresh?: () => void;
}
/**
 * 启用/禁用围栏
 *
 * @export
 * @param {IProps} props
 * @return {*}
 */
export function SwitchFenceButton(props: IProps) {
  const intl = useIntl();
  const { run } = useRequest(switchFenceStatus, {
    manual: true,
    onSuccess(data) {
      if (data) {
        notification.success({
          message: intl.formatMessage({ id: 'app.edit.success', defaultMessage: '更新成功' }),
        });
        props.refresh?.();
      }
    },
  });
  if (props.record.enabled) {
    return (
      <Button
        type="link"
        size="small"
        disabled={!props.record.fenceId}
        onClick={() => run({ fenceId: props.record.fenceId! })}
      >
        {intl.formatMessage({
          id: 'pages.system.fence-manage.fence.status.disable',
          defaultMessage: '禁用',
        })}
      </Button>
    );
  }
  return (
    <Button
      type="link"
      size="small"
      disabled={!props.record.fenceId}
      onClick={() => run({ fenceId: props.record.fenceId! })}
    >
      {intl.formatMessage({
        id: 'pages.system.fence-manage.fence.status.enable',
        defaultMessage: '启用',
      })}
    </Button>
  );
}
