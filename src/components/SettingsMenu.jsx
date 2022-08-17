import React, { useContext } from "react"

//Material UI
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Avatar from "@mui/material/Avatar"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import AspectRatioIcon from "@mui/icons-material/AspectRatio"
import { blue } from "@mui/material/colors"
import Switch from "@mui/material/Switch"
import LightModeIcon from "@mui/icons-material/LightMode"
import NightlightIcon from "@mui/icons-material/Nightlight"

//Contexts
import { DarkModeContext } from "../contexts/themeContext"

const SettingsMenu = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext)

  const handleToggle = () => {
    toggleDarkMode()
  }

  return (
    <List sx={{ pt: 0 }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            {darkMode ? <NightlightIcon /> : <LightModeIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText>Dark (Side) Mode</ListItemText>
        <Switch checked={darkMode} onChange={handleToggle}></Switch>
      </ListItem>
    </List>
  )
}

export default SettingsMenu
