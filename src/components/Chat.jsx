import React from "react"

//Components
import ChatInput from "./ChatInput"
import ChatMessages from "./ChatMessages"

//Material UI
import Grid from "@mui/material/Grid"

const Chat = ({ sendMessage, messages }) => {
  return (
    <Grid
      container
      direction={"column"}
      xs={12}
      style={{ position: "fixed", bottom: "0" }}>
      <Grid item xs={12}>
        <ChatMessages messages={messages} />
      </Grid>
      <Grid item xs={12}>
        <ChatInput sendMessage={sendMessage} />
      </Grid>
    </Grid>
  )
}

export default Chat
