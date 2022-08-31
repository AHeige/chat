import React, { useEffect, useState, useContext } from "react"
import Cookies from "js-cookie"

//Sound
import useSound from "use-sound"
import messageSound from "../assets/messageSound.mp3"
import ChatFx2 from "../assets/ChatFx.mp3"

//Pages
import Game2D from "../components/Game2D"

//Components
import Chat from "../components/Chat"
import SimpleDialog from "../components/SimpleDialog"
import SettingsMenu from "../components/SettingsMenu"

//Material UI
import Grid from "@mui/material/Grid"
import WestIcon from "@mui/icons-material/West"
import EastIcon from "@mui/icons-material/East"
import CommentIcon from "@mui/icons-material/Comment"
import SettingsIcon from "@mui/icons-material/Settings"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import AppBar from "@mui/material/AppBar"
import TuneIcon from "@mui/icons-material/Tune"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import Badge from "@mui/material/Badge"

//Contexts
import { DarkModeContext } from "../contexts/themeContext"
import { SettingsContext } from "../contexts/settingsContext"

const MainPage = () => {
  const [messages, setMessages] = useState([])
  const [sock, setSock] = useState()
  const [clientId, setClientId] = useState(-1)
  const [socketLost, setSocketLost] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [newMessages, setNewMessages] = useState([])
  const [notifyOthers, setNotifyOthers] = useState(false)
  const [newReaction, setNewReaction] = useState([])
  const [pageTitle, setPageTitle] = useState(document.title)
  const [play, { stop }] = useSound(ChatFx2)

  const { userName, temporaryName, setTemporaryName, startWidthChatOpen } =
    useContext(SettingsContext)

  //Context
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext)

  useEffect(() => {
    const host = new URL(window.location.href).hostname
    const socket = new WebSocket("ws://" + host + ":5678")
    setSock(socket)
    addEventListeners(socket)
  }, [socketLost])

  useEffect(() => {
    setIsOpen(startWidthChatOpen)
  }, [startWidthChatOpen])

  const getCidFromCookie = () => {
    let cid = parseInt(Cookies.get("cid"))
    if (isNaN(cid)) {
      return false
    }
    return cid
  }

  const addEventListeners = (socket) => {
    socket.addEventListener("message", (event) => {
      let msgObj = JSON.parse(event.data)
      console.log("msgObj ", msgObj)
      if (msgObj.newReaction) {
        setNewReaction(msgObj)
        return
      }

      if (msgObj.cidResponse) {
        Cookies.set("cid", msgObj.cidOption, { expires: 365 })

        setClientId(() => {
          return getCidFromCookie()
        })

        msgObj.messageHistory.forEach((msg) => {
          addMessage(msg)
        })
      }

      if (getCidFromCookie() === false) {
        sendWith(socket, { clientInit: true })
        return
      } else {
        setClientId(() => {
          return getCidFromCookie()
        })
      }

      if (msgObj.initMessage) {
        msgObj.messageHistory.forEach((msg) => {
          addMessage(msg)
        })

        msgObj.text = msgObj.text + " Player " + getCidFromCookie()

        msgObj.user = "Player #" + getCidFromCookie()
        Cookies.set("temporaryName", msgObj.user, { expires: 365 })
        sendWith(socket, { cid: getCidFromCookie(), haveCookieCid: true })
      }

      msgObj.mid = messages.length
      removeAckMessage(msgObj)
      addMessage(msgObj)
      setNotifyOthers(true)

      if (!msgObj.systemMessage) {
        setNewMessages((previous) => {
          return [...previous, msgObj]
        })
      }
      setTemporaryName("Player #" + getCidFromCookie())
    })

    socket.addEventListener("close", (event) => {
      setSocketLost(true)
    })
  }

  useEffect(() => {
    if (newReaction) {
      const foundMessage = messages.find(
        (old) => old.srvAckMid === newReaction.srvAckMid
      )
      const update = messages.map((msg) => {
        if (msg.srvAckMid === foundMessage.srvAckMid) {
          return { ...msg, reactions: newReaction.reactions }
        }
        return msg
      })

      setMessages(update)
      if (newReaction.cid !== clientId) {
        playSound()
      }
    }
  }, [newReaction, setNewReaction])

  useEffect(() => {
    if (newMessages.length > 0) {
      const latestMessage = newMessages[newMessages.length - 1]

      const imTheSender = latestMessage.cid === clientId

      if (notifyOthers === true && !imTheSender) {
        setNotifyOthers((previous) => !previous)
        playSound()
      }
    }
  }, [newMessages])

  const addMessage = (message) => {
    setMessages((oldMessages) => {
      return [...oldMessages, message]
    })
  }

  const removeAckMessage = (msg) => {
    setMessages((oldMessages) => {
      return oldMessages.filter((old) => {
        return !(old.cid === msg.cid && old.mid === msg.srvAckMid)
      })
    })
  }

  const sendMessage = (messageObject) => {
    sendWith(sock, messageObject)
  }

  const sendWith = (socket, messageObject) => {
    if (!socket) {
      console.error("socket is undefined")
      return
    }
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(messageObject))
    } else {
      console.error("socket not open, readyState=" + socket.readyState)
    }
  }

  //Setting a random (1-5) color onto text
  const textColor = {
    1: "#FF0000", //Red
    2: "#008000", //Green
    3: "#0000FF", //Blue
    4: "#800080", //Purple
    5: "#800000", //Brown
  }

  const colorPicker = () => {
    const number = Math.floor(Math.random() * 5) + 1

    return number
  }

  const handleMessageSubmit = (message) => {
    if (!message) {
      return
    }

    if (sock.readyState !== 1) {
      setSocketLost((oldVal) => !oldVal)
    }

    const messageObject = {
      reactions: [],
      newReaction: false,
      cid: clientId,
      color: textColor[colorPicker()],
      mid: messages.length,
      rxDate: new Date(),
      srvAck: false,
      text: message,
      thisIsMe: true,
      type: 1,
      user: userName ? userName : "Player #" + getCidFromCookie(),
    }

    addMessage(messageObject)
    sendMessage(messageObject)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const toggleDrawer = () => {
    setIsOpen((previous) => !previous)
  }

  const playSound = () => {
    play()
  }

  useEffect(() => {
    setNewMessages([])
  }, [isOpen])

  const handleReaction = (reaction) => {
    sock.send(JSON.stringify(reaction))
  }

  return (
    <>
      <AppBar
        style={{
          alignItems: "end",
          position: "fixed",
          zIndex: "10000",
          marginRight: "0.5em",
        }}
        color={isOpen ? "default" : "transparent"}
        elevation={0}
      >
        <Stack
          direction="row"
          spacing={1}
          style={{ marginTop: "0.7em", marginBottom: "0.7em" }}
        >
          <Button variant="outlined" onClick={toggleDarkMode}>
            {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </Button>
          <Button variant="outlined" onClick={() => setOpenDialog(true)}>
            <SettingsIcon />
          </Button>

          <Button
            variant="outlined"
            endIcon={isOpen && <EastIcon />}
            onClick={toggleDrawer}
          >
            <CommentIcon />
            <Badge
              sx={{ marginBottom: "1.2em", marginLeft: "0.5em" }}
              badgeContent={!isOpen ? newMessages.length : null}
              color="warning"
            ></Badge>
          </Button>
        </Stack>
      </AppBar>

      <SimpleDialog
        open={openDialog}
        handleClose={handleClose}
        title={"Settings"}
        titleIcon={<TuneIcon />}
        bodyComponent={<SettingsMenu />}
      />

      <Grid container sx={{ overflow: "hidden" }}>
        <Grid item xs={12}>
          <Game2D id="aster1" cid={clientId}></Game2D>
        </Grid>
        <Chat
          messages={messages}
          sendMessage={handleMessageSubmit}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          clientId={clientId}
          handleReaction={handleReaction}
        />
      </Grid>
    </>
  )
}

export default MainPage
