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
  socket.send(JSON.stringify(data));
  setTimeout(() => {
    sendMessage(socket);
  }, 300);
}
