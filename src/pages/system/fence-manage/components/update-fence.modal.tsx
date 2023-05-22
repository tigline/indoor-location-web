import { convertLtoCM } from '@/components/map-components/antd-L7-component';
import { convertCMtoL } from '@/components/map-components/convert';
import { FenceL7Components } from '@/components/map-components/fence-L7-components';
import { SelectMapSelect } from '@/components/select-map.select';
import { updateFence } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import {
  ModalForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { DrawPolygon } from '@antv/l7-draw';
import { Feature } from '@turf/turf';
import { useIntl, useModel, useRequest } from '@umijs/max';
import { Button, Form } from 'antd';
import { Polygon } from 'geojson';
import { compact, isEmpty } from 'lodash';
import React from 'react';

interface IProps {
  refresh?: () => void;
  record: API.FenceAndMapInfo;
}

export function UpdateFenceModal(props: IProps) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { run, data } = useModel('mapModel');
  React.useEffect(() => {
    run();
  }, []);
  const drawRef = React.useRef<DrawPolygon>();
  const initData = React.useMemo<Feature<Polygon>[] | undefined>(() => {
    const map = data?.find((s) => s.mapId === props.record.mapId);
    const coordinates = props.record.points?.map(({ x, y }) => {
      return convertCMtoL([x, y], map?.width ?? 0);
    });
    if (isEmpty(coordinates)) {
      return;
    }
    return compact([
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates ?? []],
        },
      },
    ]);
  }, []);
  const { run: update } = useRequest(updateFence, {
    manual: true,
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
        id: 'pages.system.fence-manage.update',
        defaultMessage: '更新围栏',
      })}
      layout="horizontal"
      form={form}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      trigger={
        <Button type="link" size="small">
          {intl.formatMessage({ id: 'app.edit', defaultMessage: '编辑' })}
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
              const [x, y] = convertLtoCM([lng, lat], map?.width);
              return { x, y };
            });
          }) ?? [];
        console.log(points);
        return Promise.all(
          points.map((item) => {
            return update({ fenceId: props.record.fenceId! }, { ...values, points: item });
          }),
        ).then((arr) => {
          return arr.reduce((prev, next) => prev && next.code === OK, true);
        });
      }}
    >
      <SelectMapSelect
        initialValue={props.record.mapId}
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
        initialValue={props.record.name}
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
      />
      <ProFormSelect
        initialValue={props.record.type}
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
      />
      <ProFormDependency name={['mapId']}>
        {({ mapId }) => {
          const map = data?.find((s) => s.mapId === mapId);
          // if (!map) {
          //   return false;
          // }
          return (
            <FenceL7Components
              drawRef={drawRef}
              initialData={initData}
              map={map?.picture}
              drawEnable
              rect={[map?.length, map?.width]}
            />
          );
        }}
      </ProFormDependency>
    </ModalForm>
  );
}
