import { MapL7Component } from '@/components/map-components/map-L7-components';
import { ModalForm } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useModel } from '@umijs/max';
import { Button } from 'antd';
import React from 'react';

interface IProps {
  record: API.FenceAndMapInfo;
}
/**
 * 查看地图
 *
 * @export
 * @param {IProps} props
 * @return {*}
 */
export function ViewMapModal(props: IProps) {
  const intl = useIntl();
  const { run, data } = useModel('mapModel');
  React.useEffect(() => {
    run();
  }, []);
  const map = data?.find((f) => f.mapId === props.record.mapId);

  return (
    <ModalForm
      title={intl.formatMessage({
        id: 'pages.system.map-setup.map.view',
        defaultMessage: '查看地图',
      })}
      submitter={false}
      trigger={
        <Button type="link" size="small">
          <FormattedMessage id="app.view" defaultMessage="预览" />
        </Button>
      }
    >
      <MapL7Component map={map?.picture} rect={[map?.length, map?.width]} />
    </ModalForm>
  );
}
