import React from "react"

import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import AppBar from "@mui/material/AppBar"
import Input from "@mui/material/Input"

const ChatPage = () => {
  const sendMessage = (e) => {
    if (e.key === "Enter") {
      console.log(e.target.value)
    }
  }

  return (
    <AppBar>
      <Box>
        <Input onKeyDown={(e) => sendMessage(e)}></Input>
      </Box>
    </AppBar>
  )
}

export default ChatPage
