import React, { useState, createContext } from "react"

const SettingsContext = createContext()

const SettingsProvider = ({ children }) => {
  const [showChatLogs, setShowChatLogs] = useState(false)

  const toggleShowChatLogs = () => {
    setShowChatLogs(!showChatLogs)
  }

  return (
    <SettingsContext.Provider value={{ showChatLogs, toggleShowChatLogs }}>
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsContext, SettingsProvider }
