import React from "react"

import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Avatar from "@mui/material/Avatar"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import AspectRatioIcon from "@mui/icons-material/AspectRatio"
import { blue } from "@mui/material/colors"

const SettingsMenu = () => {
  return (
    <List sx={{ pt: 0 }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            <AspectRatioIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText>Game Width</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            <AspectRatioIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText>Something else cool</ListItemText>
      </ListItem>
    </List>
  )
}

export default SettingsMenu
