import React, { useRef, useEffect, useState } from "react"
import Box from "@mui/material/Box"
import BottomNavigation from "@mui/material/BottomNavigation"
import Input from "@mui/material/Input"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Chip from "@mui/material/Chip"
import Game2D from "./pages/Game2D"

const MessageRenderer = () => {
  const [messages, setMessages] = useState([])
  const [sock, setSock] = useState()
  const ref = useRef(null)

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
    if (e.key === "Enter") {
      const msg = e.target.value
      const messageObject = {
        message: msg,
        messageType: 1,
      }

      const x = JSON.stringify(messageObject)

      console.log("Attempting to send: " + msg)
      if (sock) {
        sock.send(x)
      } else {
        console.error("Socket not initialized, readyState=" + sock.readyState)
      }

      ref.current.value = ""
    }
  }

  return (
    <div>
      <Game2D id='aster'></Game2D>

      {console.log(messages)}
      {/* {this.state.messages[0].message} */}
      {messages &&
        messages.map((obj, index) => <div key={index}>{obj.message}</div>)}
      <Paper
        elevation={3}
        style={{ position: "fixed", bottom: 0, width: "100%" }}>
        <BottomNavigation>
          <Box
            style={{
              width: "50%",
              backgroundColor: "#D3D3D3",
              borderRadius: "25px",
            }}>
            <Input
              style={{
                //backgroundColor: "#D3D3D3",
                borderRadius: "5px",
                width: "100%",
                height: "100%",
                paddingLeft: "1em",
              }}
              onKeyDown={(e) => sendMessage(e)}
              placeholder='Aa'
              disableUnderline={true}
              inputRef={ref}></Input>
          </Box>
        </BottomNavigation>
      </Paper>
    </div>
  )
}

export default MessageRenderer
