import React, { useContext } from "react"

//Material UI
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Avatar from "@mui/material/Avatar"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import { blue } from "@mui/material/colors"
import Switch from "@mui/material/Switch"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes"
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff"

//Contexts
import { DarkModeContext } from "../contexts/themeContext"
import { SettingsContext } from "../contexts/settingsContext"

const SettingsMenu = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext)
  const { showChatLogs, toggleShowChatLogs } = useContext(SettingsContext)

  const handleToggleTheme = () => {
    toggleDarkMode()
  }

  const handleToggleChatLogs = () => {
    toggleShowChatLogs()
  }

  return (
    <List sx={{ pt: 0 }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText>Dark (Side) Mode</ListItemText>
        <Switch checked={darkMode} onChange={handleToggleTheme}></Switch>
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            {showChatLogs ? <SpeakerNotesIcon /> : <SpeakerNotesOffIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText>Show Chat Logs</ListItemText>
        <Switch checked={showChatLogs} onChange={handleToggleChatLogs}></Switch>
      </ListItem>
    </List>
  )
}

export default SettingsMenu
