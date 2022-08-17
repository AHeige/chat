import React, { useEffect, useState, useContext } from "react"
import Cookies from "js-cookie"

//Pages
import Game2D from "../components/Game2D"

//Components
import Chat from "../components/Chat"
import SimpleDialog from "../components/SimpleDialog"
import SettingsMenu from "../components/SettingsMenu"

//Material UI
import Grid from "@mui/material/Grid"
import WestIcon from "@mui/icons-material/West"
import CommentIcon from "@mui/icons-material/Comment"
import SettingsIcon from "@mui/icons-material/Settings"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import AppBar from "@mui/material/AppBar"
import TuneIcon from "@mui/icons-material/Tune"
import Paper from "@mui/material/Paper"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"

//Contexts
import { DarkModeContext } from "../contexts/themeContext"

const MainPage = () => {
  const [messages, setMessages] = useState([])
  const [sock, setSock] = useState()
  const [clientId, setClientId] = useState(-1)
  const [socketLost, setSocketLost] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  //Context
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext)

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080")
    setSock(socket)
    addEventListeners(socket)
  }, [socketLost])

  useEffect(() => {
    console.log("messages updated ", messages)
  }, [messages])

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
      if (msgObj.cidResponse) {
        console.log("cidResponse")
        Cookies.set("cid", msgObj.cidOption, { expires: 2 })
        setClientId(() => {
          return getCidFromCookie()
        })

        msgObj.messageHistory.forEach((msg) => {
          addMessage(msg)
        })
      }

      if (getCidFromCookie() === false) {
        console.log("clientInit")
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
        console.log("initMessage")
        msgObj.text = msgObj.text + " Player " + getCidFromCookie()
        sendWith(socket, { cid: getCidFromCookie(), haveCookieCid: true })
      }

      msgObj.mid = messages.length
      removeAckMessage(msgObj)
      addMessage(msgObj)
    })

    socket.addEventListener("close", (event) => {
      setSocketLost(true)
    })
  }

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
      text: message,
      type: 1,
      mid: messages.length,
      srvAck: false,
      rxDate: new Date(),
      cid: clientId,
      user: "(Me #" + clientId + ")",
      thisIsMe: true,
      color: textColor[colorPicker()],
    }

    addMessage(messageObject)
    sendMessage(messageObject)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <AppBar
        style={{ alignItems: "end", position: "fixed", zIndex: "10000" }}
        color="transparent"
        elevation={0}
      >
        <Stack
          direction="row"
          spacing={2}
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
            startIcon={<CommentIcon />}
            endIcon={<WestIcon />}
            onClick={toggleDrawer}
          ></Button>
        </Stack>
      </AppBar>

      <Grid container>
        <SimpleDialog
          open={openDialog}
          handleClose={handleClose}
          title={"Settings"}
          titleIcon={<TuneIcon />}
          bodyComponent={<SettingsMenu />}
        />
        <Grid item xs={12}>
          <Game2D id="aster" cid={clientId}></Game2D>
        </Grid>
        <Grid item xs={12}>
          <Chat
            messages={messages}
            sendMessage={handleMessageSubmit}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            clientId={clientId}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default MainPage
