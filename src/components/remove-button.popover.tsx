import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, ButtonProps, Popconfirm, PopconfirmProps } from 'antd';

interface IProps extends Omit<ButtonProps, 'title' | 'color'>, Partial<PopconfirmProps> {
  onClick?: () => void;
}
/**
 * 通用删除组件
 * @param props
 * @returns
 */
export function RemoveButtonPopover(props: IProps) {
  const intl = useIntl();
  return (
    <Popconfirm
      title={
        props.title ??
        intl.formatMessage({
          id: 'app.remove.confirm.title',
          defaultMessage: '你确定要删除此项吗?',
        })
      }
      description={
        props.title ??
        intl.formatMessage({ id: 'app.remove.confirm.description', defaultMessage: '删除此项' })
      }
      okButtonProps={{
        loading: props.loading,
      }}
      getPopupContainer={props.getPopupContainer}
      onConfirm={() => props?.onClick?.()}
    >
      <Button type={props.type ?? 'link'} size={props.size ?? 'small'} disabled={props.disabled}>
        <FormattedMessage id="app.remove" defaultMessage="删除" />
      </Button>
    </Popconfirm>
  );
}
