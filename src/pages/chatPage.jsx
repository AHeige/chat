import React from "react"

import Box from "@mui/material/Box"
import BottomNavigation from "@mui/material/BottomNavigation"
import Input from "@mui/material/Input"
import Paper from "@mui/material/Paper"
import SendIcon from "@mui/icons-material/Send"
import Game2D from "./Game2D"

const socket = new WebSocket('ws://localhost:8080');

function ssend(msg) {
    console.log("Attempting to send: " + msg)
    if (socket || socket.readyState === 1) {
        socket.send(msg)
    } else {
        console.error("Socket not initialized, readyState=" + socket.readyState)
    }
}

function initws() {
    // Create WebSocket connection.
    // Error handler
    socket.addEventListener('error', function (event) {
        console.error ("ws error:")
        console.error (event)
    });

    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send('Hello server!');
    });
    
    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message rx: ', event.data);
    });
    console.log ("init ws done")
}

initws()

const ChatPage = () => {
  const sendMessage = (e) => {
    if (e.key === "Enter") {
        ssend(e.target.value)
    }
  }

  return (
    <div>
    <Game2D id="aster" senderFunc={ssend}></Game2D>
    <Paper
        elevation={3}
        style={{ position: "fixed", bottom: 0, width: "100%" }}
    >
      <BottomNavigation>
        <Box
          style={{
            width: "50%",
            backgroundColor: "#D3D3D3",
            borderRadius: "25px",
          }}
        >
          <Input
            style={{
              //backgroundColor: "#D3D3D3",
              borderRadius: "5px",
              width: "100%",
              height: "100%",
              paddingLeft: "1em",
            }}
            onKeyDown={(e) => sendMessage(e)}
            placeholder="Aa"
            disableUnderline="true"
          ></Input>
        </Box>
      </BottomNavigation>
    </Paper>
    </div>
  )
}

export default ChatPage
