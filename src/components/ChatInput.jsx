import React, { useRef, useEffect, useState } from "react"

//Material UI
import Paper from "@mui/material/Paper"
import BottomNavigation from "@mui/material/BottomNavigation"
import Box from "@mui/material/Box"
import Input from "@mui/material/Input"
import SendIcon from "@mui/icons-material/Send"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"

//Components
import Recall from "./Recall"

const ChatInput = ({ sendMessage, chatWidth, myMessages }) => {
  const [oldMsgNumber, setOldMsgNumber] = useState(0)
  const [recallMsg, setRecallMsg] = useState(false)
  const ref = useRef(null)

  const handleSendMessage = (e) => {
    if (e.type === "pointerdown" && !e.shiftKey && e.target.value !== "") {
      setRecallMsg(false)
      sendMessage(e.target.innerText)
      cleanInput()
      setOldMsgNumber(myMessages.length + 1)
    }
    if (e.key === "Enter" && !e.shiftKey && e.target.value !== "") {
      setRecallMsg(false)
      sendMessage(ref.current.value)
      cleanInput()
      setOldMsgNumber(myMessages.length + 1)
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
    if (myMessages.length === 0) {
      return
    } else if (key === "ArrowUp") {
      setRecallMsg(true)
      const arrayMin = 0
      setOldMsgNumber((previous) => {
        if (previous === arrayMin) {
          return arrayMin
        } else return previous - 1
      })
    }
    if (key === "ArrowDown") {
      const arrayMax = myMessages.length - 1
      setRecallMsg(true)
      setOldMsgNumber((previous) => {
        if (previous >= arrayMax) {
          return arrayMax
        } else return previous + 1
      })
    }
  }

  useEffect(() => {
    if (myMessages.length > -1 && recallMsg) {
      ref.current.value = myMessages[oldMsgNumber]
      console.log(myMessages[oldMsgNumber])
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

  const handleEmpty = (e) => {
    if (e.target.value === "") {
      setRecallMsg(false)
      setOldMsgNumber(myMessages.length)
    }
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
        <Recall
          oldMsgNumber={oldMsgNumber}
          myMessages={myMessages}
          recallMsg={recallMsg}
          handleSendMessage={handleSendMessage}
        />
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
              onChange={(e) => handleEmpty(e)}
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
