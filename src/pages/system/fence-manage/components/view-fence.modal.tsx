import { AntdL7Component } from '@/components/map-components/antd-L7-component';
import { ModalForm } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useModel } from '@umijs/max';
import { Button } from 'antd';

interface IProps {
  record: API.FenceAndMapInfo;
}
/**
 * 查看电子围栏
 *
 * @export
 * @param {IProps} props
 * @return {*}
 */
export function ViewFenceModal(props: IProps) {
  const intl = useIntl();
  const { data } = useModel('mapModel');
  const map = data?.find((f) => f.mapId === props.record.mapId);

  return (
    <ModalForm
      title={intl.formatMessage({
        id: 'pages.system.fence-manage.view',
        defaultMessage: '查看围栏',
      })}
      submitter={false}
      trigger={
        <Button type="link" size="small">
          <FormattedMessage id="app.view" defaultMessage="查看" />
        </Button>
      }
    >
      <AntdL7Component map={map?.picture} rect={[map?.width, map?.length]} fence={props.record} />
    </ModalForm>
  );
}
