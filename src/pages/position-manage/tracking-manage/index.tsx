import { ZrenderComponent } from '@/components/map-components/zrender-component';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Card } from 'antd';

/**
 * 轨迹追踪页面
 *
 * @export
 * @return {*}
 */
export default function Page() {
  const intl = useIntl();
  return (
    <PageContainer>
      <ProCard>
        <ProForm
          // 隐藏重置按钮
          submitter={{ resetButtonProps: { style: { display: 'none' } } }}
          layout="inline"
          style={{ minWidth: 320 }}
        >
          <ProFormSelect
            placeholder={intl.formatMessage({
              id: 'pages.position-manage.real-time-location.map-select',
              defaultMessage: '请选择地图',
            })}
          />
          <ProFormSelect
            placeholder={intl.formatMessage({
              id: 'pages.position-manage.tracking-manage.person-select',
              defaultMessage: '请选择人员',
            })}
          />
          <ProFormDateTimeRangePicker
            placeholder={[
              intl.formatMessage({
                id: 'pages.position-manage.tracking-manage.start.time',
                defaultMessage: '请选择起始时间',
              }),
              intl.formatMessage({
                id: 'pages.position-manage.tracking-manage.end.time',
                defaultMessage: '请选择结束时间',
              }),
            ]}
          />
          <ProFormSelect
            placeholder={intl.formatMessage({
              id: 'pages.position-manage.tracking-manage.speed-select',
              defaultMessage: '速率',
            })}
            options={[
              { label: 'x1', value: 1 },
              { label: 'x2', value: 2 },
              { label: 'x4', value: 4 },
              { label: 'x8', value: 8 },
            ]}
          />
        </ProForm>
      </ProCard>
      <Card>
        <ZrenderComponent />
      </Card>
    </PageContainer>
  );
}
