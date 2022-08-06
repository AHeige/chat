// import React from "react"
import { SixtyFpsSelectOutlined } from '@mui/icons-material'
import React, { useRef, useEffect } from 'react'

let block = {
    x:50,
    y:50,
    w:50,
    h:50,
    dx:15,
    dy:5,
    c:'#000',
    angle:0.0,
    dangle:0.01
}

function renderBlock(ctx, block) {
    let cx = block.x + (block.w/2)
    let cy = block.y + (block.h/2)
    ctx.fillStyle = block.c
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI * block.angle);
    ctx.translate(-cx, -cy);
    ctx.fillRect(block.x, block.y, block.w, block.h)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function wrap (block, w, h, border) {
    if (block.x >= w) block.x = border
    if (block.y >= h) block.y = border
    if (block.x < border) block.x = w - border
    if (block.y < border) block.y = h - border
}

function bounce (block, w, h, border) {
    if (block.x >= w - block.w - border || block.x < border) {
        block.dx = -block.dx
        block.dangle = -1.7*block.dangle; 
    }

    if (block.y >= h - block.h - border || block.y < border) {
        block.dy = -block.dy
        block.dangle = -0.8*block.dangle
        // console.log ({da:block.dangle})
    }
    return block.x >= w - block.w - border
}

let diver = 1.0;
let secDiv = 1.0;
let minDiv = 1.0;

function renderHour(ctx) {
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 7;
    let w = ctx.canvas.width
    let h = ctx.canvas.height
    // console.log ({w, h})
    ctx.beginPath();
    ctx.arc(Math.floor(w/2), Math.floor(h/2), 200, 0, Math.PI * 2, true)
    ctx.stroke();

    let tx = w/2
    let ty = h/2
    // Matrix transformation
    ctx.translate(tx, ty);
    ctx.rotate(Math.PI * diver);
    diver+=0.01
    ctx.translate(-tx, -ty);


    // Rotated rectangle
    ctx.fillStyle = 'green';
    ctx.fillRect(tx - 10, ty - 20, 20, 130);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = '#000';
    ctx.fillRect(tx-5, ty-5, 10, 10);

}



function renderMinute(ctx) {
    let w = ctx.canvas.width
    let h = ctx.canvas.height
    let tx = w/2
    let ty = h/2
    // Matrix transformation
    ctx.translate(tx, ty);
    ctx.rotate(Math.PI * minDiv);
    minDiv-=0.015
    ctx.translate(-tx, -ty);


    // Rotated rectangle
    ctx.fillStyle = 'blue';
    ctx.fillRect(tx - 8, ty - 30, 16, 170);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function renderSecond(ctx) {
    let w = ctx.canvas.width
    let h = ctx.canvas.height
    let tx = w/2
    let ty = h/2
    // Matrix transformation
    ctx.translate(tx, ty);
    ctx.rotate(Math.PI * secDiv);
    secDiv+=0.02
    ctx.translate(-tx, -ty);


    // Rotated rectangle
    ctx.fillStyle = 'red';
    ctx.fillRect(tx - 5, ty - 40, 10, 205);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function round2dec(num) {
    return Math.round((num + Number.EPSILON) * 10) / 10
}

function renderFps(ctx, frameTime) {
    ctx.fillStyle = '#999'
    ctx.font = '50px courier';
    ctx.fillText('FPS: ' + round2dec(1/(frameTime/1000)), 30, 70);
}

function clearScreen(ctx) {
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#283202'
    ctx.fillStyle = '#efefef'
    // ctx.fillStyle = '#efefefef' // multiple block rendered bug??
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function renderWall(ctx) {
    ctx.fillStyle = '#ffaa44'
    ctx.fillRect(ctx.canvas.width - 5, 0, 5, ctx.canvas.height)
}

let fcounter = 0
let dt = 0
let lastTime_ms;

function gameLoop(ctx, sender) {
    console.log ("game-loop")
    function update(time_ms) {
        clearScreen(ctx)
        renderHour(ctx)
        renderMinute(ctx)
        renderSecond(ctx)
        renderBlock(ctx, block)
        renderWall(ctx)
        block.x += block.dx
        block.y += block.dy
        block.angle += block.dangle
        if (bounce (block, ctx.canvas.width, ctx.canvas.height, 0)) {
            sender("bounced right @ " + new Date().toLocaleTimeString("sv-SV"))
        }
        dt = time_ms - lastTime_ms
        requestAnimationFrame(update)
        // if (fcounter++ >= 120) {
        //     fcounter = 0
        //     let fps = 1/(dt/1000)
        //     let roundfps = round2dec(fps)
        //     console.log ({dt, time: time_ms, lastTime: lastTime_ms, fps, roundfps})
        // }
        renderFps(ctx, dt)
        lastTime_ms = time_ms
    }
    update()
}


function Game2D (props) {
    const game2DcanvasRef = useRef(null)

    useEffect(() => {
        const canvas = game2DcanvasRef.current
        const context = canvas.getContext('2d')
        canvas.width = 600*4
        canvas.height = 400*4
        console.log ("Canvas width: " + canvas.width)
        console.log ("Canvas height: " + canvas.height)
        gameLoop(context, props.senderFunc)
      }, [props.senderFunc])
  
    return (
        <div>
            <h1>Game2D</h1>
            <canvas ref={game2DcanvasRef} id={props.id} className="Game2DCanvas"></canvas>
        </div>);
}

export default Game2D
