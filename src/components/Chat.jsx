import React, { useRef, useEffect, useState } from "react"

//Components
import ChatInput from "./ChatInput"
import ChatMessages from "./ChatMessages"

//Material UI
import Grid from "@mui/material/Grid"
import Drawer from "@mui/material/Drawer"

const Chat = ({ sendMessage, messages, isOpen, clientId }) => {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isOpen])

  return (
    <Drawer
      PaperProps={{
        sx: {
          //backgroundColor: "#000",
          height: "100vh",
          right: "unset",
        },
      }}
      variant='persistent'
      anchor='right'
      open={isOpen}
      hideBackdrop>
      <Grid
        container
        direction='row'
        alignContent={"flex-end"}
        style={{
          width: "100vw",
          //minHeight: "100vh",
          marginBottom: "3.5em",
          //backgroundColor: "#000",
          flex: "auto",
        }}>
        <ChatMessages messages={messages} clientId={clientId} />
      </Grid>

      <ChatInput
        style={{ position: "fixed", bottom: "0" }}
        sendMessage={sendMessage}
      />

      <Grid item style={{ height: "0px" }} ref={bottomRef}></Grid>
    </Drawer>
  )
}

export default Chat
