// //import type { ProColumns } from '@ant-design/pro-components';
// import {
//     EditableProTable,
//     ProForm,
//     ProFormText,
//     ProColumns,
//     PageContainer
// } from '@ant-design/pro-components';
// import { Input, message } from 'antd';
// import React, { useState } from 'react';

// const waitTime = (time: number = 100) => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(true);
//         }, time);
//     });
// };

// type DataSourceType = {
//     id: React.Key;
//     title?: string;
//     decs?: string;
//     state?: string;
//     created_at?: string;
//     children?: DataSourceType[];
// };

// const defaultData: DataSourceType[] = [
//     {
//         id: 624748504,
//         title: '活动名称一',
//         decs: '这个活动真好玩',
//         state: 'open',
//         created_at: '1590486176000',
//     },
//     {
//         id: 624691229,
//         title: '活动名称二',
//         decs: '这个活动真好玩',
//         state: 'closed',
//         created_at: '1590481162000',
//     },
// ];

// const columns: ProColumns<DataSourceType>[] = [
//     {
//         title: '活动名称',
//         dataIndex: 'title',
//         width: '30%',
//     },
//     {
//         title: '状态',
//         key: 'state',
//         dataIndex: 'state',
//         valueType: 'select',
//         valueEnum: {
//             all: { text: '全部', status: 'Default' },
//             open: {
//                 text: '未解决',
//                 status: 'Error',
//             },
//             closed: {
//                 text: '已解决',
//                 status: 'Success',
//             },
//         },
//     },
//     {
//         title: '描述',
//         dataIndex: 'decs',
//         renderFormItem: (_, { record }) => {
//             console.log('----===>', record);
//             return <Input addonBefore={(record as any)?.addonBefore} />;
//         },
//     },
//     {
//         title: '操作',
//         valueType: 'option',
//     },
// ];


import React, { useEffect, useState } from 'react';
import ProForm, { ProFormGroup, ProFormList, ProFormText } from '@ant-design/pro-form';
import { PageContainer, ProCard } from '@ant-design/pro-components';

const initialValues = {
    "vendor": "jinju",
    "jsonType": 1, // 1 normal, 2 top-key-mac, 3
    "versionName": "sasa",
    "versionCode": 123,
    "topics": [{

        "topicName": "beaconInfoTopic",
        "topic": "/ips/pub/AOA_data",
        "mapkeys": { // 当前topic 可以获取的信息
            // 模型定义的参数名 : 当前协议内对应参数路径
            "gateway": "Gateway",
            "deviceMac": "NodeId",
            "motion": "motion",
            "coordinate_x": "x",
            "coordinate_y": "y",
            "coordinate_z": "z",
        },
    },
    {
        "topicName": "gatewayInfoTopic",
        "topic": "/ips/pub/AOA_Station_His",
        "mapkeys": {  // 当前topic 可以获取的信息
            "gateway": "Gateway",
            "deviceMac": "Gateway",
            "orientation_x": "his_x",
            "orientation_y": "his_y",
            "orientation_z": "his_z",
            "online_status": "1",
        }
    }],
}

interface Topic {
    topicName: string;
    topic: string;
    mapkeys: { [key: string]: any };
}

interface InitialValues {
    vendor: string;
    jsonType: number;
    versionName: string;
    versionCode: number;
    topics: Topic[];
}


const MyForm: React.FC = () => {
    const [mapkeys, setMapkeys] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // 取出第一个 topic 的 mapkeys 作为初始值
        //setMapkeys(initialValues.topics[0].mapkeys);
    }, []);

    function convertInitialValues(initialValues: InitialValues) {
        return {
            ...initialValues,
            topics: initialValues.topics.map(topic => ({
                ...topic,
                mapkeys: Object.entries(topic.mapkeys).map(([key, value]) => ({ key, value }))
            }))
        };
    }

    const convertedInitialValues = convertInitialValues(initialValues);

    return (
        <PageContainer>
            <ProForm onFinish={async (values) => console.log(values)} initialValues={convertedInitialValues}>
                {/* 第一区域 输入 vendor 和 versionName */}
                <ProFormGroup>
                    <ProFormText name="vendor" label="Vendor" />
                    <ProFormText name="versionName" label="Version Name" />
                </ProFormGroup>

                {/* 第二区域 输入 jsonType 和 versionCode */}
                <ProFormGroup>
                    <ProFormText name="jsonType" label="Json Type" />
                    <ProFormText name="versionCode" label="Version Code" />
                </ProFormGroup>

                {/* 第三区域为 动态 ProFormList，用于输入 Topics 项 */}
                <ProFormList
                    name="topics"
                    label="用户信息"
                    initialValue={initialValues.topics}
                    creatorRecord={() => ({})}
                    itemRender={({ listDom, action }, { record }) => {
                        return (
                            <ProCard
                                bordered
                                extra={action}
                                title={record?.name}
                                style={{
                                    marginBlockEnd: 8,
                                }}
                            >
                                {listDom}
                            </ProCard>
                        );
                    }}
                >
                    <ProFormGroup>
                        <ProFormText name="topicName" label="Topic Name" />
                        <ProFormText name="topic" label="Topic" />
                    </ProFormGroup>

                    <ProFormList name='mapkeys' label='协议键值对'>
                        <ProFormGroup>
                            <ProFormText name="key" label="系统键值" />
                            <ProFormText name="value" label="厂商键值路径" />
                            <ProFormText name="value" label="" />
                        </ProFormGroup>
                    </ProFormList> 

                </ProFormList>

            </ProForm>
        </PageContainer>
    );
};

export default MyForm;




