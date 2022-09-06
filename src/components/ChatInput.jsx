import React, { useRef, useEffect, useState } from "react"

//Material UI
import Paper from "@mui/material/Paper"
import BottomNavigation from "@mui/material/BottomNavigation"
import Box from "@mui/material/Box"
import Input from "@mui/material/Input"
import SendIcon from "@mui/icons-material/Send"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"

const ChatInput = ({ sendMessage, chatWidth, myMessages }) => {
  const [oldMsgNumber, setOldMsgNumber] = useState(0)
  const [recallMsg, setRecallMsg] = useState(false)
  const ref = useRef(null)

  const handleSendMessage = (e) => {
    if (e.key === "Enter" && !e.shiftKey && e.target.value !== "") {
      sendMessage(ref.current.value)
      cleanInput()
      setOldMsgNumber(myMessages.length)
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()

      recallMessage(e.key)
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      recallMessage(e.key)
    }
  }

  const recallMessage = (key) => {
    console.log("myMessage length ", myMessages.length)
    console.log("oldmsgnumber ", oldMsgNumber)
    if (myMessages.length === 0) {
      return
    } else if (key === "ArrowUp") {
      const arrayMin = 0
      setOldMsgNumber((previous) => {
        if (previous === arrayMin) {
          return arrayMin
        } else return previous - 1
      })
    }
    if (key === "ArrowDown") {
      const arrayMax = myMessages.length - 1

      setOldMsgNumber((previous) => {
        if (previous === arrayMax) {
          return arrayMax
        } else return previous + 1
      })
    }
  }

  useEffect(() => {
    if (myMessages.length > 0) {
      ref.current.value = myMessages[oldMsgNumber]
    }
  }, [oldMsgNumber, setOldMsgNumber])

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
        style={{
          position: "fixed",
          bottom: 0,
          width: `${chatWidth}%`,
        }}
      >
        <BottomNavigation style={{ justifyContent: "left" }}>
          <Box
            style={{
              marginTop: "0.7em",
              marginBottom: "0.7em",
              marginLeft: "1em",
              marginRight: "1em",
              width: "100%",

              //borderRadius: "20px",
            }}
          >
            <Input
              style={{
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
            style={{
              marginTop: "0.7em",
              marginBottom: "0.7em",
              marginRight: "0.7em",
            }}
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
