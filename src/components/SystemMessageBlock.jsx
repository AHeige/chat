import React from "react"

//Material UI
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"

const SystemMessageBlock = ({msgObj}) => {
    // const SystemMessageBlock = () => {

    return (
        <>
        <span
          style={{
            color: "#909090",
            fontStyle: "italic",
            fontSize: "0.9em",
          }}>
          {(msgObj.srvAck ? "" : "*") +
            new Date(msgObj.rxDate).toLocaleTimeString("sv-SV")}{" "}
          {msgObj.user + " "}
          {msgObj.text}
        </span>
      </>
    )

}

export default SystemMessageBlock
