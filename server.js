const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// クライアントごとのデータを格納するオブジェクト
const clientData = new Map();

wss.on('connection', (ws) => {
  console.log('New client connected');

  // クライアントごとに初期データを作成
  const clientId = Date.now().toString(); // 一意のID (タイムスタンプ)
  clientData.set(ws, {
    message: "Hello, Client!",
    timestamp: new Date().toISOString(),
    status: false
  })

  // クライアント接続時に現在のデータを送信
  ws.send(JSON.stringify(jsonData));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const clientData = clientData.get(ws);

      if(!clientData) return;

      if (data.type === 'updateMessage') {
        jsonData.message = data.message;
        jsonData.status = data.status; // メッセージ更新時にbool値も適用
      } else if (data.type === 'updateStatus') {
        jsonData.status = data.status; // ステータスのみ更新
      }

      jsonData.timestamp = new Date().toISOString(); // タイムスタンプを更新
      console.log(`Data updated for client ${clientId}:`, jsonData);

      // 更新されたデータのみクライアントに送信
      ws.send(JSON.stringify(clientData));

      // すべてのクライアントにデータを送信
      // wss.clients.forEach((client) => {
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send(JSON.stringify(jsonData));
      //   }
      // });
    } catch (error) {
      console.error('Invalid message received:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
