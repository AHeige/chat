import React, { useEffect, useState } from "react"
import Cookies from 'js-cookie'

//Pages
import Game2D from "../components/Game2D"

//Components
import Chat from "../components/Chat"

//Material UI
import Grid from "@mui/material/Grid"

const MainPage = () => {
  const [messages, setMessages] = useState([])
  const [sock, setSock] = useState()
  const [clientId, setClientId] = useState(-1)
  const [socketLost, setSocketLost] = useState(false)

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080")
    setSock(socket)
    addEventListeners(socket)
  }, [socketLost])

  useEffect(() => {
    console.log("messages updated ", messages)
  }, [messages])

  const getCidFromCookie = () => {
    let cid = parseInt(Cookies.get('cid'))
    if (isNaN(cid)) {
      return false
    }
    return cid
  }

  const addEventListeners = (socket) => {
    socket.addEventListener("message", (event) => {
      let msgObj = JSON.parse(event.data)
      if (msgObj.cidResponse) {
        console.log ('cidResponse')
        Cookies.set('cid', msgObj.cidOption, { expires: 2 })
        setClientId(() => {
          return getCidFromCookie()
        })
      }

      if (getCidFromCookie() === false) {
        console.log ('clientInit')
        sendWith(socket, {clientInit: true})
        return
      } else {
        setClientId(() => {
          return getCidFromCookie()
        })
      }

      if (msgObj.initMessage) {
        console.log ('initMessage')
        msgObj.text = msgObj.text + ' Player ' + getCidFromCookie()
        sendWith(socket, {cid: getCidFromCookie(), haveCookieCid: true})
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
      console.error('socket is undefined')
      return
    }
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(messageObject))
    } else {
      console.error("socket not open, readyState=" + socket.readyState)
    }
  }


  const handleMessageSubmit = (e) => {
    if (e.key === "Enter") {
      const msg = e.target.value

      if (!msg) {
        return
      }

      if (sock.readyState !== 1) {
        setSocketLost((oldVal) => !oldVal)
      }

      const messageObject = {
        text: msg,
        type: 1,
        mid: messages.length,
        srvAck: false,
        rxDate: new Date(),
        cid: clientId,
        user: "(Me #" + clientId + ")",
      }

      addMessage(messageObject)
      sendMessage(messageObject)

    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Game2D id='aster' cid={clientId}></Game2D>
      </Grid>
      <Grid item xs={12}>
        <Chat messages={messages} sendMessage={handleMessageSubmit} />
      </Grid>
    </Grid>
  )
}

export default MainPage
