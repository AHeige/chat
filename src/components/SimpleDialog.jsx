import React from "react"

//Material-UI
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Avatar from "@mui/material/Avatar"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Button from "@mui/material/Button"
import CloseIcon from "@mui/icons-material/Close"
import { blue } from "@mui/material/colors"
import Divider from "@mui/material/Divider"

const SimpleDialog = ({
  open,
  handleClose,
  title,
  titleIcon,
  bodyComponent,
}) => {
  return (
    <Dialog open={open}>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
              {titleIcon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primaryTypographyProps={{ variant: "h6" }}>
            {title + " "}{" "}
            <Button
              style={{
                float: "right",
                marginTop: "-1.3em",
                marginRight: "-1.07em",
                width: "3.5em",
                minWidth: "unset",
              }}
              variant="contained"
              onClick={() => handleClose()}
            >
              <CloseIcon />
            </Button>
          </ListItemText>
        </ListItem>
      </List>
      <Divider />
      {bodyComponent}
    </Dialog>
  )
}

export default SimpleDialog
