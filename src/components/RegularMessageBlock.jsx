import React from "react"

//Material UI
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"

const RegularMessageBlock = ({msgObj}) => {
    return (
        <>
        <span style={{ color: "#909090" }}>
          {(msgObj.srvAck ? "" : "*") +
            new Date(msgObj.rxDate).toLocaleTimeString("sv-SV")}{" "}
        </span>
        {msgObj.user + ": "}
        <span style={{ color: msgObj.color }}>{msgObj.text}</span>
      </>
    )

}

export default RegularMessageBlock

