import { AntdL7Component, convertLtoCM } from '@/components/map-components/antd-L7-component';
import { SelectMapSelect } from '@/components/select-map.select';
import { addFence } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { DrawPolygon } from '@antv/l7-draw';
import { useIntl, useModel, useRequest } from '@umijs/max';
import { Button } from 'antd';
import React from 'react';

interface IProps {
  refresh?: () => void;
}
export function AddFenceModal(props: IProps) {
  const intl = useIntl();
  const { run, data } = useModel('mapModel');
  React.useEffect(() => {
    run();
  }, []);
  const drawRef = React.useRef<DrawPolygon>();
  const { run: add } = useRequest(addFence, {
    manual: true,
    fetchKey: (o) => o.mapId,
    formatResult: (res) => res,
    onSuccess(res) {
      if (res.code === OK) {
        props.refresh?.();
      }
    },
  });
  return (
    <ModalForm<API.AddOrUpdateFenceInfo>
      title={intl.formatMessage({
        id: 'pages.system.fence-manage.add',
        defaultMessage: '添加围栏',
      })}
      layout="horizontal"
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          {intl.formatMessage({ id: 'app.action.add', defaultMessage: '新建' })}
        </Button>
      }
      onFinish={(values) => {
        const polygons = drawRef.current?.getPolygonData();
        const map = data?.find((s) => s.mapId === values.mapId);
        const points =
          polygons?.map((item) => {
            const coordinate = item.geometry.coordinates?.[0];
            return coordinate.map((v) => {
              const [lng, lat] = v ?? [];
              const [x, y] = convertLtoCM([lng, lat], map?.length);
              return { x, y };
            });
          }) ?? [];
        console.log(points);
        return Promise.all(
          points.map((item) => {
            return add({ ...values, points: item });
          }),
        ).then((arr) => {
          return arr.reduce((prev, next) => prev && next.code === OK, true);
        });
      }}
    >
      <SelectMapSelect
        label={intl.formatMessage({
          id: 'pages.system.fence-manage.add.map.select',
          defaultMessage: '地图选择',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.fence-manage.add.map.select.required.failure',
              defaultMessage: '请选择地图',
            }),
          },
        ]}
      />
      <ProFormText
        label={intl.formatMessage({
          id: 'pages.system.fence-manage.fence.name',
          defaultMessage: '围栏名称',
        })}
        name="name"
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.fence-manage.fence.name.required.failure',
              defaultMessage: '请填写围栏名称',
            }),
          },
        ]}
      ></ProFormText>
      <ProFormSelect
        label={intl.formatMessage({
          id: 'pages.system.fence-manage.fence.type',
          defaultMessage: '围栏类型',
        })}
        name="type"
        valueEnum={{
          In: intl.formatMessage({
            id: 'pages.system.fence-manage.fence.type.in',
            defaultMessage: '进入',
          }),
          Out: intl.formatMessage({
            id: 'pages.system.fence-manage.fence.type.out',
            defaultMessage: '离开',
          }),
        }}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.fence-manage.fence.type.required.failure',
              defaultMessage: '请选择围栏类型',
            }),
          },
        ]}
      ></ProFormSelect>
      <ProFormDependency name={['mapId']}>
        {({ mapId }) => {
          const map = data?.find((s) => s.mapId === mapId);
          // if (!map) {
          //   return false;
          // }
          return (
            <AntdL7Component
              drawRef={drawRef}
              map={map?.picture}
              drawEnable
              rect={[map?.width, map?.length]}
            />
          );
        }}
      </ProFormDependency>
    </ModalForm>
  );
}
