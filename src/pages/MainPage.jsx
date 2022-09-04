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
import Tooltip from "@mui/material/Tooltip"
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
import PeopleIcon from "@mui/icons-material/People"

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
  const [newReactions, setNewReactions] = useState([])
  const [users, setUsers] = useState([])
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
        setNewReactions(msgObj)
        return
      }

      if (msgObj.requestedOnlineUsers) {
        setUsers([])
        msgObj.onlineUsers.map((user) => {
          setUsers((previous) => {
            return [...previous, user]
          })
        })
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
    if (newReactions) {
      const foundMessage = messages.find(
        (old) => old.srvAckMid === newReactions.srvAckMid
      )

      const update = messages.map((msg) => {
        if (msg.srvAckMid === foundMessage.srvAckMid) {
          return { ...msg, reactions: newReactions.reactions }
        }
        return msg
      })

      setMessages(update)
      if (newReactions.cid !== clientId) {
        playSound()
      }
    }
  }, [newReactions, setNewReactions])

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
      onlineUsers: [],
      requestedOnlineUsers: false,
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

  const handleToggleDialog = () => {
    setOpenDialog((previous) => !previous)
  }

  const usersOnline = () => {
    return (
      <>
        <h3>Users Online</h3>
        <span>
          {users.map((user, index) => (
            <p key={index}>{user.name}</p>
          ))}
        </span>
      </>
    )
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
          <Tooltip title={usersOnline()}>
            <Button variant="outlined">
              <PeopleIcon />
              <Badge
                sx={{ marginBottom: "1.2em", marginLeft: "0.5em" }}
                badgeContent={users ? users.length : null}
                color="primary"
              ></Badge>
            </Button>
          </Tooltip>
          <Tooltip
            title={darkMode ? "Turn on the lights!" : "Turn off the lights!"}
          >
            <Button variant="outlined" onClick={toggleDarkMode}>
              {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </Button>
          </Tooltip>
          <Tooltip title="Settings">
            <Button variant="outlined" onClick={() => handleToggleDialog()}>
              <SettingsIcon />
            </Button>
          </Tooltip>

          <Tooltip title={isOpen ? "Close chat" : "Open chat"}>
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
          </Tooltip>
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
