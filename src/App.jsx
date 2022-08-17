import React from "react"
// import ChatPage from "./pages/chatPage"
import MainPage from "./pages/MainPage"
import { DarkModeProvider } from "./contexts/themeContext"
import { SettingsProvider } from "./contexts/settingsContext"

const App = () => {
  return (
    <DarkModeProvider>
      <SettingsProvider>
        <MainPage />
      </SettingsProvider>
    </DarkModeProvider>
  )
}

export default App
