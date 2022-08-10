const ws = require("ws")
const PORT = 8080
const wss = new ws.WebSocketServer({
  port: PORT,
})

// some connected user did send a message. DateTime, UserID, message.
// clients are a user with a UserID. OnMessageSent the client send a ws packet with messageData
let connectedUsers = []

function getListOfConnectedUsers() {
  let users = []
  for (let user of connectedUsers) {
    users.push({
      joinedDate: user.joinedDate,
      name: user.name
    })
  }
  return users
}

let nextUserId = 0

function getLowestAvailableCid() {
  nextUserId++
  return nextUserId
}

function broadcastMessage(message, cidToSkip = -1) {
  if (connectedUsers.length < 1) {
    console.log ('No users connected')
  }
  for (let user of connectedUsers) {
    if (cidToSkip !== user.cid) {
      console.log('Broadcasting ' + message.user + ': ' + message.text + ' to ' + user.name)
      user.sock.send(JSON.stringify(message))
    } else {
      console.log ('Skips to broadcast ' + message.message + ' to ' + user.name)
    }
  }
  console.log ('Number of connected users: ' + (connectedUsers.length))
}

function removeUser(cid) {
  connectedUsers = connectedUsers.filter((user) => {
    return user.cid !== cid
  })
}

function init() {
  wss.on("connection", function connection(ws) {

    const cid = getLowestAvailableCid()

    ws.on("message", function message(data) {
      let parsedObject = JSON.parse(data)
      parsedObject.rxDate = new Date()
      parsedObject.srvAckMid = parsedObject.mid
      parsedObject.srvAck = true
      parsedObject.user = 'User #' + cid
      parsedObject.cid = cid
      broadcastMessage(parsedObject)
    })

    ws.addEventListener('close', (event) => {
      broadcastMessage({
        rxDate: new Date(),
        srvAck: true,
        user: 'User #' + cid,
        text: '<Logged out>',
        cid: cid
      })
      removeUser(cid)
      console.log ('User #' + cid + ' left the chat')
      console.log ({connectedUsers})
    })

    connectedUsers.push({
      joinedDate: new Date(),
      name: 'User#' + cid,
      cid: cid,
      sock: ws,
    })

    console.log ('User #' + cid + ' joined the chat')
    // send welcome message
    ws.send(JSON.stringify({
      rxDate: new Date(),
      initMessage: true,
      cid: cid,
      srvAck: true,
      text: 'Welcome User #' + cid,
      connectedUsers: getListOfConnectedUsers(),
      user: 'server v0.1.0'
    }))

    broadcastMessage({
      rxDate: new Date(),
      srvAck: true,
      user: 'User #' + cid,
      text: '<joined the chat>',
      cid: cid
    }, cid)



  })

  console.log("server initialized")
}

init()