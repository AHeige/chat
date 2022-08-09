import React, { useRef, useEffect, useState } from "react"

//Pages
import Game2D from "../components/Game2D"

//Components
import Chat from "../components/Chat"

//Material UI
import Grid from "@mui/material/Grid"

const MainPage = () => {
  const [messages, setMessages] = useState([])
  const [sock, setSock] = useState()

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080")
    setSock(socket)
    addEventListener(socket)
  }, [])

  const addEventListener = (socket) => {
    socket.addEventListener("message", (event) => {
      let msgObj = JSON.parse(event.data)
      renderMessage(msgObj)
      console.log({ msgObj })
    })
  }

  const renderMessage = (message) => {
    setMessages((oldMessage) => [...oldMessage, message])
  }

  const sendMessage = (e) => {
    const msg = e.target.value
    const messageObject = {
      message: msg,
      messageType: 1,
    }

    const message = JSON.stringify(messageObject)

    console.log("Attempting to send: " + msg)
    if (sock) {
      sock.send(message)
    } else {
      console.error("Socket not initialized, readyState=" + sock.readyState)
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Game2D id='aster'></Game2D>
      </Grid>
      <Grid item xs={12}>
        <Chat messages={messages} sendMessage={sendMessage} />
      </Grid>
    </Grid>
  )
}

export default MainPage
