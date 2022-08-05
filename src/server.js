const ws = require('ws')
const PORT = 8080
const wss = new ws.WebSocketServer({ port: PORT });

// some connected user did send a message. DateTime, UserID, message.
// clients are a user with a UserID. OnMessageSent the client send a ws packet with messageData

function init () {
    wss.on('connection', function connection(ws) {
        ws.on('message', function message(data) {
            console.log('received: %s', data);
            ws.send("Got: " + data);
        });
        const msg = 'hello from server!'
        ws.send(msg);
        console.log("send: " + msg)
    });
    console.log("server initialized")
}

init()
