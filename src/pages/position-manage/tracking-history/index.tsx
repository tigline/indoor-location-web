import { AntdL7Component } from '@/components/map-components/antd-L7-component';
import { SelectMapCascader } from '@/components/select-map.cascader';
import { getMap } from '@/services/swagger/xitongguanli';
import { OK } from '@/utils/global.utils';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Card } from 'antd';

/**
 * 历史轨迹页面
 *
 * @export
 * @return {*}
 */
export default function Page() {
  const intl = useIntl();
  const { run, data } = useRequest(getMap, {
    manual: true,
    formatResult(res) {
      return res;
    },
  });
  return (
    <PageContainer>
      <ProCard>
        <ProForm
          // 隐藏重置按钮
          submitter={{ resetButtonProps: { style: { display: 'none' } } }}
          layout="inline"
          style={{ minWidth: 320 }}
          onFinish={(values) => {
            return run({ mapId: values.mapId }).then((res) => res.code === OK);
          }}
        >
          <SelectMapCascader label={false}></SelectMapCascader>
          <ProFormSelect
            placeholder={intl.formatMessage({
              id: 'pages.position-manage.tracking-manage.person-select',
              defaultMessage: '请选择人员',
            })}
          />
          <ProFormDateTimePicker
            placeholder={[
              intl.formatMessage({
                id: 'pages.position-manage.tracking-manage.start.time',
                defaultMessage: '请选择起始时间',
              }),
              // intl.formatMessage({
              //   id: 'pages.position-manage.tracking-manage.end.time',
              //   defaultMessage: '请选择结束时间',
              // }),
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
        <AntdL7Component map={data?.data?.picture} />
      </Card>
    </PageContainer>
  );
}
