import React from "react"

//Material UI
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import SystemMessageBlock from "./SystemMessageBlock"
import RegularMessageBlock from "./RegularMessageBlock"

const MessageCard = ({msgObj}) => {

    const systemMessage = msgObj.userJoined || msgObj.userLeft || msgObj.initMessage || msgObj.cidResponse

    return (
        <CardContent style={{ fontSize: "1em" }}>
            {(systemMessage ? <SystemMessageBlock msgObj={msgObj}/> : <RegularMessageBlock msgObj={msgObj}/>)}
        </CardContent>
    )
}

export default MessageCard
