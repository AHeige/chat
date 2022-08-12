import React from "react"

//Material UI
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"

const ChatMessages = ({ messages }) => {
  //To-Do
  //Make it possible to change color of your text to what you like.

  return messages.map((obj, index) => (
    <Card key={index} elevation={0}>
      <CardContent style={{ fontSize: "1em" }}>
        <span style={{ color: "#909090" }}>
          {(obj.srvAck ? "" : "*") +
            new Date(obj.rxDate).toLocaleTimeString("sv-SV")}{" "}
        </span>
        {obj.user + ": "}
        <span style={{ color: obj.color }}>{obj.text}</span>
      </CardContent>
    </Card>
  ))
}

export default ChatMessages
