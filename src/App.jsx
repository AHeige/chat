import React, { useEffect, useContext, useRef } from "react"

//Pages
import MainPage from "./pages/MainPage"

//Contexts
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
