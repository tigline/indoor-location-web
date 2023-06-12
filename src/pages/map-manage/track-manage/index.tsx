import { ZrenderComponent } from '@/components/map-components/zrender-component';
import { PageContainer } from '@ant-design/pro-components';

/**
 * 使用L7 demo
 * @returns
 */
export default function Page() {
  return (
    <PageContainer childrenContentStyle={{padding:20}}>
      <ZrenderComponent></ZrenderComponent>
    </PageContainer>
  );
}
