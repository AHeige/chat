import React from "react"

//Material UI
import Grid from "@mui/material/Grid"
import Chip from "@mui/material/Chip"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"

const ChatMessages = ({ messages }) => {
  return messages.map((obj, index) => (
    <Grid key={index} item style={{ marginTop: "0.3em", width: "fit-content" }}>
      <Card key={index}>
        <CardHeader title={(obj.srvAck ? '' : '*') + new Date(obj.rxDate).toLocaleTimeString('sv-SV') + ', ' + obj.user + ': ' + obj.text} />
      </Card>
    </Grid>
  ))
}

export default ChatMessages
