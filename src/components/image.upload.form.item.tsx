import { getFileBase64, getFileText } from '@/utils/global.utils';
import { ProFormUploadButton, ProFormUploadButtonProps } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Image, Modal, notification } from 'antd';
import { RcFile, UploadFile } from 'antd/es/upload';
import { first, set } from 'lodash';
import { uploadFile } from '@/services/swagger/xitongguanli';

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
        
        customRequest: async (options) => {
          const { file } = options;
          const formData = new FormData();
          formData.append("file", file);
          // 调用你的 uploadFile 函数
          try {
            const result = await uploadFile(formData);
            
            console.log(result);
            // 根据你的 uploadFile 函数的返回值进行下一步操作
            // 例如，你可能需要在这里调用 options.onSuccess 或 options.onError
            options.onSuccess?.(result.data.url)
            
          } catch (error) {
            console.log(error);
            //options.onError?.(error ?? new Error('上传失败'));
          }
        },
        
      }}
    />
  );
}


          // if (props.accept === 'image/svg+xml') {
          //   getFileText(options.file as RcFile).then((res) => {
          //     options.onSuccess?.(res);
          //   });
          // } else {
          // if (options.file.length > 5 * 1000 * 1000) {
          //   notification.error({
          //     message: intl.formatMessage({
          //       id: 'pages.system.map-setup.building.picture.big.failure',
          //       defaultMessage: '图片太大了，不能超过5M',
          //     }),
          //   });
          //   return;
          // }
          // getFileBase64(options.file as RcFile).then((res) => {
          //   options.onSuccess?.(res);
          // });
          // }