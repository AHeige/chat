import React, { useState, createContext, useEffect, useContext } from "react"
import Cookies from "js-cookie"

import { DarkModeContext } from "./themeContext"

const SettingsContext = createContext()

const SettingsProvider = ({ children }) => {
  const [showChatLogs, setShowChatLogs] = useState(false)
  const [chatWidth, setChatWidth] = useState(28)
  const [userDecision, setUserDecision] = useState(false)
  const [chatWidthManual, setChatWidthManual] = useState()
  const [showMyAvatar, setShowMyAvatar] = useState(false)
  const [userName, setUserName] = useState("")
  const [temporaryName, setTemporaryName] = useState("")
  const [startWidthChatOpen, setStartWidthChatOpen] = useState(false)
  const [init, setInit] = useState(true)
  const { darkMode, setDarkMode } = useContext(DarkModeContext)

  useEffect(() => {
    if (init === true && !Cookies.get("settings")) {
      //on first render and no cookies (do nothing, using the states provided above)
      handleResize()
      setInit(false)
    } else if (init === true && Cookies.get("settings")) {
      //Take the cookie and set the (united :P) states
      const cookieSettings = JSON.parse(Cookies.get("settings"))
      setInit(false)
      setShowChatLogs(cookieSettings.showChatLogs)
      setChatWidth(cookieSettings.chatWidth)
      setUserDecision(cookieSettings.userDecision)
      setShowMyAvatar(cookieSettings.showMyAvatar)
      setUserName(cookieSettings.userName)
      setDarkMode(cookieSettings.darkMode)
      setChatWidthManual(cookieSettings.chatWidthManual)
      setStartWidthChatOpen(cookieSettings.startWidthChatOpen)
    }
    if (init === false) {
      //Set the cookie with the settings because its not first render (init is false)
      const settingsObject = {
        userName: userName,
        darkMode: darkMode,
        showChatLogs: showChatLogs,
        showMyAvatar: showMyAvatar,
        userDecision: userDecision,
        chatWidth: chatWidth,
        chatWidthManual: chatWidthManual,
        startWidthChatOpen: startWidthChatOpen,
      }
      Cookies.set("settings", JSON.stringify(settingsObject), { expires: 365 })
    }
  }, [
    userName,
    darkMode,
    showChatLogs,
    showMyAvatar,
    userDecision,
    chatWidth,
    chatWidthManual,
    startWidthChatOpen,
  ])

  const toggleShowChatLogs = () => {
    setShowChatLogs((previous) => !previous)
  }

  const toggleUserDecision = () => {
    setUserDecision((previous) => !previous)
    if (!userDecision === true) {
      const chatWidthCookie = JSON.parse(Cookies.get("settings"))
      setChatWidth(
        chatWidthCookie.chatWidthManual
          ? chatWidthCookie.chatWidthManual
          : chatWidthCookie.chatWidth
      )
    } else handleResize()
  }

  const toggleShowMyAvatar = () => {
    setShowMyAvatar((previous) => !previous)
  }

  const toggleStartWidthChatOpen = () => {
    setStartWidthChatOpen((previous) => !previous)
  }

  const handleResize = () => {
    if (window.innerWidth < 1200) {
      setChatWidth(100)
    } else if (window.innerWidth > 1200) {
      setChatWidth(28)
    }
  }

  useEffect(() => {
    if (userDecision === true) {
      return
    }
    if (userDecision === false) {
      window.addEventListener("resize", handleResize, false)

      return () => {
        window.removeEventListener("resize", handleResize, false)
      }
    }
  }, [userDecision])

  return (
    <SettingsContext.Provider
      value={{
        showChatLogs,
        toggleShowChatLogs,
        chatWidth,
        setChatWidth,
        handleResize,
        toggleUserDecision,
        userDecision,
        setUserDecision,
        toggleShowMyAvatar,
        showMyAvatar,
        userName,
        setUserName,
        temporaryName,
        setTemporaryName,
        setChatWidthManual,
        toggleStartWidthChatOpen,
        startWidthChatOpen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsContext, SettingsProvider }
