import React, { useState, createContext, useEffect } from "react"

//import { SettingsContextProps } from "../interface/iSettings"

const SettingsContext = createContext()

const SettingsProvider = ({ children }) => {
  const [showChatLogs, setShowChatLogs] = useState(false)
  const [chatWidth, setChatWidth] = useState(28)

  const toggleShowChatLogs = () => {
    setShowChatLogs(!showChatLogs)
  }

  const handleResize = () => {
    resizeChat()
  }

  const resizeChat = () => {
    if (window.innerWidth < 1200) {
      setChatWidth(100)
    } else if (window.innerWidth > 1200) {
      setChatWidth(28)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize, false)
    handleResize()
  })

  return (
    <SettingsContext.Provider
      value={{
        showChatLogs,
        toggleShowChatLogs,
        chatWidth,
        setChatWidth,
        handleResize,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsContext, SettingsProvider }
