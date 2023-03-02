import { ImageUploadFormItem } from '@/components/image.upload.form.item';
import { updateMap } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useModel } from '@umijs/max';
import { Button, Form, notification } from 'antd';
import { UploadFile } from 'antd/es/upload';
import { first } from 'lodash';
interface IProps {
  refresh?: () => void;
  disabled?: boolean;
  record: API.MapInfo;
}
/**
 * 功能 模态框
 *
 * @export
 * @param {IProps} props
 * @return {JSX.Element}
 */
export function EditMapModal(props: IProps): JSX.Element {
  const intl = useIntl();
  const { buildingId, mapId } = props.record;
  const [form] = Form.useForm();
  const { run } = useModel('mapModel');
  return (
    <ModalForm<Omit<API.AddOrUpdateMapInfo, 'picture'> & { picture: UploadFile[] }>
      title={<FormattedMessage id="pages.system.map-setup.map.edit" defaultMessage="添加地图" />}
      layout="horizontal"
      form={form}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 16 }}
      disabled={!buildingId}
      onFinish={(values) => {
        const picture = first(values.picture)?.response;
        return updateMap({ mapId: mapId! }, { ...values, buildingId: buildingId!, picture }).then(
          (res) => {
            if (res.code === OK) {
              props.refresh?.();
              // 强制刷新缓存
              run(true);
              notification.success({
                message: intl.formatMessage({
                  id: 'app.edit.success',
                  defaultMessage: '更新成功',
                }),
              });
            }
            return res.code === OK;
          },
        );
      }}
      trigger={
        <Button type="link" size="small">
          {intl.formatMessage({ id: 'app.edit', defaultMessage: '编辑' })}
        </Button>
      }
    >
      <ProFormText
        width="lg"
        name="name"
        initialValue={props.record.name}
        label={intl.formatMessage({
          id: 'pages.system.map-setup.map.name',
          defaultMessage: '地图名称',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.map.name.required.failure',
              defaultMessage: '地图名必填',
            }),
          },
        ]}
      />
      <ProFormText
        width="lg"
        name="floor"
        initialValue={props.record.floor}
        label={intl.formatMessage({
          id: 'pages.system.map-setup.map.floor',
          defaultMessage: '楼层',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.map.floor.required.failure',
              defaultMessage: '楼层必填',
            }),
          },
        ]}
      />
      <ProFormDigit
        width="lg"
        name="width"
        initialValue={props.record.width}
        label={intl.formatMessage({
          id: 'pages.system.map-setup.map.width',
          defaultMessage: '实际宽度',
        })}
        addonAfter={intl.formatMessage({ id: 'app.unit.m', defaultMessage: '米' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.map.width.required.failure',
              defaultMessage: '实际宽度必填',
            }),
          },
        ]}
      ></ProFormDigit>
      <ProFormDigit
        width="lg"
        name="length"
        initialValue={props.record.length}
        label={intl.formatMessage({
          id: 'pages.system.map-setup.map.length',
          defaultMessage: '实际长度',
        })}
        addonAfter={intl.formatMessage({ id: 'app.unit.m', defaultMessage: '米' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.map.length.required.failure',
              defaultMessage: '实际长度必填',
            }),
          },
        ]}
      ></ProFormDigit>
      <ImageUploadFormItem
        width="lg"
        name="picture"
        initialValue={
          [
            {
              uid: Date.now() + '',
              response: props.record?.picture,
              thumbUrl: props.record?.picture,
            },
          ] as UploadFile<any>[]
        }
        // accept="image/svg+xml"
        label={intl.formatMessage({
          id: 'pages.system.map-setup.building.picture',
          defaultMessage: '示意图',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.map-setup.building.picture.required.failure',
              defaultMessage: '示意图必填',
            }),
          },
        ]}
      />
    </ModalForm>
  );
}
