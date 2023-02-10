import { updateUserInfo } from '@/services/swagger/yonghuguanli';
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useModel, useRequest } from '@umijs/max';
import { notification } from 'antd';
import React from 'react';

interface FormPropType {
  nickname?: string;
  // username?: string;
  // password?: string;
  // confirm?: string;
  email?: string;
  phone?: string;
}

export default function Page() {
  const formRef = React.useRef<ProFormInstance<FormPropType>>();
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const { run } = useRequest(updateUserInfo, {
    manual: true,
    onSuccess(data) {
      if (data) {
        notification.success({
          message: intl.formatMessage({
            id: 'pages.account.update.success',
            defaultMessage: '更新用户信息成功',
          }),
        });
      }
    },
  });
  return (
    <PageContainer
      title={intl.formatMessage({ id: 'pages.account.update', defaultMessage: '更新用户信息' })}
      // subTitle={intl.formatMessage({ id: '更新用户信息' })}
    >
      <ProForm
        formRef={formRef}
        style={{ maxWidth: 520 }}
        onFinish={(values) => {
          if (currentUser?.userId) {
            return run({ userId: currentUser?.userId }, values);
          } else {
            notification.error({
              message: intl.formatMessage({
                id: 'pages.account.userId.failure',
                defaultMessage: '用户ID不能为空',
              }),
            });
            return Promise.reject();
          }
        }}
      >
        <ProFormText
          name="username"
          fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
          placeholder={intl.formatMessage({
            id: 'pages.login.username',
            defaultMessage: '用户名',
          })}
          disabled
          initialValue={currentUser?.username}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.login.username.required"
                  defaultMessage="请输入用户名!"
                />
              ),
            },
          ]}
        />
        <ProFormText
          name="nickname"
          placeholder={intl.formatMessage({
            id: 'pages.register.nickname',
            defaultMessage: '昵称',
          })}
          initialValue={currentUser?.nickname}
          fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage id="pages.login.nickname.required" defaultMessage="请输入昵称!" />
              ),
            },
          ]}
        />

        {/* <ProFormText.Password
          name="password"
          placeholder={intl.formatMessage({
            id: 'pages.register.password.placeholder',
            defaultMessage: '至少6位密码，区分大小写',
          })}
          fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
          dependencies={['confirm']}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.login.password.required"
                  defaultMessage="请输入密码！"
                />
              ),
            },
          ]}
        />
        <ProFormText.Password
          name="confirm"
          placeholder={intl.formatMessage({
            id: 'pages.register.confirm',
            defaultMessage: '确认密码',
          })}
          fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
          dependencies={['password']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!'),
                );
              },
            }),
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.login.password.required"
                  defaultMessage="请输入密码！"
                />
              ),
            },
          ]}
        /> */}
        <ProFormText
          name="email"
          placeholder={intl.formatMessage({ id: 'pages.register.email', defaultMessage: '邮箱' })}
          fieldProps={{ size: 'large', prefix: <MailOutlined /> }}
          initialValue={currentUser?.email}
          rules={[
            {
              type: 'email',
              message: (
                <FormattedMessage id="pages.register.email.required" defaultMessage="请输入邮箱!" />
              ),
            },
          ]}
        />
        <ProFormText
          name="phone"
          placeholder={intl.formatMessage({ id: 'pages.register.phone', defaultMessage: '手机' })}
          fieldProps={{ size: 'large', prefix: <PhoneOutlined /> }}
          initialValue={currentUser?.phone}
          rules={[
            {
              pattern: /^\d+$/,
              message: (
                <FormattedMessage
                  id="pages.register.phone.required"
                  defaultMessage="请输入手机号!"
                />
              ),
            },
          ]}
        />
      </ProForm>
    </PageContainer>
  );
}
