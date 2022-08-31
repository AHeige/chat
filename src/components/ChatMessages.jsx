import React from "react"

//Material UI
import Grid from "@mui/material/Grid"
import MessageCard from "./MessageCard"

const ChatMessages = ({ messages, clientId }) => {
  //To-Do
  //Make it possible to change color of your text to what you like.
  return messages.map((obj, index) => (
    <Grid
      item
      xs={12}
      style={{
        textAlign: obj.cid === clientId ? "-webkit-right" : "",
      }}
      key={index}
    >
      <MessageCard key={index} msgObj={obj} clientId={clientId} />
    </Grid>
  ))
}

export default ChatMessages
