import React from "react"

//Material UI
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Grid from "@mui/material/Grid"
import MessageCard from "./MessageCard"

const ChatMessages = ({ messages, clientId }) => {
  //To-Do
  //Make it possible to change color of your text to what you like.
  return messages.map((obj, index) => (
    <Grid
      item
      xs={12}
      style={{ textAlign: obj.cid === clientId ? "-webkit-right" : "" }}>
      <MessageCard key={index} msgObj={obj} />
    </Grid>
  ))
}

export default ChatMessages
