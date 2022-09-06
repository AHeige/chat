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
import Grow from "@mui/material/Grow"

//Reactions
import {
  FacebookSelector,
  FacebookCounter,
  FacebookCounterReaction,
  SlackSelector,
  SlackCounter,
  SlackCounterGroup,
} from "@charkour/react-reactions"

//Interface
import { msgObj } from "../interface/iMessages"

import { SettingsContext } from "../contexts/settingsContext"
import { Fade } from "@mui/material"

const RegularMessageBlock = ({ msgObj, clientId, handleReaction }) => {
  const { showMyAvatar, toggleShowMyAvatar, userName, temporaryName } =
    useContext(SettingsContext)
  const [showReactionBar, setShowReactionBar] = useState(false)
  const [reaction, setReaction] = useState([])
  const [hoverReaction, setHoverReaction] = useState(false)
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
      cid: clientId,
      color: userColor(),
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

  const hoverReactionElement = (username) => {
    return (
      <span
        style={{
          fontSize: "0.55em",
          fontWeight: "bold",
          display: "flex",
          width: "fit-content",
        }}
      >
        <span>{username}</span>
      </span>
    )
  }

  const toggleHoverReactions = () => {
    setHoverReaction((previous) => !previous)
  }

  const reactionElement = () => {
    if (msgObj.reactions) {
      return (
        <span
          style={{
            float: myMessage ? "right" : "left",
            zoom: 1.5,
            width: "fit-content",
          }}
        >
          <span
            style={{ display: "flex", width: "fit-content" }}
            onPointerDown={() => toggleHoverReactions()}
          >
            {msgObj.reactions.map((reaction, index) => (
              <span key={index} style={{ display: "flex", direction: "row" }}>
                <span
                  style={{
                    marginRight: hoverReaction ? "0.3em" : "",
                    marginLeft: hoverReaction ? "0.3em" : "",
                    width: "fit-content",
                    transition: "ease margin 0.3s",
                  }}
                >
                  <FacebookCounterReaction
                    key={index}
                    reaction={reaction.emoji}
                    bg={"#fff"}
                    variant={"facebook"}
                  />
                </span>
                {hoverReaction && hoverReactionElement(reaction.by)}
              </span>
            ))}
          </span>
        </span>
      )
    }
  }

  return (
    <>
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
          <CardContent
            ref={cardRef}
            style={{ width: "fit-content", padding: "10px" }}
          >
            <span style={{ wordBreak: "break-word" }}>{msgObj.text}</span>
          </CardContent>
        </Card>
      </span>
      {reaction && reactionElement()}
    </>
  )
}

export default RegularMessageBlock
