import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';

/**
 * 地图设置页面
 * @returns
 */
export default function Page() {
  const columns: ProColumns[] = [];
  return (
    <PageContainer>
      <ProTable columns={columns}></ProTable>
    </PageContainer>
  );
}
