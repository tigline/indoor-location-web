import { useModel } from '@umijs/max';
import { useWebSocket } from 'ahooks';
import React from 'react';

// function filterRes(data:number[]) {
//   let filteredData: number[] = [];
//   const windowSize = 10;
//   if (data.length < windowSize) {
//     filteredData = data.reduce((sum, d) => [sum[0] + d[0], sum[1] + d[1]], [0, 0]).map((sum) => sum / data.length);
//   } else {
//     filteredData = data.slice(-windowSize).reduce((sum, d) => [sum[0] + d[0], sum[1] + d[1]], [0, 0]).map((sum) => sum / windowSize);
//   }
//   return filteredData
// }
      // onOpen: () => console.log('web socket connected'),
      // onClose: () => console.log('web socket closed'),
      // onMessage(message: MessageEvent<string>) {
      //   console.log('Receive:', message);
      // },
      // onError: (err) => console.log(err),
        // const [state, setState] = React.useState();

  // const [aoas,setAoas] = React.useState<Record<string,API.AoaDataInfo[]>>()
  // const [alarms,setAlarms] = React.useState<Record<string,API.AlarmInfo[]>>()

export default () => {
  const { initialState } = useModel('@@initialState');
  // 当前有实时数据的标签
  const [beaconLocations, setBeaconLocations] = React.useState<Record<string, API.AoaDataInfo>>();


  //const url = location.hostname.replace('localhost', '') || '192.168.0.10';
  const url = '127.0.0.1';
  
  const { connect, readyState, latestMessage } = useWebSocket(
    `ws://${url}/websocket?userId=${initialState?.currentUser?.userId}`,
    {
      manual: true,
    },
  );

  React.useEffect(() => { }, [latestMessage?.data]);

  React.useEffect(() => {
    if (latestMessage?.data) {
      //console.log('socket message:', latestMessage?.data);
      const res = JSON.parse(latestMessage?.data) as ILocation;
      //这里只处理'定位数据'
      if (res.type === 'AOAData') {
        // const currentDate = new Date();
        // //格式化时间
        // const formattedDate = currentDate.toISOString();
        // console.log('socket message:', formattedDate , res);
        setBeaconLocations((pre) => {
          return { ...pre, [res.data.deviceId!]: res.data as API.AoaDataInfo };
        });
      }
    }
  }, [latestMessage?.data]);

  return {
    readyState,
    connect,
    data: latestMessage?.data,
    beaconLocations,
  };
};

export interface ILocation {
  type: 'AOAData' | 'Alarm';
  data: API.AoaDataInfo | API.AlarmInfo;
}
