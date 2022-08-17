import React, { useState, createContext } from "react"

//Material-ui
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"

const DarkModeContext = createContext()

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000",
    },
    chatBubble: "rosemary",
  },
})

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
})

const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true)
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </DarkModeContext.Provider>
  )
}

export { DarkModeContext, DarkModeProvider }
