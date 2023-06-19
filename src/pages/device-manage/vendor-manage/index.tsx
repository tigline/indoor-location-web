import { companyList } from "@/services/swagger/vendorguanli";
import { PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import { useIntl, useRequest, Link } from "@umijs/max";
import { fmtPage } from '@/utils/global.utils';
import { Button } from "antd";
import { useEffect, useState } from "react";
import { AddCompanyModal } from "../vendor-manage/components/AddCompanyModal";
import { EditCompanyModal } from "./components/edit-vendor.modal";

export default function Page() {
    const intl = useIntl();
    const [dataList, setDataList] = useState<API.CompanyInfo[]>([]);

    const {run} = useRequest(companyList, {
        manual: true,
        formatResult: (res) => res.data||[],
    });

    useEffect(() => {
        run().then(setDataList);
      }, [run]);

    const columns: ProColumns<API.CompanyInfo>[] = [

        {
            title: intl.formatMessage({
                id: 'pages.device-manage.vendor-manage.company.code',
                defaultMessage: '公司编码',
            }),
            dataIndex: 'companyCode',
        },

        {
            title: intl.formatMessage({
                id: 'pages.device-manage.vendor-manage.company.name',
                defaultMessage: '公司名称',
            }),
            dataIndex: 'companyName',
        },

        {
            title: intl.formatMessage({
                id: 'pages.device-manage.vendor-manage.company.createTime',
                defaultMessage: '创建时间',
            }),
            dataIndex: 'createTime',
        },

        {
            title: intl.formatMessage({ id: 'app.action', defaultMessage: '操作' }),
            valueType: 'option',
            key: 'option',
            render: (_, record, __, action) => (
              <Button.Group>
                <EditCompanyModal record={record} refresh={action?.reload} />
                <Button key="view">
                <Link to={`/device-manage/vendor-manage/vendor-models.page/:${0}`}>
                  {intl.formatMessage({ id: 'app.view', defaultMessage: '管理' })}
                </Link>
              </Button>
                {/* <SwitchFenceButton record={record} refresh={action?.reload} />
                <ViewFenceModal record={record} />
                <UpdateFenceModal record={record} refresh={action?.reload} />
                <RemoveButtonPopover
                  disabled={!record.fenceId}
                  loading={fetches?.[record.fenceId!]?.loading}
                  onClick={() => remove({ fenceId: record.fenceId! }).then(() => action?.reload())}
                /> */}
              </Button.Group>
            ),
          },

    ];

    return (
        <PageContainer childrenContentStyle={{padding:20}}>
            <ProTable
                options={{ setting: false}}
                columns={columns}
                search={false}
                dataSource={dataList}
                rowKey="companyId"
                toolBarRender={(action) => [
                    <AddCompanyModal key="add" refresh={action?.reload} />,

                  ]}
            >  
            </ProTable>            
        </PageContainer>
    );
    
}