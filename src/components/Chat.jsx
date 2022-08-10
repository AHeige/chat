import React from "react"

//Components
import ChatInput from "./ChatInput"
import ChatMessages from "./ChatMessages"

//Material UI
import Grid from "@mui/material/Grid"
import Drawer from "@mui/material/Drawer"

const Chat = ({ sendMessage, messages }) => {
  return (
    <Drawer variant='permanent' anchor='right'>
      <Grid container justifyContent={"flex-end"}>
        <Grid item xs={12}>
          <ChatMessages messages={messages} />
        </Grid>
        <Grid item xs={12}>
          <ChatInput sendMessage={sendMessage} />
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default Chat
