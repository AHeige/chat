import React from "react"

import { msgObj } from "../interface/iMessages"

interface Props {
  msgObj: msgObj
}

const SystemMessageBlock: React.FC<Props> = ({ msgObj }) => {
  // const SystemMessageBlock = () => {

  return (
    <>
      <span
        style={{
          fontStyle: "italic",
          fontSize: "0.9em",
        }}
      >
        {(msgObj.srvAck ? "" : "*") +
          new Date(msgObj.rxDate).toLocaleTimeString("sv-SV")}{" "}
        {msgObj.user + " "}
        {msgObj.text}
      </span>
    </>
  )
}

export default SystemMessageBlock
