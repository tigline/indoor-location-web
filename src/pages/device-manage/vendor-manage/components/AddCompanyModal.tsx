import { addCompany } from '@/services/swagger/vendorguanli';
import { uuidv4 } from '@/utils/common.functions';
import { OK } from '@/utils/global.utils';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Form, Row, notification } from 'antd';
import { useState } from 'react';
import { FormattedMessage } from 'umi';

interface IProps {
    // children: JSX.Element;
    refresh?: () => void;
}

/**
 * 功能 模态框
 *
 * @export
 * @param {IProps} props
 * @return {JSX.Element}
 */
export function AddCompanyModal(props: IProps): JSX.Element {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [uuid, setUuid] = useState("");

    return (
        <ModalForm<API.AddOrUpdateCompanyInfo>
            title={<FormattedMessage id="pages.device-manage.vendor.add" defaultMessage="添加厂商" />}
            layout="horizontal"
            form={form}
            labelCol={{ xs: 6 }}
            wrapperCol={{ xs: 16 }}
            width={550}
            onFinish={(values) => {
                return addCompany({ ...values, companyCode: values.companyCode, companyName: values.companyName! }).then((res) => {
                    props.refresh?.();
                    if (res.code === OK) {
                        notification.success({
                            message: intl.formatMessage({ id: 'app.add.success', defaultMessage: '新建成功' }),
                        });
                    }
                    return res.code === OK;
                });
            }}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
            }}
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    {intl.formatMessage({
                        id: 'app.action.add',
                        defaultMessage: '添加',
                    })}
                </Button>
            }
        >
            
                <ProFormText
                    width="lg"
                    name='companyCode'
                    //initialValue={uuid}
                    label={intl.formatMessage({
                        id: 'pages.device-manage.base-vendor.code',
                        defaultMessage: '编码',
                    })}
                    rules={[{ required: true, message: '这是必填项' }]}
                    fieldProps={{
                        suffix: (
                            <Button type="default" onClick={() => {
                                const newUuid = uuidv4();
                                form.setFieldsValue({ companyCode: newUuid });
                                //setUuid(uuidv4());
                            }

                            }>
                                {intl.formatMessage({
                                    id: 'pages.device-manage.base-vendor.code.auto',
                                    defaultMessage: '自动生成',
                                })}
                            </Button>
                        ),
                    }}
                />


                <ProFormText
                    width="lg"
                    name='companyName'
                    label={intl.formatMessage({
                        id: 'pages.device-manage.base-station.device.name',
                        defaultMessage: '名称',
                    })}
                    rules={[{ required: true, message: '这是必填项' }]}
                />
            

        </ModalForm>
    );
}
