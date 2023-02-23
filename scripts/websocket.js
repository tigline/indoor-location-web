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
      mapId: '1628312290603667457',
      optScale: 0,
      'posX|0-50': 1,
      'posY|0-30': 1,
      timestamp: 0,
      type: '',
    },
  });
  socket.send(JSON.stringify(data));
  setTimeout(() => {
    sendMessage(socket);
  }, 1000);
}
