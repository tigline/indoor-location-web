import { getFileBase64 } from '@/utils/global.utils';
import { ProFormUploadButton, ProFormUploadButtonProps } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Image, Modal, notification } from 'antd';
import { RcFile, UploadFile } from 'antd/es/upload';
import { first, set } from 'lodash';

export function ImageUploadFormItem(props: ProFormUploadButtonProps) {
  const intl = useIntl();
  return (
    <ProFormUploadButton
      accept="image/png"
      max={1}
      transform={(value: any) => {
        const obj = {};
        set(obj, props.name ?? 'picture', first<UploadFile>(value)?.response);
        return obj;
      }}
      {...props}
      fieldProps={{
        listType: 'picture-card',
        onPreview(file) {
          Modal.warning({
            content: <Image width={600} src={file.thumbUrl} />,
            width: 660 - 12,
            icon: ' ',
          });
        },
        customRequest(options) {
          // if (props.accept === 'image/svg+xml') {
          //   getFileText(options.file as RcFile).then((res) => {
          //     options.onSuccess?.(res);
          //   });
          // } else {
          if (options.file.length > 5 * 1000 * 1000) {
            notification.error({
              message: intl.formatMessage({
                id: 'pages.system.map-setup.building.picture.big.failure',
                defaultMessage: '图片太大了，不能超过5M',
              }),
            });
            return;
          }
          getFileBase64(options.file as RcFile).then((res) => {
            options.onSuccess?.(res);
          });
          // }
        },
      }}
    />
  );
}
