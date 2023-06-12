import Footer from '@/components/Footer';
import { register } from '@/services/swagger/dengluxiangguan';
import { OK } from '@/utils/global.utils';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, Helmet, history, SelectLang, useIntl } from '@umijs/max';
import { Button, Col, notification, Row, Typography } from 'antd';
import React from 'react';
import Settings from '../../../../config/defaultSettings';

const Lang = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const Register: React.FC = () => {
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const intl = useIntl();

  const handleSubmit = async (values: API.RegistryInfo & { confirm: string }) => {
    try {
      // 登录
      const { confirm, username, ...rest } = values;

      console.log(confirm);
      const msg = await register({ username, ...rest, nickname: username, email: username });
      if (msg.code === OK && msg.data) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.register.success',
          defaultMessage: '注册成功！',
        });
        notification.success({ message: defaultLoginSuccessMessage });
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      console.log(msg);
    } catch (error) {
      // const defaultLoginFailureMessage = intl.formatMessage({
      //   id: 'pages.register.failure',
      //   defaultMessage: '注册失败，请重试！',
      // });
      // console.log(error);
      // message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {intl.formatMessage({ id: 'menu.register', defaultMessage: '注册页' })}- {Settings.title}
        </title>
      </Helmet>
      <Lang />
      <div style={{ width: 520, margin: 'auto' }}>
        <ProForm<API.RegistryInfo & { confirm: string }>
          style={{ minWidth: 380, maxWidth: '75vw' }}
          // logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          // layout="horizontal"
          // labelCol={{ xs: 6 }}
          // wrapperCol={{ xs: 18 }}
          // subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{ autoLogin: true }}
          submitter={{
            render() {
              return (
                <Row>
                  <Col span="12">
                    <Button block type="primary" htmlType="submit">
                      {intl.formatMessage({ id: 'menu.register', defaultMessage: '注册' })}
                    </Button>
                  </Col>
                  <Col span="12">
                    <Button block type="link" href="/user/login">
                      {intl.formatMessage({
                        id: 'pages.register.link.login',
                        defaultMessage: '使用已有账户登录',
                      })}
                    </Button>
                  </Col>
                </Row>
              );
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <Typography.Title level={3}>
            <FormattedMessage id="pages.login.registerAccount" defaultMessage="注册账户" />
          </Typography.Title>
          {/* <ProFormText
            name="nickname"
            placeholder={intl.formatMessage({
              id: 'pages.register.nickname',
              defaultMessage: '昵称',
            })}
            fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.nickname.required"
                    defaultMessage="请输入昵称!"
                  />
                ),
              },
            ]}
          /> */}
          <ProFormText
            name="username"
            fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
            placeholder={intl.formatMessage({
              id: 'pages.register.email',
              defaultMessage: '邮箱',
            })}
            rules={[
              {
                type: 'email',
                message: (
                  <FormattedMessage
                    id="pages.login.username.email.validator.required"
                    defaultMessage="请使用邮箱注册"
                  />
                ),
              },
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.register.email.required"
                    defaultMessage="请输入邮箱!"
                  />
                ),
              },
            ]}
          />
          <ProFormText.Password
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
          />
          {/* <ProFormText
            name="email"
            placeholder={intl.formatMessage({ id: 'pages.register.email', defaultMessage: '邮箱' })}
            fieldProps={{ size: 'large', prefix: <MailOutlined /> }}
            rules={[
              {
                type: 'email',
                message: (
                  <FormattedMessage
                    id="pages.register.email.required"
                    defaultMessage="请输入邮箱!"
                  />
                ),
              },
            ]}
          /> */}
          {/* <ProFormText
            name="phone"
            placeholder={intl.formatMessage({ id: 'pages.register.phone', defaultMessage: '手机' })}
            fieldProps={{ size: 'large', prefix: <PhoneOutlined /> }}
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
          /> */}
        </ProForm>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
