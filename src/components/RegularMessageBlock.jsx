import React from "react"

//Material UI
import { useTheme } from "@mui/material/styles"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"

const RegularMessageBlock = ({ msgObj, clientId }) => {
  const myMessage = msgObj.cid === clientId

  const messageDate = new Date(msgObj.rxDate).toLocaleTimeString("sv-SV")

  return (
    <>
      <CardHeader
        sx={{ padding: "0", opacity: "0.8" }}
        subheader={
          msgObj.user + " - " + (msgObj.srvAck ? "" : "*") + messageDate
        }
      />
      <Card
        style={{
          width: "fit-content",
          backgroundColor: myMessage ? "rgb(212, 168, 140)" : "#E4E6EB",
          color: myMessage ? "#fff" : "#000",
          textAlign: "left",
          borderRadius: "18px",
          borderBottomLeftRadius: myMessage ? "18px" : "4px",
          borderBottomRightRadius: myMessage ? "4px" : "18px",
        }}>
        <CardContent style={{ width: "fit-content", padding: "10px" }}>
          <span>{msgObj.text}</span>
        </CardContent>
      </Card>
    </>
  )
}

export default RegularMessageBlock
