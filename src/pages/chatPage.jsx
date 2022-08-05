import React from "react"

import Box from "@mui/material/Box"
import BottomNavigation from "@mui/material/BottomNavigation"
import Input from "@mui/material/Input"
import Paper from "@mui/material/Paper"
import SendIcon from "@mui/icons-material/Send"

const ChatPage = () => {
  const sendMessage = (e) => {
    if (e.key === "Enter") {
      console.log(e.target.value)
    }
  }

  return (
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
  )
}

export default ChatPage
