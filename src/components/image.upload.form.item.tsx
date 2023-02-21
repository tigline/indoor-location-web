import { getFileBase64 } from '@/utils/global.utils';
import { ProFormUploadButton, ProFormUploadButtonProps } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { notification } from 'antd';
import { RcFile } from 'antd/es/upload';

export function ImageUploadFormItem(props: ProFormUploadButtonProps) {
  const intl = useIntl();
  return (
    <ProFormUploadButton
      accept="image/png"
      max={1}
      {...props}
      fieldProps={{
        listType: 'picture-card',
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
    ></ProFormUploadButton>
  );
}
