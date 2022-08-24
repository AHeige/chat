import React, { useState, createContext, useEffect } from "react"

//import { SettingsContextProps } from "../interface/iSettings"

const SettingsContext = createContext()

const SettingsProvider = ({ children }) => {
  const [showChatLogs, setShowChatLogs] = useState(false)
  const [chatWidth, setChatWidth] = useState(28)
  const [bodyWidth, setBodyWidth] = useState(window.innerWidth)

  const toggleShowChatLogs = () => {
    setShowChatLogs(!showChatLogs)
  }

  const handleResize = () => {
    if (window.innerWidth < 1200) {
      if (chatWidth === 100) {
        return
      } else setChatWidth(100)
    } else if (window.innerWidth > 1200) {
      setChatWidth(28)
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        showChatLogs,
        toggleShowChatLogs,
        chatWidth,
        setChatWidth,
        setBodyWidth,
        bodyWidth,
        handleResize,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsContext, SettingsProvider }
