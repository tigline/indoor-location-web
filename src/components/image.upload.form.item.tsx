import { getFileBase64, getFileText } from '@/utils/global.utils';
import { ProFormUploadButton, ProFormUploadButtonProps } from '@ant-design/pro-components';
import { RcFile } from 'antd/es/upload';

export function ImageUploadFormItem(props: ProFormUploadButtonProps) {
  return (
    <ProFormUploadButton
      accept="image/png"
      max={1}
      {...props}
      fieldProps={{
        customRequest(options) {
          if (props.accept === 'image/svg+xml') {
            getFileText(options.file as RcFile).then((res) => {
              options.onSuccess?.(res);
            });
          } else {
            getFileBase64(options.file as RcFile).then((res) => {
              options.onSuccess?.(res);
            });
          }
        },
      }}
    ></ProFormUploadButton>
  );
}
