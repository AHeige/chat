import React, {
  MutableRefObject,
  useRef,
  useContext,
  useState,
  useEffect,
} from "react"

//Material UI
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Avatar from "@mui/material/Avatar"

//Reactions
import { FacebookSelector, FacebookCounter } from "@charkour/react-reactions"

//Interface
import { msgObj } from "../interface/iMessages"

import { SettingsContext } from "../contexts/settingsContext"

const RegularMessageBlock = ({ msgObj, clientId, handleReaction }) => {
  const { showMyAvatar, toggleShowMyAvatar, userName, temporaryName } =
    useContext(SettingsContext)
  const [showReactionBar, setShowReactionBar] = useState(false)
  const [reaction, setReaction] = useState([])
  const cardRef = useRef(null)
  const myMessage = msgObj.cid === clientId

  const messageDate = new Date(msgObj.rxDate).toLocaleTimeString("sv-SV")

  const avatarSettings = {
    size: "2em",
    margin: "0.4em",
    fontSize: "1em",
  }

  const userColor = () => {
    const color = msgObj.cid

    const colorPicker = {
      1: "#F6A993",
      2: "#829C86",
      3: "#FBDEBB",
      4: "#D486AB",
      5: "#7554AA",
      6: "#F9CDA7",
      7: "#F6DBB2",
      8: "#EDA146",
      9: "#E8498C",
      10: "#6A518E",
    }

    return colorPicker[color > 10 ? 10 : color]
  }

  const handleOnHover = (set) => {
    setShowReactionBar(set)
  }

  const handleChosenReaction = (value) => {
    const reactionObj = {
      emoji: value,
      by: userName ? userName : temporaryName,
    }

    msgObj.reactions.push(reactionObj)
    msgObj.newReaction = true

    //Enable if more reactions from one user
    /*     setReaction((previous) => {
      return [...previous, reactionObj]
    }) */

    handleReaction(msgObj)
    handleOnHover(false)
  }

  const reactionElement = () => {
    if (msgObj.reactions) {
      return (
        <span
          style={{
            float: myMessage ? "right" : "left",
          }}
        >
          <FacebookCounter
            counters={msgObj.reactions}
            user={userName ? userName : temporaryName}
          />
        </span>
      )
    }
  }

  return (
    <span
      onMouseOver={() => handleOnHover(true)}
      onMouseLeave={() => handleOnHover(false)}
    >
      <CardHeader
        sx={{
          padding: "0",
          opacity: "0.8",
        }}
        subheaderTypographyProps={{ marginLeft: myMessage ? "" : "2.5em" }}
        subheader={
          msgObj.user + " - " + (msgObj.srvAck ? "" : "*") + messageDate
        }
      />

      {(showMyAvatar || !myMessage) && (
        <Avatar
          sx={{
            float: myMessage ? "right" : "left",
            width: avatarSettings.size,
            height: avatarSettings.size,
            marginTop: avatarSettings.margin,
            marginRight: myMessage ? "" : avatarSettings.margin,
            marginLeft: myMessage ? avatarSettings.margin : "",
            fontSize: avatarSettings.fontSize,
            bgcolor: userColor(),
            color: "#fff",
          }}
        >
          {Array.from(msgObj.user)[0]}
          {Array.from(msgObj.user)[msgObj.user.length - 1]}
        </Avatar>
      )}

      <Card
        style={{
          width: "fit-content",
          backgroundColor: myMessage ? "rgb(212, 168, 140)" : "#E4E6EB",
          color: myMessage ? "#fff" : "#000",
          textAlign: "left",
          borderRadius: "18px",
          borderBottomLeftRadius: myMessage ? "18px" : "4px",
          borderBottomRightRadius: myMessage ? "4px" : "18px",
        }}
      >
        <CardContent
          ref={cardRef}
          style={{ width: "fit-content", padding: "10px" }}
        >
          <span style={{ wordBreak: "break-word" }}>{msgObj.text}</span>
        </CardContent>
        {showReactionBar && (
          <span
            style={{
              right: myMessage ? 0 : "",
              display: "flex",

              zIndex: "100",
              position: "absolute",
            }}
          >
            <FacebookSelector
              iconSize={30}
              style={{ width: "fit-content" }}
              onSelect={(value) => handleChosenReaction(value)}
            />
          </span>
        )}
      </Card>

      {reaction && reactionElement()}
    </span>
  )
}

export default RegularMessageBlock
