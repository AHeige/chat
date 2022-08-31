import React, { useContext, useRef } from "react"
import Cookies from "js-cookie"

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
import Slider from "@mui/material/Slider"
import Divider from "@mui/material/Divider"
import AspectRatioIcon from "@mui/icons-material/AspectRatio"
import GridOffIcon from "@mui/icons-material/GridOff"
import GridOnIcon from "@mui/icons-material/GridOn"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import NoAccountsIcon from "@mui/icons-material/NoAccounts"
import BadgeIcon from "@mui/icons-material/Badge"
import Input from "@mui/material/Input"
import ContentPasteOffIcon from "@mui/icons-material/ContentPasteOff"
import AssignmentIcon from "@mui/icons-material/Assignment"

//Contexts
import { DarkModeContext } from "../contexts/themeContext"
import { SettingsContext } from "../contexts/settingsContext"

const SettingsMenu = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext)
  const ref = useRef(null)

  const {
    showChatLogs,
    toggleShowChatLogs,
    chatWidth,
    setChatWidth,
    userDecision,
    setUserDecision,
    toggleUserDecision,
    showMyAvatar,
    toggleShowMyAvatar,
    userName,
    setUserName,
    temporaryName,
    setChatWidthManual,
    startWidthChatOpen,
    toggleStartWidthChatOpen,
  } = useContext(SettingsContext)

  const handleToggleTheme = () => {
    toggleDarkMode()
  }

  const handleToggleChatLogs = () => {
    toggleShowChatLogs()
  }

  const handleChangeChatWidth = (e, newValue) => {
    setChatWidth(newValue)
    setUserDecision(true)
    setChatWidthManual(newValue)
  }

  const handleToggleUserDecision = () => {
    toggleUserDecision()
  }

  const handleToggleShowMyAvatar = () => {
    toggleShowMyAvatar()
  }

  const handleChangeName = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      setUserName(ref.current.value)
    }
  }

  const handleStartWidthChatOpenToggle = () => {
    toggleStartWidthChatOpen()
  }

  return (
    <List sx={{ pt: 0 }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            <BadgeIcon />
          </Avatar>
        </ListItemAvatar>
        Username:
        <Input
          style={{
            marginLeft: "1em",
          }}
          onKeyDown={(e) => handleChangeName(e)}
          placeholder={userName ? userName : temporaryName}
          inputRef={ref}
        ></Input>
      </ListItem>

      <Divider />
      <ListItem>Theme Settings</ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText>Dark (Side) Mode</ListItemText>
        <Switch checked={darkMode} onChange={handleToggleTheme}></Switch>
      </ListItem>
      <Divider />
      <ListItem>Chat Settings</ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            {startWidthChatOpen ? (
              <SpeakerNotesIcon />
            ) : (
              <SpeakerNotesOffIcon />
            )}
          </Avatar>
        </ListItemAvatar>
        <ListItemText>Chat open on start</ListItemText>
        <Switch
          checked={startWidthChatOpen}
          onChange={handleStartWidthChatOpenToggle}
        ></Switch>
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            {showChatLogs ? <AssignmentIcon /> : <ContentPasteOffIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText>Show chat logs</ListItemText>
        <Switch checked={showChatLogs} onChange={handleToggleChatLogs}></Switch>
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            {showMyAvatar ? <AccountCircleIcon /> : <NoAccountsIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText>Show my avatar</ListItemText>
        <Switch
          checked={showMyAvatar}
          onChange={handleToggleShowMyAvatar}
        ></Switch>
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            {userDecision ? <GridOffIcon /> : <GridOnIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText>Manual chat width</ListItemText>
        <Switch
          checked={userDecision}
          onChange={handleToggleUserDecision}
        ></Switch>
      </ListItem>
      <ListItem style={{ marginBottom: 0, paddingBottom: 0 }}>
        <ListItemText style={{ marginBottom: 0, paddingBottom: 0 }}>
          Chat width: {`${chatWidth}%`}
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            <AspectRatioIcon />
          </Avatar>
        </ListItemAvatar>
        <Slider
          sx={{ width: "70%" }}
          size="small"
          value={chatWidth}
          min={25}
          onChange={(e, newValue) => handleChangeChatWidth(e, newValue)}
        ></Slider>
      </ListItem>
    </List>
  )
}

export default SettingsMenu
