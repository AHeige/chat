import React, { useRef } from "react"

//Material UI
import Paper from "@mui/material/Paper"
import BottomNavigation from "@mui/material/BottomNavigation"
import Box from "@mui/material/Box"
import Input from "@mui/material/Input"
import SendIcon from "@mui/icons-material/Send"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"

const ChatInput = ({ sendMessage }) => {
  const ref = useRef(null)

  const handleSendMessage = (e) => {
    if (e.key === "Enter") {
      sendMessage(ref.current.value)
      cleanInput()
    }
  }

  const buttonSend = () => {
    const m = ref.current.value
    sendMessage(m)
    cleanInput()
  }

  const cleanInput = () => {
    ref.current.value = ""
  }

  return (
    <>
      <Paper
        elevation={3}
        style={{ position: "fixed", bottom: 0, width: "78%" }}
      >
        <BottomNavigation
          style={{ backgroundColor: "#CBD7DA", justifyContent: "left" }}
        >
          <Box
            style={{
              marginTop: "0.7em",
              marginBottom: "0.7em",
              marginLeft: "1em",
              marginRight: "1em",
              width: "19.5em",
              backgroundColor: "#fff",
              //borderRadius: "20px",
            }}
          >
            <Input
              style={{
                //backgroundColor: "#D3D3D3",
                //borderRadius: "5px",
                width: "100%",
                height: "100%",
                paddingLeft: "1em",
              }}
              onKeyDown={(e) => handleSendMessage(e)}
              placeholder="Send a message"
              disableUnderline={true}
              inputRef={ref}
            ></Input>
          </Box>
          <Stack
            direction="row"
            spacing={2}
            style={{ marginTop: "0.7em", marginBottom: "0.7em" }}
          >
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={() => buttonSend()}
            >
              Send
            </Button>
          </Stack>
        </BottomNavigation>
      </Paper>
    </>
  )
}

export default ChatInput
