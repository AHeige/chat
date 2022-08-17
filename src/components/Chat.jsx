import React, { useRef, useEffect, useState } from "react"

//Components
import ChatInput from "./ChatInput"
import ChatMessages from "./ChatMessages"

//Material UI
import Grid from "@mui/material/Grid"
import Drawer from "@mui/material/Drawer"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import EastIcon from "@mui/icons-material/East"
import CommentIcon from "@mui/icons-material/Comment"

const Chat = ({ sendMessage, messages, isOpen, setIsOpen }) => {
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
        },
      }}
      variant="persistent"
      anchor="right"
      open={isOpen}
      hideBackdrop
    >
      <Stack
        direction="row"
        spacing={2}
        style={{
          marginTop: "0.7em",
          marginBottom: "0.7em",
          position: "fixed",
          right: "0",
        }}
      >
        <Button
          variant="contained"
          startIcon={<CommentIcon />}
          endIcon={<EastIcon />}
          onClick={() => setIsOpen(false)}
        ></Button>
      </Stack>
      <Grid
        container
        direction="row"
        alignContent={"flex-end"}
        style={{
          width: "100vw",
          //minHeight: "100vh",
          marginBottom: "3.5em",
          //backgroundColor: "#000",
          flex: "auto",
        }}
      >
        <Grid item>
          <ChatMessages messages={messages} />
        </Grid>
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
