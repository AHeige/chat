import React, { useContext, useState } from "react"

//Material UI
import CardContent from "@mui/material/CardContent"
import SystemMessageBlock from "./SystemMessageBlock"
import RegularMessageBlock from "./RegularMessageBlock"

//Contexts
import { SettingsContext } from "../contexts/settingsContext"

const MessageCard = ({ msgObj, clientId, handleReaction }) => {
  const { showChatLogs } = useContext(SettingsContext)

  const systemMessage =
    msgObj.userJoined ||
    msgObj.userLeft ||
    msgObj.initMessage ||
    msgObj.cidResponse

  const commandLine = msgObj.chatCommand

  return (
    <>
      {/* Showing server response on chat commands like /clear */}
      {commandLine && (
        <CardContent style={{ fontSize: "1em", marginLeft: "1em" }}>
          <SystemMessageBlock msgObj={msgObj} />
        </CardContent>
      )}
      {/* Showing system generated messages if user settings showChatLogs is true (on) */}
      {systemMessage && showChatLogs && (
        <CardContent style={{ fontSize: "1em", marginLeft: "1em" }}>
          <SystemMessageBlock msgObj={msgObj} />
        </CardContent>
      )}
      {/* If not system message or a chat command it counts as a regular message */}
      {!systemMessage && !commandLine && (
        <CardContent style={{ fontSize: "1em", marginLeft: "1em" }}>
          <RegularMessageBlock
            style={{ alignContent: "right" }}
            msgObj={msgObj}
            clientId={clientId}
            handleReaction={handleReaction}
          />
        </CardContent>
      )}
    </>
  )
}

export default MessageCard
