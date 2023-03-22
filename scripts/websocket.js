const { WebSocketServer } = require('ws');
const { mock } = require('mockjs');

const ws = new WebSocketServer({
  port: 3000,
  path: '/websocket',
});

ws.on('connection', function connection(socket) {
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });
  sendMessage(socket);
});
function sendMessage(socket) {
  const data = mock({
    type: 'AOAData',
    data: {
      deviceId: /123|456|789/,
      id: /123|456|789/,
      mapId: /1635140740788903938|1636003377902903297|1635140740788903937/,
      optScale: 0,
      'posX|0-6.6': 1,
      'posY|0-6.6': 1,
      timestamp: 0,
      type: '',
    },
  });

  const Alarm = mock({
    type: 'Alarm',
    data: {
      alarmId: /\d{12}/,
      content: '@title',
      createTime: Date.now(),
      deviceId: /\d{12}/,
      fenceId: /1636027801196683266|1638064827190337538/,
      mapId: '1636003377902903297',
      name: '@name',
      point: {
        'x|0-6.10': 1,
        'y|0-6.10': 1,
      },
      status: 'Unprocessed',
      type: 'In' | 'Out',
      updateTime: Date.now(),
    },
  });
  Alarm.data.content = Alarm.data.fenceId;
  // const msg =  JSON.stringify(data)
  const msg = JSON.stringify(Alarm);
  socket.send(msg);
  setTimeout(() => {
    sendMessage(socket);
  }, 800);
}
