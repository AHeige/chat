import React from "react"

//Material UI
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"

const RegularMessageBlock = ({ msgObj }) => {
  return (
    <Card style={{ width: "fit-content" }}>
      <CardContent style={{ width: "fit-content" }}>
        {(msgObj.srvAck ? "" : "*") +
          new Date(msgObj.rxDate).toLocaleTimeString("sv-SV")}{" "}
        {msgObj.user + ": "}
        <span style={{ color: msgObj.color }}>{msgObj.text}</span>
      </CardContent>
    </Card>
  )
}

export default RegularMessageBlock
