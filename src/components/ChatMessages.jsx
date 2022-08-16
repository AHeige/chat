import React from "react"

//Material UI
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import MessageCard from "./MessageCard"

const ChatMessages = ({ messages }) => {
  //To-Do
  //Make it possible to change color of your text to what you like.
  return messages.map((obj, index) => <MessageCard key={index} msgObj={obj} />)
}

export default ChatMessages
