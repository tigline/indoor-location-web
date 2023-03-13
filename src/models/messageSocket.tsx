import { useModel } from '@umijs/max';
import { useWebSocket } from 'ahooks';

export default () => {
  const { initialState } = useModel('@@initialState');
  const { connect, readyState, latestMessage } = useWebSocket(
    `ws://${location.hostname}/websocket?userId=${initialState?.currentUser?.userId}`,
    {
      manual: true,
      onOpen: () => console.log('web socket connected'),
      onClose: () => console.log('web socket closed'),
      onMessage(message: MessageEvent<string>) {
        console.log('Receive:', message);
      },
      onError: (err) => console.log(err),
    },
  );
  return {
    readyState,
    connect,
    data: latestMessage?.data,
  };
};

export interface ILocation {
  type: 'AOAData' | 'Alarm';
  data: API.AoaDataInfo | API.AlarmInfo;
}
