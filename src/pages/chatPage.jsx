import React, { useRef, useState, useEffect } from "react"

import Box from "@mui/material/Box"
import BottomNavigation from "@mui/material/BottomNavigation"
import Input from "@mui/material/Input"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Chip from "@mui/material/Chip"
import MessageRenderer from "../ChatClient"
import Game2D from "./Game2D"

const socket = new WebSocket("ws://localhost:8080")

const ssend = (msg, type) => {
  const messageObject = {
    message: msg,
    messageType: type,
  }

  const x = JSON.stringify(messageObject)

  console.log("Attempting to send: " + msg)
  if (socket || socket.readyState === 1) {
    socket.send(x)
  } else {
    console.error("Socket not initialized, readyState=" + socket.readyState)
  }
}

// Create WebSocket connection.
// Error handler
socket.addEventListener("error", function (event) {
  console.error("ws error:")
  console.error(event)
})

// Connection opened
socket.addEventListener("open", function (event) {
  //socket.send("Hello server!")
})

// Listen for messages
socket.addEventListener("message", function (event) {
  const parsedObject = JSON.parse(event.data)
  if (parsedObject.messageType === 1) {
    console.log("Message rx: ", parsedObject.message)
  }
})
console.log("init ws done")

//Service

const ChatPage = () => {
  const [messages, setMessages] = useState([])
  const refs = useRef(null)

  const sendMessage = (e) => {
    if (e.key === "Enter") {
      //   const message = e.target.value
      //   ssend(message, 1)
      refs.current.value = ""
    }
  }

  return (
    <div>
      {/* <Game2D id='aster' senderFunc={ssend}></Game2D> */}
      <Grid container direction={"column"} style={{ alignItems: "flex-end" }}>
        <MessageRenderer></MessageRenderer>
        {/* {messages &&
          messages.map((a, index) => (
            <Grid key={index} item style={{ marginTop: "0.3em" }}>
              <Chip key={index} label={a} />
            </Grid>
          ))} */}
      </Grid>

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
              inputRef={refs}></Input>
          </Box>
        </BottomNavigation>
      </Paper>
    </div>
  )
}

export default ChatPage
