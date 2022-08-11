import React, { useRef } from "react"

//Material UI
import Paper from "@mui/material/Paper"
import BottomNavigation from "@mui/material/BottomNavigation"
import Box from "@mui/material/Box"
import Input from "@mui/material/Input"

const ChatInput = ({ sendMessage }) => {
  const ref = useRef(null)

  const handleSendMessage = (e) => {
    if (e.key === "Enter") {
      sendMessage(e)
      ref.current.value = ""
    }
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
              marginLeft: "8em",
              width: "20em",
              backgroundColor: "#fff",
              borderRadius: "20px",
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
              onKeyDown={(e) => handleSendMessage(e)}
              placeholder="Aa"
              disableUnderline={true}
              inputRef={ref}
            ></Input>
          </Box>
        </BottomNavigation>
      </Paper>
    </>
  )
}

export default ChatInput
