// import React from "react"
import React, { useRef, useEffect } from 'react'

let block = {
    x:50,
    y:50,
    w:10,
    h:10,
    dx:3,
    dy:1,
    c:'#fff'
}

function renderBlock(ctx, block) {
    ctx.fillStyle = block.c
    ctx.fillRect(block.x, block.y, block.w, block.h)
}

function wrap (block, w, h, border) {
    if (block.x >= w) block.x = border
    if (block.y >= h) block.y = border
    if (block.x < border) block.x = w - border
    if (block.y < border) block.y = h - border
}

function bounce (block, w, h, border) {
    if (block.x >= w - block.w - border || block.x < border) block.dx = -block.dx
    if (block.y >= h - block.h - border || block.y < border) block.dy = -block.dy
    return block.x >= w - block.w - border
}


function gameLoop(ctx, sender) {
    console.log ("fameloop")
    function update() {
        // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = '#283202'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        renderBlock(ctx, block)
        block.x += block.dx
        block.y += block.dy
        if (bounce (block, ctx.canvas.width, ctx.canvas.height, 0)) {
            sender("bunced right")
        }
        requestAnimationFrame(update)
        
    }
    update()
}


function Game2D (props) {
    const game2DcanvasRef = useRef(null)

    useEffect(() => {
        const canvas = game2DcanvasRef.current
        const context = canvas.getContext('2d')
        gameLoop(context, props.senderFunc)
      }, [])
  
    return (
        <div>
            <h1>Game2D</h1>
            <canvas ref={game2DcanvasRef} id={props.id} className="Game2DCanvas"></canvas>
        </div>);
}

export default Game2D
