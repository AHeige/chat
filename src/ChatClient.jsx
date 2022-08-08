import React, {useRef} from "react"
import Box from "@mui/material/Box"
import BottomNavigation from "@mui/material/BottomNavigation"
import Input from "@mui/material/Input"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Chip from "@mui/material/Chip"
import Game2D from "./pages/Game2D"


export default class MessageRenderer extends React.Component {
    
    constructor(props) {
        super(props);
        const socket = new WebSocket("ws://localhost:8080")
        this.state = { messages: [{message: "hej"}], sock: socket, inputFieldText: ''};
        socket.addEventListener("message", (event) => {
            let msgObj = JSON.parse(event.data)
            this.renderMessage(msgObj)
            console.log ({msgObj})
        })
    }

    renderMessage(message) {
        this.setState(state => (
            state.messages.push(message)
        ));
    }

    sendMessage(e) {
        if (e.key === "Enter") {
          const msg = e.target.value
          const messageObject = {
            message: msg,
            messageType: 1,
          }
        
          const x = JSON.stringify(messageObject)
        
          console.log("Attempting to send: " + msg)
          if (this.state.sock || this.state.sock.readyState === 1) {
            this.state.sock.send(x)
          } else {
            console.error("Socket not initialized, readyState=" + this.state.sock.readyState)
          }

        //   this.setState({
        //     inputFieldText: ''
        //   });
        }
      }

    render() {
    return (
        <div>
        <Game2D id='aster'></Game2D>

        {console.log(this.state.messages)}
        {/* {this.state.messages[0].message} */}
        {this.state.messages.map((obj, index) => (
            <div key={index}>{obj.message}</div>
        ))}
         <Paper
            elevation={3}
            style={{ position: "fixed", bottom: 0, width: "100%" }}>
            <BottomNavigation>
            <Box
                style={{
                width: "50%",
                backgroundColor: "#D3D3D3",
                borderRadius: "25px",
                }}>
                <Input
                style={{
                    //backgroundColor: "#D3D3D3",
                    borderRadius: "5px",
                    width: "100%",
                    height: "100%",
                    paddingLeft: "1em",
                }}
                onKeyDown={(e) => this.sendMessage(e)}
                placeholder='Aa'
                disableUnderline={true}
                // value={this.state.inputFieldText}
                ></Input>
            </Box>
            </BottomNavigation>
        </Paper>
        </div>
    );}
}
