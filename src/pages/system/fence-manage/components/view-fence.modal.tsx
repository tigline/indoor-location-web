import { FenceL7Components } from '@/components/map-components/fence-L7-components';
import { ModalForm } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useModel } from '@umijs/max';
import { Button } from 'antd';
import React from 'react';

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
  const { run, data } = useModel('mapModel');
  React.useEffect(() => {
    run();
  }, []);
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
      <FenceL7Components map={map?.picture} rect={[map?.length, map?.width]} fence={props.record} />
    </ModalForm>
  );
}
