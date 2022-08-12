import React, { useRef, useEffect } from "react"

//Components
import ChatInput from "./ChatInput"
import ChatMessages from "./ChatMessages"

//Material UI
import Grid from "@mui/material/Grid"
import Drawer from "@mui/material/Drawer"

const Chat = ({ sendMessage, messages }) => {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <Drawer variant="permanent" anchor="right">
      <Grid
        container
        xs={12}
        alignContent={"flex-end"}
        style={{ minWidth: "28em", marginBottom: "3.5em" }}
      >
        <Grid item>
          <ChatMessages messages={messages} />
        </Grid>
      </Grid>
      <ChatInput sendMessage={sendMessage} />
      <Grid item ref={bottomRef}></Grid>
    </Drawer>
  )
}

export default Chat
