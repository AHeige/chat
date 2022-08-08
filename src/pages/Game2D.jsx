// import React from "react"
import React, { useRef, useEffect } from "react"
import pic32lander from "./pic32lander"

function renderFps(ctx, frameTime) {
  ctx.fillStyle = "#fff"
  ctx.font = "50px courier"
  ctx.fillText(
    "FPS: " + pic32lander.round2dec(1 / (frameTime / 1000), 3),
    30,
    60
  )
}

function clearScreen(ctx) {
  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

let lastTime_ms

function renderLoop(ctx, sender, renderFrameCallback, nextFrameCallback) {
  console.log("renderLoop")
  pic32lander.init()
  function update(time_ms) {
    clearScreen(ctx)
    renderFrameCallback(ctx)
    requestAnimationFrame(update)
    nextFrameCallback(ctx)
    renderFps(ctx, time_ms - lastTime_ms)
    lastTime_ms = time_ms
  }
  update()
}

function Game2D(props) {
  const game2DcanvasRef = useRef(null)

  useEffect(() => {
    const canvas = game2DcanvasRef.current
    const context = canvas.getContext("2d")
    context.canvas.width = 400 * 3
    context.canvas.height = 300 * 3
    console.log("Canvas width: " + context.canvas.width)
    console.log("Canvas height: " + context.canvas.height)

    renderLoop(
      context,
      props.senderFunc,
      pic32lander.renderFrame,
      pic32lander.nextFrame
    )
  }, [props.senderFunc])

  return (
    <div>
      <canvas
        ref={game2DcanvasRef}
        id={props.id}
        className='Game2DCanvas'></canvas>
    </div>
  )
}

export default Game2D
