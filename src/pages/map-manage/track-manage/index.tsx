import { ZrenderComponent } from '@/components/map-components/openlayer-component';
import { PageContainer } from '@ant-design/pro-components';

/**
 * 使用L7 demo
 * @returns
 */
export default function Page() {
  return (
    <PageContainer>
      <ZrenderComponent></ZrenderComponent>
    </PageContainer>
  );
}
