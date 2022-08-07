
// Framework logic: take ref to canvas 2D context.
// Render the game with a main game renderFrame function.
// Step to next animation frame with a nextFrame function

import { Headphones } from "@mui/icons-material";

function rnd_(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function rnd(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function round2dec(num: number, dec: number=2): number {
    const exp = Math.pow(10, dec)
    return Math.round((num + Number.EPSILON) * exp) / exp
}

type Vec2d = {
    x: number;
    y: number;
}

function add(to: Vec2d, from: Vec2d): Vec2d {
    to.x+=from.x
    to.y+=from.y
    return to
}

function copy_(to: Vec2d, from: Vec2d): Vec2d {
    to.x=from.x
    to.y=from.y
    return to
}

function copy(from: Vec2d): Vec2d {
    let to: Vec2d = {x: 0, y: 0}
    to.x=from.x
    to.y=from.y
    return to
}

function to_string(v: Vec2d): string {
     return '(' + round2dec(v.x, 0) + ', ' + round2dec(v.y, 0) + ')'
}

function scalarMultiply(v: Vec2d, s: number): Vec2d {
    v.x*=s
    v.y*=s
    return v
}

function wrap(p: Vec2d, screen: Vec2d) {
    if (p.x < 0) {
        p.x = screen.x;
    }
    if (p.x > screen.x) {
        p.x = 0;
    }
    if (p.y < 0) {
        p.y = screen.y;
    }
    if (p.y > screen.y) {
        p.y = 0;
    }
}

function wrapSpaceObject(so: SpaceObject, screen: Vec2d) {
    wrap(so.position, screen)
}

function degToRad(deg: number): number {
    return deg  * Math.PI / 180
}

function heading(so: SpaceObject): Vec2d {
    return {x: Math.cos(degToRad(so.angleDegree)), y: Math.sin(degToRad(so.angleDegree))}
}

function bounceSpaceObject(so: SpaceObject, screen: Vec2d, gap: number = 1) {
    if (so.position.x < gap) {
        so.velocity.x = -so.velocity.x;
        so.position.x = gap
    }
    if (so.position.x >= screen.x) {
        so.velocity.x = -so.velocity.x;
        so.position.x = screen.x - gap
    }
    if (so.position.y < gap) {
        so.velocity.y = -so.velocity.y;
        so.position.y = gap
    }
    if (so.position.y >= screen.y) {
        so.velocity.y = -so.velocity.y;
        so.position.y = screen.y - gap
    }
}

function friction(so: SpaceObject, friction: number) {
    scalarMultiply(so.velocity, friction)
}

enum Shape {
    Triangle,
    Block,
    Ellipse,
    Asteroid,
    Ship
}

type SpaceObject = {
    shape: Shape,
    mass: number;
    size: Vec2d;
    color: string
    position: Vec2d;
    velocity: Vec2d;
    acceleration: Vec2d;
    angleDegree: number;
    name: string;
    health: number;
    killCount: number;
    fuel: number;
    enginePower: number;
    steeringPower: number;
    ammo: number;
    shotsInFlight: SpaceObject[];
    missileSpeed: number;
    canonCoolDown: number;
}

function createDefaultSpaceObject(): SpaceObject {
    let so: SpaceObject = {
        shape: Shape.Triangle,
        mass: 10, 
        size: {x: 80, y: 120},
        color: '#fff',
        position: {x: 600, y: 600},
        velocity: {x: 0.1, y: 0.1},
        acceleration: {x: 0, y: 0},
        name: 'SpaceObject',
        angleDegree: 0,
        health: 100,
        killCount: 0,
        fuel: 500,
        enginePower: 0.25,
        steeringPower: 5,
        ammo: 10,
        shotsInFlight: [],
        missileSpeed: 30,
        canonCoolDown: 0
    }

    return so
}

function drawSpaceObject(so: SpaceObject, ctx: any) {
    switch (so.shape) {
        case Shape.Triangle:
            drawTriangleObject(so, ctx)
            break
        default:
            console.error("Unknown Shape", so.shape)
    }
}

function drawShot(so: SpaceObject, ctx: any) {
    for (let shot of so.shotsInFlight) {
        ctx.fillStyle = '#0f0'
        ctx.save()
        ctx.translate(shot.position.x, shot.position.y);
        ctx.rotate((90 + shot.angleDegree) * Math.PI / 180);
        ctx.fillRect(-4, -14, 8, 28)
        ctx.restore()
    }
}


function drawTriangleObject(so: SpaceObject, ctx: any) {
    let scale: number = 2
    ctx.save()
    ctx.translate(so.position.x, so.position.y);
    ctx.fillStyle = '#fff'
    // ctx.fillRect(-10, -10, 20, 20)
    ctx.font = '32px courier';
    if (so.fuel < 10) ctx.fillStyle = '#ee0'
    if (so.fuel < 0.1) ctx.fillStyle = '#e00'
    ctx.fillText('fuel: ' + round2dec(so.fuel, 1), 150, -50)
    ctx.fillStyle = '#fff'
    ctx.fillText('sif: ' + so.shotsInFlight.length, 150, 0)
    ctx.fillText(to_string(so.position), 150, -100)
    ctx.fillText(to_string(so.velocity), 150, -150)
    ctx.rotate((90 + so.angleDegree) * Math.PI / 180);
    ctx.beginPath();
    ctx.strokeStyle = so.color;
    ctx.lineWidth = 5;

    // hull
    ctx.moveTo(0, (-so.size.y/2)*scale);
    ctx.lineTo((-so.size.x/4)*scale, (so.size.y/4)*scale);
    ctx.lineTo((so.size.x/4)*scale, (so.size.y/4)*scale);
    ctx.lineTo(0, (-so.size.y/2)*scale);


    // canons
    ctx.moveTo(8, 10)
    ctx.lineTo(8, -40)
    ctx.moveTo(-8, 10)
    ctx.lineTo(-8, -40)

    ctx.stroke();

    // tower
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    drawVector(so.velocity, so.position, 5, ctx)
    // drawVector(heading(so), so.position, 45, ctx, {x: -10, y: -10})
    // drawVector(heading(so), so.position, 45, ctx, {x: 10, y: 10})
    drawShot(so, ctx)
}

function drawVector(v: Vec2d, position: Vec2d, scale: number = 2, ctx: any, offset: Vec2d = {x: 0, y:0}) {
    ctx.save()
    ctx.translate(position.x + offset.x, position.y + offset.y);
    ctx.beginPath();
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 5;
    ctx.moveTo(0, 0)
    ctx.lineTo(scale * v.x, scale * v.y);
    ctx.stroke();
    ctx.restore()
}

let upPressed: boolean = false
let downPressed: boolean = false
let rightPressed: boolean = false
let leftPressed: boolean = false
let spacePressed: boolean = false
let bounce: boolean = false

function arrowControl (e: any, value: boolean) {
    if (e.key === "ArrowUp") {
        upPressed = value
    }
    if (e.key === "ArrowDown") {
        downPressed = value
    }
    if (e.key === "ArrowLeft") {
        leftPressed = value
    }
    if (e.key === "ArrowRight") {
        rightPressed = value
    }
    if (e.code === "Space") { // wtf code...
        spacePressed = value
    }
    if (e.key === "b") {
        console.log ({bounce})
        bounce = value
    }
}

function clearInputKeys() {
    upPressed = false
    downPressed = false
    rightPressed = false
    leftPressed = false
    spacePressed = false
}

function init() {
    console.log('adds event listeners')
    document.addEventListener('keydown', (event) => arrowControl(event, true));
    document.addEventListener('keyup', (event) => arrowControl(event, false));
}

function applyEngine(so: SpaceObject): number {
    if (so.fuel > 0) {
        so.fuel-=so.enginePower
        return so.enginePower
    }
    so.fuel = 0
    console.log(so.name + " has no more fuel!", so)
    return 0
}



function fire(so: SpaceObject) {
    let shot = createDefaultSpaceObject()
    let head: Vec2d = copy(so.position)
    const aimError = 12;
    head = add(head, scalarMultiply(heading(so), 35))
    head = add(head, {x: rnd(-aimError, aimError), y: rnd(-aimError, aimError)})
    shot.velocity = scalarMultiply(heading(so), so.missileSpeed)
    // shot.position = {x: so.position.x + rnd(-aimError, aimError), y: so.position.y + rnd(-aimError, aimError) }
    shot.position = head
    shot.angleDegree = so.angleDegree
    so.shotsInFlight.push(shot)
}

function ofScreen(v: Vec2d, screen: Vec2d) {
    if (v.x > screen.x) return true
    if (v.x < 0) return true
    if (v.y > screen.y) return true
    if (v.y < 0) return true
    return false
}

function decayShots(so: SpaceObject, screen: Vec2d) {
    so.shotsInFlight = so.shotsInFlight.filter(function(e) {
        return !ofScreen(e.position, screen)
    })
}

function applySteer(so: SpaceObject): number {
    return so.steeringPower
}

function spaceObjectKeyController(so: SpaceObject) {
    if (upPressed) {
        let angleRadians: number = so.angleDegree  * Math.PI / 180
        let engine = applyEngine(so)
        add(so.velocity, {x: engine * Math.cos(angleRadians), y: engine * Math.sin(angleRadians)})
    }

    if (downPressed) {
        let angleRadians: number = so.angleDegree  * Math.PI / 180
        let engine = applyEngine(so)
        add(so.velocity, {x: -engine * Math.cos(angleRadians), y: -engine * Math.sin(angleRadians)})
    }

    if (leftPressed) {
        so.angleDegree-=applySteer(so)
    }

    if (rightPressed) {
        so.angleDegree+=applySteer(so)
    }

    if (spacePressed) {
        // console.log ("fire!")
        fire(so)
    }
}


function updateSpaceObject(so: SpaceObject, screen: Vec2d) {
    add(so.position, so.velocity)
    add(so.velocity, so.acceleration)
    for (let shot of so.shotsInFlight) {
        add(shot.position, shot.velocity)
        add(shot.velocity, shot.acceleration)
    }
    decayShots(so, screen)
}


const myShip: SpaceObject = createDefaultSpaceObject()

function renderFrame (ctx: any) {
    drawSpaceObject(myShip, ctx)
}

function nextFrame (ctx: any) {
    const screen: Vec2d = {x: ctx.canvas.width, y: ctx.canvas.height}
    spaceObjectKeyController(myShip)

    if (bounce) {
        bounceSpaceObject(myShip, screen)
    } else {
        wrapSpaceObject(myShip, screen)
    }

    friction(myShip, 0.998)
    updateSpaceObject(myShip, screen)
}

const pic32lander = {renderFrame: renderFrame, nextFrame: nextFrame, init: init, round2dec: round2dec}

export default pic32lander
