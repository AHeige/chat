import React, { useEffect, useState } from "react"

//Pages
import Game2D from "../components/Game2D"

//Components
import Chat from "../components/Chat"

//Material UI
import Grid from "@mui/material/Grid"

const MainPage = () => {
  const [messages, setMessages] = useState([])
  const [sock, setSock] = useState()
  const [clientId, setClientId] = useState(-1)
  const [socketLost, setSocketLost] = useState(false)

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080")
    setSock(socket)
    addEventListeners(socket)
  }, [socketLost])

  useEffect(() => {
    console.log("messages updated ", messages)
  }, [messages])

  const addEventListeners = (socket) => {
    socket.addEventListener("message", (event) => {
      let msgObj = JSON.parse(event.data)
      if (msgObj.initMessage) {
        setClientId(() => {
          return msgObj.cid
        })
      } else {
        msgObj.mid = messages.length
      }
      removeAckMessage(msgObj)
      addMessage(msgObj)
    })

    socket.addEventListener("close", (event) => {
      setSocketLost(true)
    })
  }

  const addMessage = (message) => {
    setMessages((oldMessages) => {
      return [...oldMessages, message]
    })
  }

  const removeAckMessage = (msg) => {
    setMessages((oldMessages) => {
      return oldMessages.filter((old) => {
        return !(old.cid === msg.cid && old.mid === msg.srvAckMid)
      })
    })
  }

  const sendMessage = (e) => {
    if (e.key === "Enter") {
      const msg = e.target.value

      if (!msg) {
        return
      }

      if (sock.readyState !== 1) {
        setSocketLost((oldVal) => !oldVal)
      }

      const messageObject = {
        text: msg,
        type: 1,
        mid: messages.length,
        srvAck: false,
        rxDate: new Date(),
        cid: clientId,
        user: "(Me #" + clientId + ")",
      }

      addMessage(messageObject)

      const message = JSON.stringify(messageObject)
      if (sock && sock.readyState === 1) {
        sock.send(message)
      } else {
        console.error("Socket not initialized, readyState=" + sock.readyState)
      }
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Game2D id='aster' cid={clientId}></Game2D>
      </Grid>
      <Grid item xs={12}>
        <Chat messages={messages} sendMessage={sendMessage} />
      </Grid>
    </Grid>
  )
}

export default MainPage
