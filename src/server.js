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
      name: user.name,
    })
  }
  return users
}

let nextUserId = 0

function getLowestAvailableCid() {
  nextUserId++
  return nextUserId
}

let nextServerUserId = 0

function getLowestAvailableServerCid() {
  nextServerUserId++
  return nextServerUserId
}

function broadcastMessage(message, cidToSkip = -1) {
  if (connectedUsers.length < 1) {
    console.log("No users connected")
  }
  for (let user of connectedUsers) {
    if (cidToSkip !== user.cid) {
      console.log(
        "Broadcasting " +
          message.user +
          ": " +
          message.text +
          " to " +
          user.name
      )
      user.sock.send(JSON.stringify(message))
    } else {
      console.log("Skips to broadcast " + message.message + " to " + user.name)
    }
  }
  console.log("Number of connected users: " + connectedUsers.length)
}

function removeUser(scid) {
  if (scid === false) {
    console.error('CANNOT REMOVE USER "FALSE"')
    return
  }
  connectedUsers = connectedUsers.filter((user) => {
    return user.scid !== scid
  })
}

function sendWelcomeMessage(ws, scid) {
  ws.send(
    JSON.stringify({
      rxDate: new Date(),
      text: "Welcome back ",
      user: "server v0.1.0",
      srvAck: true,
      initMessage: true,
      scid: scid,
    })
  )
}

const textColor = {
  1: "#FF0000", //Red
  2: "#008000", //Green
  3: "#0000FF", //Blue
  4: "#800080", //Purple
  5: "#FFFF00", //Yellow
}

const colorPicker = () => {
  const number = Math.floor(Math.random() * 5) + 1
  return number
}

function sendCidRequestMessage(ws, cid, scid) {
  ws.send(
    JSON.stringify({
      rxDate: new Date(),
      cidResponse: true,
      cidOption: cid,
      server: "server v0.1.0",
      text: "Welcome! You got the name: Player " + cid,
      scid: scid,
      user: "server v0.1.0",
      srvAck: true,
      color: textColor[colorPicker],
    })
  )
}

function addUser(cid, socket, scid) {
  connectedUsers.forEach((c) => {
    if (cid === c) {
      console.error("CID ALREADY EXISTS: " + c)
    }
  })
  connectedUsers.push({
    joinedDate: new Date(),
    name: "User#" + cid,
    cid: cid,
    sock: socket,
    scid: scid,
  })

  broadcastMessage(
    {
      rxDate: new Date(),
      srvAck: true,
      user: "User #" + cid,
      text: "<joined the chat>",
      cid: cid,
      scid: scid,
    },
    cid
  )
}

function init() {
  wss.on("connection", function connection(ws) {
    let cid = false
    const scid = getLowestAvailableServerCid()

    ws.on("message", function message(data) {
      let parsedObject = JSON.parse(data)

      if (parsedObject.clientInit === true) {
        cid = getLowestAvailableCid()
        sendCidRequestMessage(ws, cid, scid)
        addUser(cid, ws, scid)
      } else if (parsedObject.haveCookieCid) {
        cid = parsedObject.cid
        console.log("Add user with existing cid " + parsedObject.cid)
        addUser(parsedObject.cid, ws, scid)
      } else {
        cid = parsedObject.cid
        parsedObject.rxDate = new Date()
        parsedObject.srvAckMid = parsedObject.mid
        parsedObject.srvAck = true
        parsedObject.user = "User #" + parsedObject.cid
        broadcastMessage(parsedObject)
      }
    })

    ws.addEventListener("close", (event) => {
      broadcastMessage({
        rxDate: new Date(),
        srvAck: true,
        user: "User #" + cid,
        text: "<Logged out>",
        cid: cid,
        scid: scid,
      })
      removeUser(scid)
      console.log("User scid:" + scid + " left the chat")
      console.log({ connectedUsers })
    })

    sendWelcomeMessage(ws)
  })

  console.log("server initialized")
}

init()
