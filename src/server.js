const ws = require("ws")
const PORT = 8080
const wss = new ws.WebSocketServer({
    port: PORT
})

// some connected user did send a message. DateTime, UserID, message.
// clients are a user with a UserID. OnMessageSent the client send a ws packet with messageData
let connectedUser = []

function broadcastMessage(message) {
    for (let user of connectedUser) {
        console.log ({user}, {message})
        user.sock.send(JSON.stringify(message))
    }
}

// function addMessageToUser(uid, msg) {
//     for (let user of connectedUser) {
//         if (user.id === uid) user.message.push(msg)
//     }
// }

function init() {
    wss.on("connection", function connection(ws) {

        connectedUser.push({
            id: connectedUser.length,
            sock: ws,
            // messages: []
        })

        ws.on("message", function message(data) {
            let parsedObject = JSON.parse(data)
            parsedObject.rxDate = new Date()
            // addMessageToUser(uid, parsedObject)
            broadcastMessage(parsedObject)
        })

    })
    console.log("server initialized")
}

init()
