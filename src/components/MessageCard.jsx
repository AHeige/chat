import React, { useContext } from "react"

//Material UI
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import SystemMessageBlock from "./SystemMessageBlock"
import RegularMessageBlock from "./RegularMessageBlock"

//Contexts
import { SettingsContext } from "../contexts/settingsContext"

const MessageCard = ({ msgObj, clientId }) => {
  const { showChatLogs } = useContext(SettingsContext)

  const systemMessage =
    msgObj.userJoined ||
    msgObj.userLeft ||
    msgObj.initMessage ||
    msgObj.cidResponse

  return (
    <>
      {systemMessage && showChatLogs && (
        <CardContent style={{ fontSize: "1em", marginLeft: "1em" }}>
          <SystemMessageBlock msgObj={msgObj} />
        </CardContent>
      )}
      {!systemMessage && (
        <CardContent style={{ fontSize: "1em", marginLeft: "1em" }}>
          <RegularMessageBlock
            style={{ alignContent: "right" }}
            msgObj={msgObj}
            clientId={clientId}
          />
        </CardContent>
      )}
    </>
  )
}

export default MessageCard
