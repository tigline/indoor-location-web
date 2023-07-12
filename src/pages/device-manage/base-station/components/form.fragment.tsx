import { SelectMapSelect } from '@/components/select-map.select';
import { SelectVendor } from '@/components/select-personnel-tag.select';
import { ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useState } from 'react';

interface IProps {
  // children: JSX.Element;
  refresh?: () => void;
  record?: API.GatewayInfo;
  isEdit?: boolean;
}
export function BaseStationFormFragment(props: IProps) {
  const intl = useIntl();

  const [companyCode, setCompanyCode] = useState<string | undefined>(props.record?.companyCode);
  const [mapId, setMapId] = useState<string | undefined>(props.record?.mapId);

  const handleCompanyCodeChange = (newCompanyCode: string | undefined) => {
    setCompanyCode(newCompanyCode);
    // 当 companyCode 改变时，重置 mapId
    setMapId(undefined);
  };

  return (
    <React.Fragment>
      {/* <ProFormText
        width="lg"
        name="name"
        initialValue={props.record?.name}
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.name',
          defaultMessage: '设置名称',
        })}
      /> */}
      <SelectVendor
        width="lg"
        name='companyCode'
        fieldProps={{ disabled: props.isEdit}}
        initialValue={companyCode}
        onValueChange={handleCompanyCodeChange}
        label={intl.formatMessage({
          id: 'pages.device-manage.base-vendor.name',
          defaultMessage: '厂商',
        })}
        rules={[
          {
            required: true,
            // message: intl.formatMessage({
            //   id: 'pages.device-manage.label.device.mac.required.failure',
            //   defaultMessage: '物理地址必填',
            // }),
          }
        ]}
      />
      <ProFormText
        width="lg"
        name="gateway"
        fieldProps={{ disabled: props.isEdit}}
        initialValue={props.record?.gateway}
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.deviceId',
          defaultMessage: '设备ID',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.device-manage.label.device.deviceId',
              defaultMessage: '设备ID',
            }),
          },
        ]}
      />
      {/* <ProFormText
        width="lg"
        name="productName"
        initialValue={props.record?.productName}
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.productName',
          defaultMessage: '产品名称',
        })}
      /> */}
      <ProFormDigit
        width="lg"
        name="setX"
        max={9999}
        initialValue={props.record?.setX}
        fieldProps={{ precision: 2 }}
        label={intl.formatMessage({
          id: 'pages.device-manage.base-station.device.setX',
          defaultMessage: '基站X坐标',
        })}
      />
      <ProFormDigit
        width="lg"
        name="setY"
        max={9999}
        initialValue={props.record?.setY}
        fieldProps={{ precision: 2 }}
        label={intl.formatMessage({
          id: 'pages.device-manage.base-station.device.setY',
          defaultMessage: '基站Y坐标',
        })}
      />
      <ProFormDigit
        width="lg"
        name="setZ"
        max={9999}
        initialValue={props.record?.setZ}
        fieldProps={{ precision: 2 }}
        label={intl.formatMessage({
          id: 'pages.device-manage.base-station.device.setZ',
          defaultMessage: '基站Z坐标',
        })}
      />
      <ProFormDigit
        width="lg"
        name="angle"
        max={9999}
        initialValue={props.record?.angle}
        fieldProps={{ precision: 2 }}
        label={intl.formatMessage({
          id: 'pages.device-manage.base-station.device.angle',
          defaultMessage: '基站角度',
        })}
      />
      <ProFormText
        width="lg"
        name="groupId"
        initialValue={props.record?.groupId}
        label={intl.formatMessage({
          id: 'pages.device-manage.base-station.device.group',
          defaultMessage: '基站分组',
        })}
      />
      <SelectMapSelect
        label={intl.formatMessage({
          id: 'pages.device-manage.label.device.map',
          defaultMessage: '地图',
        })}
        companyCode={companyCode}
        initialValue={mapId}
      />
    </React.Fragment>
  );
}
