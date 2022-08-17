import React from "react"
// import ChatPage from "./pages/chatPage"
import MainPage from "./pages/MainPage"
import { DarkModeProvider } from "./contexts/themeContext"

const App = () => {
  return (
    <DarkModeProvider>
      <MainPage />
    </DarkModeProvider>
  )
}

export default App
