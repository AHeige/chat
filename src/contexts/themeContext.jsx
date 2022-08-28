import React, { useState, createContext, useEffect } from "react"
import Cookies from "js-cookie"

//Material-ui
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"

//import { ThemeContextProps } from "../interface/iTheme"

const DarkModeContext = createContext()

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000",
    },
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
    setDarkMode((previous) => !previous)
  }

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </DarkModeContext.Provider>
  )
}

export { DarkModeContext, DarkModeProvider }
